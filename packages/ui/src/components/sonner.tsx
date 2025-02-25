import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'light' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',

          // !important to override: https://github.com/shadcn-ui/ui/issues/3579
          error: '!border-none !bg-toast-error !text-foreground',
          info: '!border-none !bg-toast-info !text-foreground',
          loading: '!border-none !bg-toast-loading !text-foreground',
          success: '!border-none !bg-toast-success !text-foreground',
          warning: '!border-none !bg-toast-warning !text-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
