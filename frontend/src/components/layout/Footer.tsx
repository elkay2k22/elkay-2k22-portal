import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Container } from './Container';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-[rgba(26,44,107,0.08)]">
      <Container>
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-8 h-8 rounded-[9px] p-[2px] flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#1a2c6b 0%,#25a065 100%)' }}
            >
              <div className="w-full h-full bg-white rounded-[7px] overflow-hidden
                              flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Elkay 2K22"
                  className="w-full h-full object-contain
                             group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <span className="text-[14px] font-extrabold text-[#1a2c6b] tracking-[-0.2px]">
              Elkay 2K22 Batch
            </span>
          </Link>

          {/* Copyright */}
          <span className="text-[12px] text-[#a0aabf] font-medium">
            © {YEAR} Elkay 2K22 Batch. All rights reserved.
          </span>

          {/* Made with */}
          <span className="flex items-center gap-1.5 text-[12px] text-[#a0aabf] font-medium flex-shrink-0">
            Made with
            <Heart size={11} className="fill-[#25a065] text-[#25a065]" />
            by the batch
          </span>

        </div>
      </Container>
    </footer>
  );
}