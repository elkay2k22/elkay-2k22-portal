import { Link } from 'react-router-dom';
import { Phone, Heart } from 'lucide-react';
import { Container } from './Container';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <Container>
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white ring-1 ring-primary-200 shadow-sm overflow-hidden">
                <img src="/logo.jpg" alt="Elkay 2K22 Batch" className="w-[88%] h-[88%] object-contain" />
              </span>
              <span className="font-heading font-bold text-lg text-gray-900">Elkay 2K22 Batch</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Batch memories, NGO activities & transparent fund management — all in one place.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                ['About',       '/about'],
                ['Gallery',     '/gallery'],
                ['Events',      '/events'],
                ['Help Request','/help-request'],
                ['Contact',     '/contact'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact snippet */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Contact</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary-500 flex-shrink-0" />
                <span>Available on contact page</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {YEAR} Elkay 2K22 Batch. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 mx-0.5 fill-red-400" /> by the batch
          </span>
        </div>
      </Container>
    </footer>
  );
}
