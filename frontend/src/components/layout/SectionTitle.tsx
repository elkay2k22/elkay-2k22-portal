import { clsx } from 'clsx';

interface SectionTitleProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  tag,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        'mb-10',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      {tag && (
        <span className="inline-block mb-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold tracking-wide uppercase">
          {tag}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-balance">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
