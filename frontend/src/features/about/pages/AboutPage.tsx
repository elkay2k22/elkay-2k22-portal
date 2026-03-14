import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { Card } from '@/components/ui/Card';
import { SkeletonText, ErrorState } from '@/components/ui/Loader';
import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';
import { Target, Eye, BookOpen } from 'lucide-react';

export default function AboutPage() {
  const { data, loading, error, refetch } = useFetch(() => settingsService.get());
  const about = data?.aboutContent;

  return (
    <div className="section-padding">
      <Container>
        <SectionTitle
          tag="Who We Are"
          title="About Elkay 2K22 Batch"
          subtitle="Our story, our mission, and the people behind it."
        />

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="space-y-10">
            {/* Batch History */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50">
                    <BookOpen size={20} className="text-primary-600" />
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">Batch History</h2>
                </div>
                {loading ? (
                  <SkeletonText lines={5} />
                ) : (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {about?.batchHistory ?? 'We are the proud Elkay batch of 2022 — a close-knit group of friends united by shared memories, values, and a commitment to giving back to society.'}
                  </p>
                )}
              </Card>
            </motion.div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Card className="h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                      <Eye size={20} className="text-blue-600" />
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  {loading ? (
                    <SkeletonText lines={4} />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {about?.ngoVision ?? 'A society where no deserving individual is left behind — where compassion, education, and health are accessible to all.'}
                    </p>
                  )}
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Card className="h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50">
                      <Target size={20} className="text-amber-600" />
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  {loading ? (
                    <SkeletonText lines={4} />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {about?.ngoMission ?? 'To channel our collective resources and energy into meaningful charity work — helping families in crisis, supporting education, and building a healthier community.'}
                    </p>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Group Photos */}
            {!loading && about?.groupPhotos && about.groupPhotos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Group Photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {about.groupPhotos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Group photo ${i + 1}`}
                      className="w-full h-40 object-cover rounded-xl shadow-card"
                    />
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
