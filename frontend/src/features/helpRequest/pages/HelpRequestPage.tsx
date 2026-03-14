import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { Card } from '@/components/ui/Card';
import { HelpRequestForm } from '../components/HelpRequestForm';
import { ShieldCheck, Clock, Users } from 'lucide-react';

const INFO_ITEMS = [
  {
    icon: <ShieldCheck size={20} className="text-primary-600" />,
    title: 'Confidential',
    description: 'Your details are reviewed only by our admin team.',
  },
  {
    icon: <Clock size={20} className="text-primary-600" />,
    title: 'Quick Review',
    description: 'We aim to review requests within 48 hours.',
  },
  {
    icon: <Users size={20} className="text-primary-600" />,
    title: 'Community Support',
    description: 'Funded entirely by our batch members.',
  },
];

export default function HelpRequestPage() {
  return (
    <div className="section-padding">
      <Container narrow>
        <SectionTitle
          tag="Need Help?"
          title="Submit a Help Request"
          subtitle="If you or someone you know needs support, fill out the form below. We'll reach out as soon as possible."
        />

        {/* Info chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {INFO_ITEMS.map(({ icon, title, description }) => (
            <div key={title} className="flex gap-3 items-start bg-primary-50 rounded-2xl p-4">
              <span className="mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <HelpRequestForm />
        </Card>
      </Container>
    </div>
  );
}
