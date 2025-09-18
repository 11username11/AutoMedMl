'use client';

import { UploadIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useLayoutEffect, useState } from 'react';
import type { DropEvent, DropzoneOptions, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DropzoneContextType = {
  src?: File[];
  accept?: DropzoneOptions['accept'];
  maxSize?: DropzoneOptions['maxSize'];
  minSize?: DropzoneOptions['minSize'];
  maxFiles?: DropzoneOptions['maxFiles'];
};

export const renderBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

export type DropzoneProps = Omit<DropzoneOptions, 'onDrop'> & {
  src?: File[];
  className?: string;
  onDrop?: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  children?: ReactNode;
};

export const Dropzone = ({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  className,
  children,
  ...props
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message;
        onError?.(new Error(message));
        return;
      }
      onDrop?.(acceptedFiles, fileRejections, event);
    },
    ...props,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (src && src.length > 0) {
      const objectUrl = URL.createObjectURL(src[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [src]);

  return (
    <DropzoneContext.Provider
      key={JSON.stringify(src?.map(f => f.name))}
      value={{ src, accept, maxSize, minSize, maxFiles }}
    >
      <Button
        className={cn(
          "relative h-auto w-full flex-col overflow-hidden p-4 border-2 border-dashed cursor-pointer duration-200",
          isDragActive && "bg-accent/80! dark:bg-background/80! border-foreground/30!",
          className
        )}
        disabled={disabled}
        type="button"
        variant="outline"
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={disabled} />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none brightness-60"
          />
        )}

        <div className="relative z-10">{children}</div>
      </Button>
    </DropzoneContext.Provider>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone');
  }

  return context;
};

export type DropzoneContentProps = {
  children?: ReactNode;
  className?: string;
};

const maxLabelItems = 3;

export const DropzoneContent = ({
  children,
  className,
}: DropzoneContentProps) => {
  const { src } = useDropzoneContext();

  if (!src) {
    return null;
  }

  if (children) {
    return children;
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <UploadIcon className="flex items-center bg-primary/15 p-2 justify-center rounded-md text-primary box-content" size={24} />
      <p className="my-2 w-full truncate font-medium text-xs text-primary">
        {src.length > maxLabelItems
          ? `${new Intl.ListFormat('en').format(
            src.slice(0, maxLabelItems).map((file) => file.name)
          )} and ${src.length - maxLabelItems} more`
          : new Intl.ListFormat('en').format(src.map((file) => file.name))}
      </p>
      <p className="w-full truncate text-wrap text-primary text-xs">
        Drag and drop or click to replace
      </p>
    </div>
  );
};

export type DropzoneEmptyStateProps = {
  children?: ReactNode;
  className?: string;
};

export const DropzoneEmptyState = ({
  children,
  className,
}: DropzoneEmptyStateProps) => {
  const { src, accept, maxSize, minSize, maxFiles } = useDropzoneContext();

  if (src) {
    return null;
  }

  if (children) {
    return children;
  }

  let caption = '';

  if (accept) {
    caption += 'PNG, JPG';
  }

  if (minSize && maxSize) {
    caption += ` between ${renderBytes(minSize)} and ${renderBytes(maxSize)}`;
  } else if (minSize) {
    caption += ` at least ${renderBytes(minSize)}`;
  } else if (maxSize) {
    caption += ` up to ${renderBytes(maxSize)}`;
  }

  return (
    <div className={cn('flex flex-col gap-2 items-center justify-center', className)}>
      <div className="flex items-center justify-center rounded-md text-muted-foreground">
        <UploadIcon size={24} />
      </div>
      <p className="w-full truncate text-wrap text-secondary text-xs">
        Upload file or drag and drop
      </p>
      {caption && (
        <p className="text-wrap text-muted font-light text-xs">{caption}.</p>
      )}
    </div>
  );
};
