import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer",
  {
    variants: {
      variant: {
        /* Standard High-Contrast Monochrome Pill */
        default:
          "bg-foreground text-background hover:bg-foreground/90 shadow-sm active:scale-[0.98]",
        
        /* Rich Golden Amber Pill (Warm golden accent, dark crisp contrast text, active tactile bounce) */
        amber:
          "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.98]",
        
        /* Soft Amber Subtle Pill (secondary highlight) */
        "amber-subtle":
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25",
        
        /* Outline variant */
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground",
        
        /* Secondary Neutral Pill */
        secondary:
          "bg-muted/60 text-foreground hover:bg-muted",
        
        /* Ghost Clean */
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        
        /* Destructive */
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        
        /* Link */
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs rounded-xl",
        lg: "h-12 px-7 text-sm sm:text-base rounded-2xl font-bold",
        icon: "h-9 w-9 rounded-xl",
        pill: "h-9 px-4 rounded-full text-xs font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          buttonVariants({ variant, size, className }),
          (children.props as any)?.className
        ),
        ref,
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
