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
      {/* Tag badge */}
      {tag && (
        <span className="inline-flex items-center gap-1.5
                         bg-[#e8f5ee] text-[#1a7a4c]
                         text-[11px] font-bold tracking-[1.2px] uppercase
                         px-3 py-1.5 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25a065] flex-shrink-0" />
          {tag}
        </span>
      )}

      {/* Title */}
      <h2 className="text-[28px] md:text-[34px] font-black text-[#1a2c6b]
                     tracking-[-0.8px] leading-[1.1] text-balance">
        {title}
      </h2>

      {/* Decorative bar */}
      <div className={clsx(
        'flex items-center gap-2 mt-3',
        align === 'center' ? 'justify-center' : 'justify-start',
      )}>
        <div className="h-[3px] w-9 rounded-full bg-[#1a2c6b]" />
        <div className="h-[3px] w-5 rounded-full bg-[#25a065]" />
        <div className="h-[3px] w-2 rounded-full bg-[#25a065]/30" />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={clsx(
          'mt-4 text-[14.5px] text-[#6b7aa0] font-medium leading-relaxed',
          align === 'center' ? 'max-w-xl mx-auto' : 'max-w-xl',
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}