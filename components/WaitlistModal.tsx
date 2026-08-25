'use client';

import { useRouter } from 'next/navigation';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleJoinWaitlist = () => {
    onClose();
    router.push('/signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#EDE7FB] space-y-6 text-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Know before you go</p>
          <p className="text-xs sm:text-sm text-gray-600">
            Know if an adventure is safe by company name, website, or social media handle.
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="bg-[#EBFADF] text-[#3D8A1E] text-xs font-semibold px-3 py-1 rounded-full border border-[#D4F5BE]">
            3 free safety checks
          </span>
          <span className="bg-[#F4EFFE] text-[#7E6BB3] text-xs font-semibold px-3 py-1 rounded-full border border-[#E4D7FA]">
            Risk checklist
          </span>
          <span className="bg-[#FFF5F2] text-[#D96B52] text-xs font-semibold px-3 py-1 rounded-full border border-[#FDE3DC]">
            Questions to ask before paying
          </span>
        </div>

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleJoinWaitlist}
            className="w-full bg-[#7E6BB3] hover:bg-[#6B58A1] text-white font-poppins font-semibold text-sm py-3 rounded-xl transition-colors shadow-md cursor-pointer"
          >
            Join the free waitlist
          </button>

          <p className="text-[11px] text-gray-400">
            Free early access • Launching September 2026
          </p>
        </div>

      </div>
    </div>
  );
}