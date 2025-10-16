import { CircularProgress } from '@mui/material';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  isPending: boolean;
};

export default function SubmitButton({ isPending, children, className, ...props }: SubmitButtonProps) {
  return (
    <Button
      {...props}
      size={"lg"}
      type='submit'
      variant={props.variant || "secondary"}
      className={cn(isPending && "cursor-default", className)}
    >
      {isPending && <CircularProgress className='absolute left-1/2 top-1/2 -translate-1/2' size={20} color="inherit" />}
      <div className={cn("flex gap-2 items-center", isPending ? "text-transparent duration-200" : "")}>
        {children}
      </div>
    </Button>
  );
}
