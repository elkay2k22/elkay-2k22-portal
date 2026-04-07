import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { Card } from '@/components/ui/Card';
import { SkeletonText, ErrorState } from '@/components/ui/Loader';
import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';
import { Target, Eye, BookOpen, UsersRound, HandCoins, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { data, loading, error, refetch } = useFetch(() => settingsService.get());
  const about = data?.aboutContent;

  return (
    <div className="section-padding bg-[#f5f7ff]">
      <Container>
        <SectionTitle
          tag="Who We Are"
          title="About Elkay 2K22 Batch"
          subtitle="Our story, our mission, and the people behind it."
        />

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="space-y-5 md:space-y-6">

            {/* ── Story spotlight ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Card className="overflow-hidden p-0">
                <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr]">

                  {/* Left — navy panel */}
                  <div className="relative p-8 md:p-10 overflow-hidden
                                  bg-gradient-to-br from-[#0f1d5e] via-[#1a2c6b] to-[#1e4d8c]">
                    {/* Grid texture */}
                    <div aria-hidden className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px),
                                          repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px)`
                      }} />
                    {/* Blobs */}
                    <div aria-hidden className="absolute -top-16 -right-10 w-52 h-52 rounded-full bg-white/[0.06] blur-2xl" />
                    <div aria-hidden className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-black/[0.08] blur-2xl" />

                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                                       bg-white/15 border border-white/20
                                       text-white text-[11px] font-bold tracking-[0.8px] uppercase mb-5">
                        <Sparkles size={11} /> Our Journey
                      </span>
                      <h2 className="text-2xl md:text-[28px] font-extrabold leading-tight mb-4 text-white tracking-[-0.3px]">
                        Built on friendship,<br />
                        <span className="text-[#4cd69a]">driven by service.</span>
                      </h2>
                      {loading ? (
                        <SkeletonText lines={4} />
                      ) : (
                        <p className="text-white text-[14.5px] leading-[1.8] whitespace-pre-line">
                          {about?.batchHistory ?? 'We are the proud Elkay 2K22 Batch — a close-knit group of friends united by shared memories, values, and a commitment to giving back to society. From the halls of L.K. Matriculation School, we carry forward the spirit of friendship, help, and care.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right — stats panel */}
                  <div className="bg-white p-7 flex flex-col justify-center">
                    <h3 className="text-[12px] font-bold text-[#6b7aa0] uppercase tracking-[1px] mb-4">
                      At a Glance
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Active Members', value: '100+', icon: <UsersRound size={15} className="text-[#1a2c6b]" />, bg: '#eef1fb', valColor: '#1a2c6b' },
                        { label: 'Families Helped', value: '50+',  icon: <HandCoins size={15} className="text-[#25a065]" />,  bg: '#e8f5ee', valColor: '#25a065' },
                        { label: 'Year Started',    value: '2022', icon: <BookOpen  size={15} className="text-[#e5a000]" />,  bg: '#fff8e8', valColor: '#e5a000', span: true },
                      ].map(({ label, value, icon, bg, valColor, span }) => (
                        <div key={label}
                          className={`rounded-2xl border border-[#e8ecf8] bg-[#f5f7ff] p-4 ${span ? 'col-span-2' : ''}`}>
                          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center mb-2.5"
                            style={{ background: bg }}>
                            {icon}
                          </div>
                          <p className="text-[22px] font-black leading-none" style={{ color: valColor }}>{value}</p>
                          <p className="text-[11px] text-[#6b7aa0] font-medium mt-1">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Card>
            </motion.div>

            {/* ── Vision & Mission ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  delay: 0.08,
                  icon: <Eye size={20} className="text-[#1a2c6b]" />,
                  iconBg: '#eef1fb',
                  topBar: 'linear-gradient(to right, #1a2c6b, #2a3f8f)',
                  circleBg: '#eef1fb',
                  title: 'Our Vision',
                  titleColor: '#1a2c6b',
                  subtitle: 'Where we\'re headed',
                  text: about?.ngoVision ?? 'A society where no deserving individual is left behind — where compassion, education, and health are accessible to all.',
                },
                {
                  delay: 0.16,
                  icon: <Target size={20} className="text-[#25a065]" />,
                  iconBg: '#e8f5ee',
                  topBar: 'linear-gradient(to right, #25a065, #1a7a4c)',
                  circleBg: '#e8f5ee',
                  title: 'Our Mission',
                  titleColor: '#25a065',
                  subtitle: 'How we act on it',
                  text: about?.ngoMission ?? 'To channel our collective resources and energy into meaningful charity work — helping families in crisis, supporting education, and building a healthier community.',
                },
              ].map((card) => (
                <motion.div key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay, duration: 0.4 }}
                >
                  <Card className="h-full relative overflow-hidden p-7">
                    {/* Top accent bar */}
                    <div aria-hidden className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ background: card.topBar }} />
                    {/* Corner circle */}
                    <div aria-hidden className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full"
                      style={{ background: card.circleBg }} />
                    {/* Tiny accent dot */}
                    <div aria-hidden className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full opacity-40"
                      style={{ background: card.titleColor }} />

                    <div className="relative z-10 mt-2">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-11 h-11 rounded-[13px] flex items-center justify-center flex-shrink-0"
                          style={{ background: card.iconBg }}>
                          {card.icon}
                        </div>
                        <div>
                          <h2 className="text-[18px] font-extrabold leading-none"
                            style={{ color: card.titleColor }}>{card.title}</h2>
                          <p className="text-[11.5px] text-[#6b7aa0] font-medium mt-0.5">{card.subtitle}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        {loading ? <SkeletonText lines={4} /> : (
                          <p className="text-[14.5px] text-[#4a5578] leading-[1.85]">{card.text}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* ── Group photos ── */}
            {!loading && about?.groupPhotos && about.groupPhotos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-extrabold text-[#1a2c6b]">Batch Moments</h2>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.8px]
                                   text-[#1a7a4c] bg-[#e8f5ee] rounded-full px-3 py-1">
                    Gallery Highlights
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {about.groupPhotos.map((url, i) => (
                    <div key={i}
                      className="group rounded-2xl overflow-hidden border border-[#e8ecf8] bg-white">
                      <img
                        src={url}
                        alt={`Group photo ${i + 1}`}
                        className="w-full aspect-[4/3] object-cover
                                   transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        )}
      </Container>
    </div>
  );
}