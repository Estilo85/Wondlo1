'use client';

import SafetyCardContent from '@/components/SafetyCardContent';

export default function PaidSidebarSafetyCardSection({
  companyName = 'Summit Trails Expeditions',
  score = 85,
  status = 'Good',
  incidentHistory = 'No incidents reported',
  onClick,
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
  onClick?: () => void;
  checklistItems?: { title: string; desc: string }[];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[342px] max-w-[342px] min-h-0 bg-[#F6F4FE] px-[25px] py-4 text-left transition-all duration-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7E6BB3] cursor-pointer"
      style={{ scrollbarColor: 'rgba(126, 107, 179, 0.90) transparent' }}
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

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(126, 107, 179, 1);
        }
      `}</style>
    </button>
  );
}