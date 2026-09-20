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
    <div
      className="w-[342px] max-w-[342px] min-h-0 bg-[#F6F4FE] px-[25px] py-4"
      style={{
        scrollbarColor: 'rgba(126, 107, 179, 0.90) transparent',
      }}
    >
      <div
        className="w-[292px] max-w-[292px] rounded-[20px] p-4"
        style={{
          background: '#F6F4FE',
          border: '0.15px solid rgba(43, 39, 64, 0.12)',
          boxShadow: '0 18px 45px rgba(43, 39, 64, 0.08)',
        }}
      >
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

      {/* Figma scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 4px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(126, 107, 179, 0.9);
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}