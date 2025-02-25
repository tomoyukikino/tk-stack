import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'light' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      toastOptions={{
        classNames: {
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
