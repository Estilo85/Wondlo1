'use client';

import SafetyCardContent from '@/components/SafetyCardContent';

export default function SafetyCardStateSection() {
  return (
    <div className="w-[292px] max-w-[292px] rounded-[20px] border border-[#DDD6EA] bg-[#F7F5FD] p-4 shadow-[0_18px_45px_rgba(43,39,64,0.16)]">
      <SafetyCardContent
        card={{
          score: 0,
          status: '',
          provider: '',
          details: [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }],
        }}
        desktop
        empty
      />
    </div>
  );
}
