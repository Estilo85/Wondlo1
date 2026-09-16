'use client';

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function SidebarToggleButton({
  isOpen,
  onClick,
}: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={isOpen ? 'Close profile sidebar' : 'Open profile sidebar'}
      aria-expanded={isOpen}
      onClick={onClick}
      className="w-8 h-8 rounded-md bg-[#F6F4FE] border border-[#7E6BB3]/40 flex items-center justify-center text-[#7E6BB3] hover:bg-white hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
        <path d="M12 3.5v17" />
        <path d="M15.5 8h1.5M15.5 11h1.5M15.5 14h1.5" />
      </svg>
    </button>
  );
}