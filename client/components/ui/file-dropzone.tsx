import React, { useRef, useState, useCallback, useEffect } from "react";

type FileDropzoneProps = {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // bytes
  placeholder?: string;
  className?: string;
};

export default function FileDropzone({
  value,
  onChange,
  accept = "image/*,application/pdf",
  maxSize = 10 * 1024 * 1024,
  placeholder = "Upload file or drag and drop",
  className = "",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value && value.type.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFile = useCallback(
    (file?: File | null) => {
      if (!file) {
        onChange?.(null);
        return;
      }
      if (maxSize && file.size > maxSize) {
        alert("File is too large"); // заменить на UI-ошибку по желанию
        return;
      }
      if (accept && accept !== "*" && !file.type) {
        onChange?.(null);
        return;
      }
      onChange?.(file);
    },
    [onChange, accept, maxSize]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const onDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    setIsDrag(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDrag(true);
        }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={
          "w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer select-none " +
          (isDrag ? "border-secondary-foreground bg-primary-foreground/5" : "border-border bg-background") 
        }
      >
        {value ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-16 h-12 object-cover rounded" />
              ) : (
                <div className="w-16 h-12 flex items-center justify-center bg-primary-foreground rounded text-xs">FILE</div>
              )}
              <div className="text-left">
                <div className="font-medium truncate max-w-xs">{value.name}</div>
                <div className="text-xs text-muted">{Math.round(value.size / 1024)} KB</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="px-3 py-1 bg-secondary text-accent-foreground rounded-sm"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFile(null);
                }}
                className="px-3 py-1 bg-destructive text-white rounded-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-sm text-muted">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-80">
              <path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-primary-foreground">{placeholder}</div>
            <div className="text-xs text-muted">PNG, JPG, PDF up to {maxSize / 1024 / 1024}MB</div>
          </div>
        )}
      </div>
    </div>
  );
}