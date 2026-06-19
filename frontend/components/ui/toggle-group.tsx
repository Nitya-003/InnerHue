'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

const baseStyles =
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variantClasses = {
  default: 'bg-transparent hover:bg-muted hover:text-muted-foreground',
  outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
};

const sizeClasses = {
  sm: 'h-9 px-2.5',
  default: 'h-10 px-3',
  lg: 'h-11 px-5',
};

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ToggleGroupContext = React.createContext({
  size: 'default',
  variant: 'default',
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
    size?: keyof typeof sizeClasses;
    variant?: keyof typeof variantClasses;
  }
>(({ className, size = 'default', variant = 'default', children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ size, variant }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
    size?: keyof typeof sizeClasses;
    variant?: keyof typeof variantClasses;
  }
>(({ className, children, size, variant, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const finalSize = size || context.size;
  const finalVariant = variant || context.variant;

  const appliedSizeClass = sizeClasses[finalSize as keyof typeof sizeClasses] || sizeClasses.default;
  const appliedVariantClass = variantClasses[finalVariant as keyof typeof variantClasses] || variantClasses.default;

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(baseStyles, appliedSizeClass, appliedVariantClass, className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
