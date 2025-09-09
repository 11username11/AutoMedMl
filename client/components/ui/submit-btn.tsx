import { CircularProgress } from '@mui/material';
import { cn } from '@/lib/utils';
import { JSX } from 'react';

type SubmitButtonProps = JSX.IntrinsicElements['button'] & {
  isPending: boolean;
};

export default function SubmitButton({ isPending, children, className, ...props }: SubmitButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center justify-center gap-2 relative font-semibold text-sm h-12 p-2 px-4 w-full bg-secondary text-accent-foreground rounded-sm cursor-pointer hover:bg-secondary-foreground duration-200",
        isPending && "bg-secondary/60 cursor-default hover:bg-secondary/60",
        className
      )}
    >
      {isPending && <CircularProgress className='absolute left-1/2 top-1/2 -translate-1/2' size={20} color="inherit" />}
      <div className={isPending ? "text-transparent duration-200" : ""}>
        {children}
      </div>
    </button>
  );
}
