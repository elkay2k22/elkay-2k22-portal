import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padded = true, hover = false, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'bg-white rounded-2xl shadow-card border border-gray-100',
        padded && 'p-5 md:p-6',
        hover && 'transition-shadow duration-200 hover:shadow-soft-lg cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = 'Card';

export const CardHeader = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('mb-4 flex items-start justify-between gap-2', className)}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className,
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

export const CardBody = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('text-gray-600 text-sm leading-relaxed', className)}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-100 flex items-center gap-3', className)}>
    {children}
  </div>
);
