'use client';

import SafetyCardContent from '@/components/SafetyCardContent';

export default function FreeSidebarSafetyCardSection({
  companyName = 'Summit Trails Expeditions',
  score = 85,
  status = 'Good',
  incidentHistory = 'No incidents reported',
  checklistItems = [
    { title: 'Incident History', desc: '5 Years - No Reported Incidents' },
    { title: 'Equipment Maintenance', desc: 'Inspection Every 3 Months' },
    { title: 'Operational Transparency', desc: 'Registered & Licenced' },
  ],
}: {
  companyName?: string;
  score?: number;
  status?: string;
  incidentHistory?: string;
  checklistItems?: { title: string; desc: string }[];
}) {
  return (
    <div className="w-[292px] max-w-[292px] rounded-[20px] border border-[#DDD6EA] bg-[#F7F5FD] p-4 shadow-[0_18px_45px_rgba(43,39,64,0.16)]">
      <SafetyCardContent
        card={{
          score,
          status,
          provider: companyName,
          details: checklistItems.map((item, index) => ({
            label: item.title,
            value: index === 0 ? incidentHistory : item.desc,
          })),
        }}
        desktop
      />
    </div>
  );
}
