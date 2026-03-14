import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users, Star } from 'lucide-react';
import { clsx } from 'clsx';

const btnBase = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold h-[46px] px-6 text-[13.5px] transition-all duration-200 select-none';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1d5e] via-[#1a2c6b] to-[#1e4d8c]">

      {/* ── Subtle grid + rings ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-white/[0.06]" />
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-white/[0.05]" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full border border-white/[0.04]" />
        <div className="absolute top-[28%] left-[4%] w-1.5 h-1.5 rounded-full bg-[#25a065]/40" />
        <div className="absolute top-[62%] left-[10%] w-1 h-1 rounded-full bg-white/15" />
        <div className="absolute top-[18%] left-[38%] w-20 h-px bg-[#25a065]/12 -rotate-[25deg]" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center min-h-[520px]">

        {/* ── LEFT ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col justify-center
                     w-full lg:w-[46%]
                     px-6 sm:px-10 lg:px-12 xl:px-16
                     py-14 md:py-18 lg:py-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-2 py-1.5 pr-4 rounded-full
                          bg-white/10 border border-white/20 backdrop-blur-sm mb-5 self-start">
            <span className="w-7 h-7 rounded-full bg-[#25a065] flex items-center justify-center flex-shrink-0">
              <Heart size={12} className="fill-white text-white" />
            </span>
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-[1px]">
              Elkay Batch 2K22
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[44px] sm:text-5xl font-black leading-[1.05] tracking-[-1.5px] text-white mb-2">
            Together We<br />
            Give. <span className="text-[#4cd69a]">Together</span><br />
            We Care.
          </h1>

          {/* Ornament divider before quote */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-[#25a065]/50 to-transparent" />
            <Star size={13} className="fill-[#25a065]/60 text-[#25a065]/60 flex-shrink-0" />
            <div className="h-px flex-1 bg-gradient-to-l from-[#25a065]/50 to-transparent" />
          </div>

          {/* Quote card */}
          <div className="relative rounded-[18px] border border-white/12 bg-white/[0.06] p-5 mb-6">
            <span className="absolute top-2 left-4 font-serif italic text-[64px] leading-[0.6]
                             text-[#25a065]/35 select-none pointer-events-none">"</span>
            <p className="font-serif italic text-[14px] leading-[1.8] text-white pl-3">
              The example of those who spend their wealth in the cause of Allah is that
              of a grain that sprouts into seven ears, each bearing one hundred grains.
              And Allah multiplies the reward even more to whoever He wills.
            </p>
            <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center gap-2">
              <div className="w-[18px] h-0.5 bg-[#25a065] rounded-full" />
              <span className="text-[10.5px] font-bold text-[#4cd69a] uppercase tracking-[1.4px]">
                Qur'an 2:261
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            <Link
              to="/events"
              className={clsx(btnBase, 'bg-white text-[#1a2c6b] hover:bg-[#f0f4ff] shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:-translate-y-px')}
            >
              <ArrowRight size={15} /> View Events
            </Link>
            <Link
              to="/help-request"
              className={clsx(btnBase, 'bg-white/[0.07] text-white border border-white/25 hover:bg-white/13')}
            >
              <Heart size={14} /> Request Help
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center">
            {[
              { num: '200+', label: 'Members',         icon: <Users size={15} className="text-white/60" /> },
              { num: '50+',  label: 'Families Helped', icon: <Heart size={15} className="fill-[#4cd69a] text-[#4cd69a]" /> },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center">
                {i > 0 && <div className="w-px h-8 bg-white/12 mx-[18px]" />}
                <div className="flex items-center gap-2.5">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-white/[0.08]
                                  flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-[20px] font-black text-white leading-none">{s.num}</div>
                    <div className="text-[10.5px] text-white/45 font-medium mt-0.5">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT — image with decorative frame ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative hidden lg:flex w-[54%] flex-shrink-0 items-center
                     py-8 pr-8 xl:pr-12"
        >
          {/* Green glow behind image */}
          <div aria-hidden className="absolute inset-4 rounded-[32px] bg-[#25a065]/08 blur-2xl" />

          <div className="relative w-full">
            {/* Corner accent — top left */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#25a065]
                            shadow-[0_0_0_3px_rgba(37,160,101,0.2)] z-10" />
            {/* Corner accent — bottom right */}
            <div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 rounded-full
                            bg-[#1a2c6b] border-2 border-white/30 z-10" />

            {/* Image frame */}
            <div className="relative overflow-hidden rounded-3xl
                            border border-white/[0.18]
                            shadow-[0_24px_64px_rgba(7,13,36,0.5)]">
              <img
                src="/Hero.jpeg"
                alt="Elkay 2K22 batch photo"
                className="block w-full h-auto"
              />
              {/* Floating label over image */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2
                              bg-[#0b1333]/75 backdrop-blur-md
                              border border-white/15 rounded-xl px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#4cd69a]
                                shadow-[0_0_0_2px_rgba(76,214,154,0.3)]" />
                <span className="text-[11.5px] font-semibold text-white/90">
                  Elkay 2K22 Batch — L.K. School
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}