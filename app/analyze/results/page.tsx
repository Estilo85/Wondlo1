'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import FreeSidebar from '@/components/FreeSidebar';
import SidebarToggleButton from '@/components/SidebarToggleButton';
import type { AnalysisReport, DimensionScores } from '@/lib/mock-analysis';

const sectionStyle = {
  background: '#F6F4FE',
  border: '0.15px solid rgba(43, 39, 64, 0.12)',
  boxShadow: '0 4px 12px rgba(43, 39, 64, 0.01)',
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('TRAVELLER');
  const [searchesLeft, setSearchesLeft] = useState(3);
  const [searchLimitMessage, setSearchLimitMessage] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisReport[]>([]);
  const consumedRef = useRef(false);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

  const downloadSafetyQuestions = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const BG = '#F9F8FF';
    const PURPLE = '#7E6BB3';
    const DARK = '#2B2740';
    const BLACK = '#000000';
    const LIGHT_PURPLE = '#DCD4F0';

    const hexToRgb = (hex: string) => {
      const value = hex.replace('#', '');
      return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
      };
    };
    const setTextColor = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      doc.setTextColor(r, g, b);
    };
    const setDrawColor = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      doc.setDrawColor(r, g, b);
    };
    const setFillColor = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      doc.setFillColor(r, g, b);
    };
    const paintPageBackground = () => {
      setFillColor(BG);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    };
    paintPageBackground();
    let y = 20;
    const addPage = () => {
      doc.addPage();
      paintPageBackground();
      y = 20;
    };
    const ensureSpace = (heightNeeded: number) => {
      if (y + heightNeeded > pageHeight - 18) addPage();
    };
    const addTitle = (text: string) => {
      ensureSpace(20);
      setTextColor(PURPLE);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 8 + 5;
    };
    const addSubtitle = (text: string) => {
      ensureSpace(12);
      setTextColor(DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5.5 + 4;
    };
    const addParagraph = (text: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setTextColor(BLACK);
      const lines = doc.splitTextToSize(text, contentWidth);
      const height = lines.length * 4.8 + 4;
      ensureSpace(height);
      doc.text(lines, margin, y);
      y += height;
    };
    const addSection = (title: string, why: string, questions: string[]) => {
      ensureSpace(25);
      setTextColor(DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(title, margin, y);
      y += 7;
      setDrawColor(LIGHT_PURPLE);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      setTextColor(DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Why ask these questions?', margin, y);
      y += 5;
      addParagraph(why);
      questions.forEach((question) => {
        const questionLines = doc.splitTextToSize(question, contentWidth - 6);
        const height = questionLines.length * 4.8 + 2;
        ensureSpace(height);
        setTextColor(BLACK);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(questionLines, margin + 6, y);
        y += height;
      });
      y += 4;
    };

    addTitle('Safety Questions to Ask an Adventure Operator');
    addParagraph(`Adventure Operator: ${query}`);
    addParagraph(`Generated: ${generatedDate}`);
    addSubtitle('Before You Book or Participate');
    addParagraph('Every adventure activity carries some level of risk. A responsible operator should be able to explain how they prepare for risks, protect participants, and respond when something unexpected happens.');
    addParagraph('You do not need to ask every question. Choose the questions most relevant to your trip and look for clear, specific answers rather than vague assurances.');
    addSection('1. Emergency Response', 'Emergencies can happen even when an activity is carefully planned. These questions help you understand whether the operator has a clear plan for dealing with injuries, illness, evacuation, and other serious situations.', [
      '1. What happens if someone gets injured or becomes sick during the activity?',
      '2. What is your emergency evacuation procedure if someone needs urgent medical help?',
      '3. How long would it normally take for emergency assistance to reach the group?',
      '4. How would you contact emergency services if there is little or no mobile signal?',
      '5. What happens if the guide is injured or unable to continue during the activity?',
    ]);
    addSection('2. Guides & Supervision', "Guides are responsible for making important safety decisions and helping participants respond to problems. Their training, experience, and ability to supervise the group are therefore important parts of the operator's safety system.", [
      '6. What safety training and qualifications do your guides have?',
      '7. Are your guides trained in first aid, CPR, and emergency response?',
      '8. How many participants does each guide supervise?',
      '9. How do you make sure your guides follow your safety procedures?',
      '10. Who can make the decision to stop an activity if it becomes unsafe?',
    ]);
    addSection('3. Safety Briefing & Preparation', 'Travellers should know what they are getting into before an activity begins. A good safety briefing should explain important risks, procedures, expectations, and what participants should do if something goes wrong.', [
      '11. Is there a safety briefing before the activity, and what does it cover?',
      '12. What safety requirements do I need to meet before participating?',
      '13. How do you make sure participants understand the important safety instructions before starting?',
    ]);
    addSection('4. Equipment & Safety Checks', 'Safety equipment needs to be properly maintained and checked. These questions help you understand whether the operator has a consistent process for keeping equipment safe and dealing with equipment problems.', [
      '14. How is your safety equipment inspected and maintained?',
      '15. How do you check that equipment is safe before each activity?',
      '16. What safety equipment do you provide, and what am I expected to bring?',
      '17. What happens if important safety equipment fails during the activity?',
    ]);
    addSection('5. Risk Management & Changing Conditions', 'Conditions can change during an adventure. A responsible operator should continuously assess risks and be willing to change, delay, or stop an activity when continuing could put participants in danger.', [
      '18. How do you assess safety risks before each activity?',
      '19. What conditions would make you cancel, postpone, change, or stop an activity?',
      '20. What do you do if conditions become unsafe after the activity has already started?',
      '21. How do you monitor changing conditions during the activity?',
    ]);
    addSection('6. Participant Safety & Accountability', 'Operators need to know where their participants are and what to do if someone becomes separated, lost, injured, or unable to continue. These questions help you understand how participants are monitored throughout the experience.', [
      '22. How do you keep track of participants throughout the activity?',
      '23. What happens if someone becomes separated from the group or gets lost?',
      '24. What happens if a participant cannot safely continue the activity?',
    ]);
    addSection('7. Learning From Incidents', 'A strong safety culture includes learning from things that have gone wrong - not just serious accidents, but also near misses and other safety concerns. How an operator responds to previous incidents can tell you a lot about how seriously it takes safety.', [
      '25. Have you had any serious accidents, near misses, or other safety incidents, and what did you change as a result?',
    ]);
    ensureSpace(35);
    setTextColor(DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Traveller Safety Reminder', margin, y);
    y += 7;
    setDrawColor(LIGHT_PURPLE);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    addParagraph('When asking these questions, pay attention not only to what the operator says, but also to how clearly and confidently they can explain their safety procedures.');
    addParagraph('A reassuring answer should ideally be specific, understandable, and consistent. Be cautious of answers that are vague, dismissive, contradictory, or suggest that safety decisions are made only after something goes wrong.');
    addParagraph('Remember: Asking these questions does not guarantee that an activity is safe. They are intended to help you make a more informed decision and identify areas where you may need further information before participating.');
    doc.save('Wondlo-Recommended Questions.pdf');
  };

  const query = searchParams.get('q') || 'Summit Trails Expeditions';

  const today = new Date();

  const generatedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const coveredUpTo = new Date(today);
  coveredUpTo.setDate(today.getDate() - 1);

  const coveredUpToDate = coveredUpTo.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dimensionList: {
    key: keyof DimensionScores;
    label: string;
    icon: string;
  }[] = [
    { key: 'qualityOfExperience', label: 'Quality of Experience', icon: 'experience' },
    { key: 'qualityOfRegulation', label: 'Quality of Regulation', icon: 'regulation' },
    { key: 'incidentHistory', label: 'Incident History', icon: 'incident' },
    { key: 'businessInformation', label: 'Business Information', icon: 'business' },
    { key: 'riskAssessment', label: 'Risk Assessment', icon: 'risk' },
    { key: 'equipmentAssessment', label: 'Equipment Assessment', icon: 'equipment' },
    { key: 'safetySentiment', label: 'Safety Sentiment', icon: 'sentiment' },
  ];

  const riskItems = analysis
    ? dimensionList.map(({ key, label, icon }) => {
        const score = Number(analysis.dimensions[key]) || 0;
        const color = score >= 75 ? '#7E6BB3' : '#FBC02D';
        return { label, score: String(score), width: `${score}%`, color, icon };
      })
    : [
        {
          label: 'Quality of Experience',
          score: '90',
          width: '90%',
          color: '#7E6BB3',
          icon: 'experience',
        },
        {
          label: 'Quality of Regulation',
          score: '78',
          width: '78%',
          color: '#7E6BB3',
          icon: 'regulation',
        },
        {
          label: 'Incident History',
          score: '85',
          width: '85%',
          color: '#7E6BB3',
          icon: 'incident',
        },
        {
          label: 'Business Information',
          score: '80',
          width: '80%',
          color: '#7E6BB3',
          icon: 'business',
        },
        {
          label: 'Risk Assessment',
          score: '70',
          width: '70%',
          color: '#FBC02D',
          icon: 'risk',
        },
        {
          label: 'Equipment Assessment',
          score: '65',
          width: '65%',
          color: '#FBC02D',
          icon: 'equipment',
        },
        {
          label: 'Safety Sentiment',
          score: '77',
          width: '77%',
          color: '#7E6BB3',
          icon: 'sentiment',
        },
      ];

  const incidents = analysis?.incidents ?? [
    { date: 'Apr 12, 2025', severity: 'Minor', title: 'Mild altitude sickness reported', description: 'Trekking group experienced mild altitude sickness. Managed on site, no evacuation required.', source: 'Instagram' },
    { date: 'Oct 3, 2023', severity: 'None', title: 'No incidents reported', description: 'No safety incidents found during this period.', source: 'Company Website' },
    { date: 'May 21, 2021', severity: 'Moderate', title: 'Rescue delayed due to weather', description: 'Bad weather delayed rescue response by approximately 2 hours. No injuries were reported.', source: 'News Article' },
  ];

  const severityTextColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'none':
        return 'text-[#000000]/60';
      case 'moderate':
        return 'text-[#FBC02D]';
      case 'major':
        return 'text-[#C51D14]';
      default:
        return 'text-[#7E6BB3]';
    }
  };

  const incidentIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'none':
        return (
          <div className="w-[30px] h-[30px] rounded-full bg-[#9AA0A6] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case 'moderate':
        return (
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="flex-shrink-0">
            <path d="M15 4L27 25H3L15 4Z" stroke="#FBC02D" strokeWidth="1.3" />
            <path d="M15 11v7" stroke="#FBC02D" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="15" cy="21" r="1" fill="#FBC02D" />
          </svg>
        );
      case 'major':
        return (
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="flex-shrink-0">
            <path d="M15 4L27 25H3L15 4Z" stroke="#C51D14" strokeWidth="1.3" />
            <path d="M15 11v7" stroke="#C51D14" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="15" cy="21" r="1" fill="#C51D14" />
          </svg>
        );
      default:
        return (
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="flex-shrink-0">
            <path d="M15 2.5L24 6V13.5C24 19.8 20 24.5 15 27C10 24.5 6 19.8 6 13.5V6L15 2.5Z" stroke="#7E6BB3" strokeWidth="1.5" />
            <path d="M11 14.5L14 17.5L19.5 11" stroke="#7E6BB3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  useEffect(() => {
    if (!auth) {
      router.replace('/signin');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/signin');
      } else {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authReady || !auth?.currentUser || consumedRef.current) return;

    consumedRef.current = true;
    (async () => {
      try {
        const token = await auth.currentUser!.getIdToken();
        const res = await fetch(`/api/search?token=${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || 'TRAVELLER');
          setSearchesLeft(data.freeSearchesLeft ?? 3);
          if (data.freeSearchesLeft === 0) {
            setSearchLimitMessage(
              'You have reached your 3 free searches. Upgrade to analyse another adventure.'
            );
          }
          const reports = (data.searches ?? []).map(
            (search: { analysis: AnalysisReport }) => search.analysis
          );
          setSavedAnalyses(reports);
          const current = reports.find(
            (report: AnalysisReport) =>
              report.operatorName.trim().toLowerCase() === query.trim().toLowerCase()
          );
          setAnalysis(current ?? null);
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    })();
  }, [authReady, query]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F6F4FE] flex items-center justify-center text-sm text-[#7E6BB3]">
        Loading safety analysis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4FE] text-[#2B2740] font-poppins antialiased overflow-x-hidden">
      {/* ================================================================
          NAVIGATION
      ================================================================= */}

      <header className="sticky top-0 z-40 bg-white border-b border-[#EDE7FB]">
        <div className="w-full max-w-[1316px] mx-auto px-4 sm:px-6 xl:px-0">
          <div className="min-h-16 py-3 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="font-bold text-lg text-[#2B2740] tracking-tight flex-shrink-0"
            >
              Wondlo
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide text-[#2B2740]">
                <Link
                  href="/"
                  className="hover:text-[#7E6BB3] transition-colors"
                >
                  HOME
                </Link>

                <Link
                  href="/community"
                  className="hover:text-[#7E6BB3] transition-colors"
                >
                  COMMUNITY
                </Link>
              </nav>

              <button
                onClick={() => {
                  if (searchesLeft === 0) {
                    setSearchLimitMessage(
                      'You have reached your 3 free searches. Upgrade to analyse another adventure.'
                    );
                    return;
                  }

                  router.push('/dashboard?newSearch=1');
                }}
                className="h-8 px-3 sm:px-4 rounded-lg bg-[#7E6BB3] text-white border border-[#7E6BB3] flex items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <span className="hidden sm:inline">Analyse Another Adventure</span>
                <span className="sm:hidden">Analyse Another</span>
                <span className="text-sm">→</span>
              </button>

              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((open) => !open)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C7B5F5] bg-[#F6F4FE] text-[#7E6BB3]"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
                    />
                  </svg>

                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#3D8A1E] ring-2 ring-white" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-11 z-50 w-32 rounded-lg border border-[#EDE7FB] bg-white p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full rounded-md px-3 py-2 text-center text-xs font-semibold text-[#2B2740] hover:bg-[#F6F4FE]"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#F6F4FE] border-t border-[#EDE7FB]">
          <div className="w-full max-w-[1316px] mx-auto px-4 sm:px-6 xl:px-0 min-h-10 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <button
              onClick={() => router.back()}
              className="text-xs font-semibold text-[#7E6BB3] hover:underline flex items-center gap-2 cursor-pointer"
            >
              <span className="text-[#3D8A1E] text-base font-extrabold leading-none">
                ←
              </span>

              Back to Search
            </button>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#2B2740]">
              <span>Assessment Version: v1.1</span>
              <span className="hidden sm:inline text-[#9AA0A6]">|</span>
              <span>Generated: {generatedDate}</span>
            </div>
          </div>
        </div>
      </header>

      {searchLimitMessage && (
        <div
          role="alert"
          className="mx-auto w-full max-w-[1316px] px-4 pt-3 text-center text-sm font-medium text-[#C51D14] sm:px-6 xl:px-0"
        >
          {searchLimitMessage}
        </div>
      )}

      <main className="w-full">
        {/* ================================================================
            PROFILE
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div
            className="relative w-full max-w-[1316px] min-h-[250px] mx-auto rounded-xl p-4 sm:p-6 xl:p-7"
            style={sectionStyle}
          >
            <div className="absolute top-4 right-4">
              <SidebarToggleButton isOpen={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)} />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pr-0 sm:pr-4">
              <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8 min-w-0">
                <div
                  className="w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{
                    background: '#F6F4FE',
                    border: '0.15px solid rgba(43, 39, 64, 0.10)',
                  }}
                >
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    className="w-[75px] h-[75px] sm:w-[100px] sm:h-[100px]"
                  >
                    <path d="M50 8L91 82H9L50 8Z" fill="#454545" />
                    <path
                      d="M30 52L43 35L54 51L63 40L82 70H18L30 52Z"
                      fill="#F6F4FE"
                    />
                    <path
                      d="M50 8L91 82H9L50 8Z"
                      stroke="#454545"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="pt-1 min-w-0 w-full">
                  <div className="flex items-start gap-2 min-w-0 pr-8">
                    <h1 className="font-poppins text-[21px] sm:text-[24px] leading-[27px] sm:leading-[30px] font-bold text-[#000000] break-words">
                      {query}
                    </h1>

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      className="flex-shrink-0 mt-1"
                    >
                      <path
                        fill="#1877F2"
                        d="M12 1.5 15.06 4.61 19.43 4.58 19.39 8.94 22.5 12 19.39 15.06 19.43 19.39 15.06 19.39 12 22.5 8.94 19.39 4.58 19.43 4.61 15.06 1.5 12 4.61 8.94 4.58 4.58 8.94 4.61 12 1.5Z"
                      />

                      <path
                        d="M7.8 12.4l2.8 2.8 5.6-5.9"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="mt-5 sm:mt-6 flex flex-col gap-4 sm:gap-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="1.8"
                        className="flex-shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"
                        />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>

                      <span className="text-[16px] sm:text-[18px] leading-[20px] sm:leading-[22px] font-poppins font-semibold text-[#000000]">
                        Nepal
                      </span>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0"
                      >
                        <path d="M5 20 19 4" />
                        <circle
                          cx="11.5"
                          cy="4.2"
                          r="2"
                          fill="currentColor"
                          stroke="none"
                        />
                        <rect
                          x="5.2"
                          y="6.8"
                          width="2.8"
                          height="4"
                          rx="0.9"
                        />
                        <path d="M11.6 6.9 10 15.5" />
                        <path d="M11 9.7 15.2 8.4" />
                        <circle
                          cx="15.2"
                          cy="8.2"
                          r="0.9"
                          fill="currentColor"
                          stroke="none"
                        />
                        <path d="M10 15.5 7.2 20.4M7.2 20.4 6 20" />
                        <path d="M12.6 15.7 15.4 18.8 14.2 20" />
                      </svg>

                      <span className="text-[16px] sm:text-[18px] leading-[20px] sm:leading-[22px] font-poppins font-semibold text-[#000000]">
                        Adventure Trekking, Climbing
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                    <div
                      className="min-h-[40px] px-4 py-2 rounded-lg flex items-center gap-3"
                      style={{
                        background: '#F6F4FE',
                        border: '0.15px solid rgba(43, 39, 64, 0.10)',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="1.8"
                        className="flex-shrink-0"
                      >
                        <rect
                          x="3"
                          y="4.5"
                          width="18"
                          height="16"
                          rx="2.25"
                        />
                        <path strokeLinecap="round" d="M3 9h18" />
                        <path
                          strokeLinecap="round"
                          d="M6.75 3v2.25M17.25 3v2.25"
                        />
                        <text
                          x="12"
                          y="19"
                          textAnchor="middle"
                          fill="currentColor"
                          stroke="none"
                          fontSize="7"
                          fontWeight="bold"
                        >
                          {today.getDate()}
                        </text>
                      </svg>

                      <span className="flex flex-col leading-tight font-inter">
                        <span className="text-[14px] sm:text-[16px] font-extralight text-[#000000]">
                          Report Generated
                        </span>

                        <strong className="text-[14px] sm:text-[16px] font-medium text-[#000000]">
                          {generatedDate}
                        </strong>
                      </span>
                    </div>

                    <div
                      className="min-h-[40px] px-4 py-2 rounded-lg flex items-center gap-3"
                      style={{
                        background: '#F6F4FE',
                        border: '0.15px solid rgba(43, 39, 64, 0.10)',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0"
                      >
                        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>

                      <span className="flex flex-col leading-tight font-inter">
                        <span className="text-[14px] sm:text-[16px] font-extralight text-[#000000]">
                          Data Collected Up To
                        </span>

                        <strong className="text-[14px] sm:text-[16px] font-medium text-[#000000]">
                          {coveredUpToDate}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-stretch gap-4 lg:pt-9 w-full lg:w-auto">
                <div className="relative w-1/2 min-w-0 sm:w-[280px] lg:w-[240px] xl:w-[280px] h-[150px] sm:h-[120px] rounded-xl overflow-hidden">
                  <Image
                    src="/images/hiking.jpg"
                    alt="Expedition Base"
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                </div>

                <div className="relative w-1/2 min-w-0 sm:w-[280px] lg:w-[240px] xl:w-[280px] h-[150px] sm:h-[120px] rounded-xl overflow-hidden">
                  <Image
                    src="/images/snowboarding.jpg"
                    alt="Summit Ridge"
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SCORE CARDS
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div className="w-full max-w-[1316px] mx-auto grid grid-cols-1 lg:grid-cols-[640px_640px] gap-5 sm:gap-6 lg:gap-9">
            <div
              className="w-full min-h-[229px] lg:h-[229px] rounded-xl p-5 sm:p-6"
              style={sectionStyle}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-poppins text-[20px] leading-[25px] font-bold text-[#2B2740]">
                  Overall Safety Score
                </h2>

                <span className="w-3.5 h-3.5 rounded-full bg-[#BDBDBD] text-white flex items-center justify-center text-[9px] font-bold leading-none">
                  i
                </span>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-poppins text-[55px] sm:text-[75px] leading-[60px] sm:leading-[78px] font-bold text-[#2B2740] tracking-tight">
                  {analysis?.overallSafetyScore ?? 85} / 100
                </div>

                <span className="h-[40px] min-w-[123px] px-4 rounded-lg bg-[#EDE7FB] text-[#7E6BB3] font-inter text-[20px] leading-[40px] text-center self-start sm:self-auto">
                  {analysis?.riskLevel ?? 'Low Risk'}
                </span>
              </div>

              <div className="mt-4 w-full h-[18px] rounded-full bg-[#D9D9D9] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7E6BB3]"
                  style={{ width: analysis ? `${analysis.overallSafetyScore}%` : '85%' }}
                />
              </div>
            </div>

            <div
              className="w-full min-h-[229px] lg:h-[229px] rounded-xl p-5 sm:p-6"
              style={sectionStyle}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-poppins text-[20px] leading-[25px] font-bold text-[#2B2740]">
                  Confidence
                </h2>

                <span className="w-3.5 h-3.5 rounded-full bg-[#BDBDBD] text-white flex items-center justify-center text-[9px] font-bold leading-none">
                  i
                </span>
              </div>

              <div className="mt-4 flex items-center gap-5 sm:gap-6">
                <div className="w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] rounded-full bg-[#EDE7FB] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                  >
                    <path
                      d="M30 5L47 11V26C47 38 40 47 30 53C20 47 13 38 13 26V11L30 5Z"
                      stroke="#7E6BB3"
                      strokeWidth="2"
                    />
                    <path
                      d="M22 29L28 35L39 22"
                      stroke="#7E6BB3"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="font-poppins text-[55px] sm:text-[75px] leading-[60px] sm:leading-[78px] font-bold text-[#2B2740] tracking-tight">
                  {analysis?.confidenceScore ?? 90}%
                </div>
              </div>

              <p className="mt-3 max-w-[500px] font-poppins text-[18px] sm:text-[22px] leading-[24px] sm:leading-[27px] font-normal text-[#2B2740]">
                This operator satisfies our trained model&apos;s 7 required
                dimensions for safety.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            SAFETY SUMMARY
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div
            className="w-full max-w-[1316px] min-h-[258px] mx-auto rounded-xl p-5 sm:p-6"
            style={sectionStyle}
          >
            <div className="flex items-center gap-3">
              <h2 className="font-poppins text-[20px] leading-[25px] font-bold text-[#2B2740]">
                Safety Summary
              </h2>

              <span className="text-[#2B2740] text-lg">✦</span>
            </div>

            <p className="mt-4 px-0 sm:px-2 font-inter text-[18px] sm:text-[22px] leading-[24px] sm:leading-[27px] font-normal text-[#2B2740] max-w-[1120px]">
              {analysis?.summary ??
                `${query} demonstrates strong safety practices overall. Guides are
                well-qualified and emergency protocols are in place. We found no
                major incidents in the past 3 years. Some traveller feedback
                mention equipment maintenance inconsistencies on certain trips.`}
            </p>

            <div className="mt-5 px-0 sm:px-2">
              <div className="flex flex-col items-start gap-3 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-3">
                {[
                  'Quality of Experience',
                  'Incident History',
                  'Safety Sentiment',
                  'Quality of Regulation',
                  'Business Information',
                ].map((label) => (
                  <span
                    key={label}
                    className="h-[32px] shrink-0 px-4 rounded-lg bg-[#EDE7FB] border border-[#C7B5F5]/50 flex items-center gap-2 font-inter text-[15px] sm:text-[16px] leading-[20px] font-light text-[#7E6BB3] whitespace-nowrap"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3D8A1E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12.5l4 4L19 7" />
                    </svg>

                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 px-0 sm:px-2">
              <div className="flex flex-col items-start gap-3 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-3">
                {['Equipment Assessment', 'Risk Assessment'].map((label) => (
                  <span
                    key={label}
                    className="h-[32px] shrink-0 px-4 rounded-lg bg-[#FFF1E8] border border-[#F2CFC5] flex items-center gap-2 font-inter text-[15px] sm:text-[16px] leading-[20px] font-light text-[#C51D14]/75 whitespace-nowrap"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C51D14"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>

                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            RISK BREAKDOWN
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div
            className="w-full max-w-[1316px] min-h-[360px] mx-auto rounded-xl p-5 sm:p-6"
            style={sectionStyle}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h2 className="font-poppins text-[20px] leading-[25px] font-bold text-[#2B2740]">
                  Risk Breakdown
                </h2>

                <span className="w-3.5 h-3.5 rounded-full bg-[#BDBDBD] text-white flex items-center justify-center text-[9px] font-bold leading-none">
                  i
                </span>
              </div>

              <span className="font-inter text-[14px] sm:text-[15px] font-medium text-[#7E6BB3] flex items-center gap-2">
                View full breakdown
                <span className="text-[#3D8A1E] text-base font-extrabold">
                  →
                </span>
              </span>
            </div>

            <div className="mt-5 px-0 sm:px-3">
              <div className="space-y-4 sm:space-y-3">
                {riskItems.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-1 lg:grid-cols-[220px_600px_1fr] items-center gap-2 lg:gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-[30px] h-[30px] rounded-lg bg-[#EDE7FB] flex items-center justify-center flex-shrink-0">
                        {item.icon === 'equipment' ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7E6BB3"
                            strokeWidth="1.7"
                          >
                            <path d="M14 4l6 6" />
                            <path d="M13 5l-8 8" />
                            <path d="M4 14l6 6" />
                            <path d="M15 9l-6 6" />
                            <path d="M18 3l3 3" />
                          </svg>
                        ) : item.icon === 'risk' ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7E6BB3"
                            strokeWidth="1.7"
                          >
                            <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                            <path d="M9 12l2 2 4-4" />
                          </svg>
                        ) : item.icon === 'sentiment' ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7E6BB3"
                            strokeWidth="1.7"
                          >
                            <circle cx="12" cy="12" r="8.5" />
                            <path d="M8.5 14.5c1.2 1.3 2.4 1.8 3.5 1.8s2.3-.5 3.5-1.8" />
                            <path d="M9 10h.01M15 10h.01" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7E6BB3"
                            strokeWidth="1.7"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="16"
                              height="16"
                              rx="2"
                            />
                            <path d="M8 8h8M8 12h8M8 16h5" />
                          </svg>
                        )}
                      </span>

                      <span className="font-inter text-[14px] sm:text-[15px] leading-[18px] font-medium text-[#000000]">
                        {item.label}
                      </span>
                    </div>

                    <div className="w-full lg:w-[600px] h-[15px] rounded-full bg-[#D9D9D9]/75 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: item.width,
                          background: item.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-1 font-inter text-[15px] font-medium text-[#000000]">
                      <span>{item.score}</span>
                      <span className="text-[#000000]/50">/100</span>

                      <span className="ml-1 w-3.5 h-3.5 rounded-full bg-[#000000]/20 text-white flex items-center justify-center text-[8px] font-bold">
                        i
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 ml-0 sm:ml-3 flex items-center gap-2 font-inter text-[11px] text-[#000000]/60">
              <span className="w-3.5 h-3.5 rounded-full bg-[#000000]/20 text-white flex items-center justify-center text-[8px] font-bold">
                i
              </span>
              Hover over a category to see what it includes
            </p>
          </div>
        </section>

        {/* ================================================================
            INCIDENT TIMELINE
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div
            className="w-full max-w-[1316px] min-h-[328px] mx-auto rounded-xl p-5 sm:p-6"
            style={sectionStyle}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h2 className="font-poppins text-[20px] leading-[25px] font-bold text-[#2B2740]">
                  Incident Timeline
                </h2>

                <span className="w-3.5 h-3.5 rounded-full bg-[#BDBDBD] text-white flex items-center justify-center text-[9px] font-bold leading-none">
                  i
                </span>
              </div>

              <span className="font-inter text-[14px] sm:text-[15px] font-medium text-[#7E6BB3] flex items-center gap-2">
                View full breakdown
                <span className="text-[#3D8A1E] text-base font-extrabold">
                  →
                </span>
              </span>
            </div>

            {/* Mobile: each date stays with its corresponding incident.
                Desktop: existing three-column layout remains unchanged. */}
            <div className="mt-4">
              {/* Mobile */}
              <div className="md:hidden space-y-6">
                {incidents.map((inc, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex items-start gap-3 w-[125px] flex-shrink-0">
                      {incidentIcon(inc.severity)}
                      <div>
                        <div className="font-inter text-[16px] font-medium text-[#000000]/60">
                          {inc.date}
                        </div>
                        <div className={`font-inter text-[14px] ${severityTextColor(inc.severity)}`}>
                          {inc.severity}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-inter text-[17px] leading-[22px] font-medium text-[#2B2740]">
                        {inc.title}
                      </h3>
                      <p className="mt-1 font-inter text-[14px] leading-[18px] text-[#000000]/75">
                        {inc.description}
                      </p>
                      <span className="mt-2 block font-inter text-[13px] text-[#000000]/60">
                        Source: {inc.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop */}
              <div className="hidden md:grid md:grid-cols-[155px_1px_minmax(0,1fr)] gap-5">
                <div className="relative space-y-7">
                  {incidents.map((inc, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {incidentIcon(inc.severity)}
                      <div>
                        <div className="font-inter text-[16px] font-medium text-[#000000]/60">
                          {inc.date}
                        </div>
                        <div className={`font-inter text-[14px] ${severityTextColor(inc.severity)}`}>
                          {inc.severity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-px bg-[#2B2740]/15" />

                <div className="space-y-6">
                  {incidents.map((inc, i) => (
                    <div key={i} className="grid grid-cols-1 lg:grid-cols-[1fr_150px] gap-3 lg:gap-6">
                      <div className="lg:translate-x-5">
                        <h3 className="font-inter text-[17px] sm:text-[18px] leading-[22px] font-medium text-[#2B2740]">
                          {inc.title}
                        </h3>
                        <p className="mt-1 font-inter text-[14px] sm:text-[15px] leading-[18px] text-[#000000]/75">
                          {inc.description}
                        </p>
                      </div>
                      <span className="self-start lg:self-center font-inter text-[13px] sm:text-[14px] text-[#000000]/60">
                        Source: {inc.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            ASSESSMENT
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div
            className="w-full max-w-[1316px] min-h-[142px] mx-auto rounded-xl p-3"
            style={sectionStyle}
          >
            <div
              className="w-full h-full min-h-[116px] rounded-xl px-5 sm:px-7 py-5"
              style={{
                background: '#F6F4FE',
                border: '0.15px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 3px 8px rgba(43, 39, 64, 0.03)',
              }}
            >
              <h2 className="font-poppins text-[22px] leading-[27px] font-bold text-[#2B2740]">
                Assessment
              </h2>

              <p className="mt-2 font-inter text-[18px] sm:text-[22px] leading-[24px] sm:leading-[27px] font-medium text-[#000000]">
                The operator satisfies our safety framework for (trip-type)
                safety.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            RECOMMENDED DOCUMENTS
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3">
          <div
            className="w-full max-w-[1316px] min-h-[200px] mx-auto rounded-xl p-5 sm:p-6"
            style={sectionStyle}
          >
            <div className="flex items-center gap-3">
              <h2 className="font-poppins text-[14px] leading-[18px] font-bold text-[#2B2740]">
                Recommended Documents To Request
              </h2>

              <span className="w-3.5 h-3.5 rounded-full bg-[#BDBDBD] text-white flex items-center justify-center text-[9px] font-bold leading-none">
                i
              </span>
            </div>

            <p className="font-inter text-[14px] leading-[18px] text-[#000000]">
              Requesting these documents can help verify the operator&apos;s
              safety practices.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-5 sm:px-4 md:px-8">
              {[
                {
                  title: (
                    <>
                      Safety
                      <br />
                      Plan
                    </>
                  ),
                  icon: (
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                    >
                      <rect
                        x="12"
                        y="7"
                        width="26"
                        height="36"
                        rx="2"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M19 17h12M19 23h12M19 29h7"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M33 5v8h8"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ),
                },
                {
                  title: (
                    <>
                      Equipment
                      <br />
                      Inspection
                      <br />
                      Records
                    </>
                  ),
                  icon: (
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                    >
                      <ellipse
                        cx="25"
                        cy="13"
                        rx="12"
                        ry="5"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M13 13v12c0 2.8 5.4 5 12 5s12-2.2 12-5V13"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M13 25v8c0 2.8 5.4 5 12 5s12-2.2 12-5v-8"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="35"
                        cy="35"
                        r="6"
                        fill="#F6F4FE"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M32 35l2 2 4-4"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
                {
                  title: (
                    <>
                      Emergency
                      <br />
                      Response
                      <br />
                      Plan
                    </>
                  ),
                  icon: (
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                    >
                      <rect
                        x="12"
                        y="7"
                        width="26"
                        height="36"
                        rx="2"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M19 17h12M19 23h12M19 29h8"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M34 31l2 2 4-4"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  title: <>Insurance</>,
                  icon: (
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                    >
                      <path
                        d="M25 6l15 6v10c0 10-6.5 17-15 22-8.5-5-15-12-15-22V12l15-6z"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="25"
                        cy="23"
                        r="7"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M25 19v8M21 23h8"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
                {
                  title: (
                    <>
                      Permits &amp;
                      <br />
                      Authorisations
                    </>
                  ),
                  icon: (
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                    >
                      <path
                        d="M13 6h22v38H13z"
                        stroke="#7E6BB3"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M18 14h12M18 20h12M18 26h9"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="34"
                        cy="36"
                        r="6"
                        fill="#F6F4FE"
                        stroke="#7E6BB3"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M31.5 36l1.7 1.7 3.3-3.3"
                        stroke="#7E6BB3"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="group w-full sm:w-[120px] h-[120px] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-out bg-[#F6F4FE] hover:bg-white hover:-translate-y-1 hover:shadow-md"
                  style={{
                    border: '0.1px solid rgba(43, 39, 64, 0.10)',
                    boxShadow: '0 3px 10px rgba(43, 39, 64, 0.05)',
                  }}
                >
                  {doc.icon}

                  <span className="mt-1 text-center font-inter text-[14px] leading-[15px] font-semibold text-[#000000]">
                    {doc.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            FOOTER / ACTIONS
        ================================================================= */}

        <section className="w-full px-3 sm:px-0 py-2 sm:py-3 pb-0">
          <div
            className="w-full max-w-[1316px] min-h-[520px] sm:min-h-[420px] xl:min-h-[260px] mx-auto rounded-t-xl rounded-b-none px-5 sm:px-8 py-5 flex flex-col"
            style={{
              background: 'rgba(126, 107, 179, 0.80)',
            }}
          >
            <h2 className="font-poppins text-[24px] leading-[30px] font-bold text-white">
              Actions
            </h2>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => router.push('/report-issue')}
                className="h-[55px] rounded-lg bg-[#EDE7FB] border border-[#2B2740]/5 flex items-center justify-center gap-3 font-inter text-[14px] sm:text-[16px] font-semibold text-[#2B2740] cursor-pointer hover:bg-white transition-colors"
              >
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2B2740" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 8.5V6.8a3 3 0 0 1 6 0v1.7" />
                  <path d="M7.5 9.5h9a3 3 0 0 1 3 3v3.5a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4v-3.5a3 3 0 0 1 3-3Z" />
                  <path d="M5 13H3.5M20.5 13H19" />
                  <path d="M8 10 6.5 8.5M16 10l1.5-1.5" />
                  <circle cx="9.5" cy="13.5" r=".75" fill="#2B2740" stroke="none" />
                  <circle cx="14.5" cy="13.5" r=".75" fill="#2B2740" stroke="none" />
                  <path d="M10 16.5c.8.7 3.2.7 4 0" />
                </svg>

                REPORT A BUG
              </button>

              <button
                type="button"
                onClick={() => router.push('/report-issue?type=feature')}
                className="h-[55px] rounded-lg bg-[#EDE7FB] border border-[#2B2740]/5 flex items-center justify-center gap-3 font-inter text-[14px] sm:text-[16px] font-semibold text-[#2B2740] cursor-pointer hover:bg-white transition-colors"
              >
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2B2740" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4.5a4.5 4.5 0 0 0 5 5l-7.8 7.8a2.2 2.2 0 0 1-3.1-3.1L16.4 6.4a4.5 4.5 0 0 0-1.9-1.9Z" />
                  <path d="m6.2 6.2 3.1 3.1" />
                  <path d="m4.5 19.5 2.2-2.2" />
                  <path d="m4 4 3 3" />
                  <path d="m16.5 16.5 3 3" />
                </svg>

                REQUEST A FEATURE
              </button>

              <button
                type="button"
                onClick={() => router.push('/safety-help')}
                className="h-[55px] rounded-lg bg-[#EDE7FB] border border-[#2B2740]/5 flex items-center justify-center gap-3 font-inter text-[14px] sm:text-[16px] font-semibold text-[#2B2740] cursor-pointer hover:bg-white transition-colors"
              >
                <span className="w-[25px] h-[25px] rounded-full border border-[#2B2740] flex items-center justify-center">
                  ?
                </span>

                REQUEST SAFETY HELP
              </button>

              <button
                type="button"
                onClick={downloadSafetyQuestions}
                className="h-[55px] rounded-lg bg-[#EDE7FB] border border-[#2B2740]/5 flex items-center justify-center gap-3 font-inter text-[14px] sm:text-[16px] font-semibold text-[#2B2740] cursor-pointer hover:bg-white transition-colors px-3"
              >
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2B2740" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M6 3h9l4 4v14H6z" />
                  <path d="M15 3v5h5" />
                  <path d="M12 11v6M9 14h6" />
                </svg>

                <span className="text-center">
                  DOWNLOAD RECOMMENDED
                  <br />
                  QUESTIONS
                </span>
              </button>
            </div>

            <div className="mt-5 flex flex-1 flex-col md:flex-row items-center justify-center md:justify-between gap-5 border-t border-white/30 pt-5">
              <p className="max-w-[330px] text-center md:text-left font-inter text-[14px] leading-[16px] font-normal text-white">
                AI-assisted safety assessments based on publicly available
                information. Should support—not replace—official travel
                advisories.
              </p>

              <div className="text-center font-inter text-[14px] leading-[16px] font-normal text-white">
                <p>Safety as a System™</p>
                <p>Copyright © Wondlo 2026</p>
              </div>

              <div className="w-[330px] hidden md:block" />
            </div>
          </div>
        </section>
      </main>

      <FreeSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        freeSearchesLeft={searchesLeft}
        previousSearches={savedAnalyses.map((report) => report.operatorName)}
        onSelectSearch={(q) => router.push(`/analyze/results?q=${encodeURIComponent(q)}`)}
        onUpgrade={() => router.push('/payments')}
        onSignOut={async () => {
          if (auth) await signOut(auth);
          router.push('/signin');
        }}
        savedAnalyses={savedAnalyses}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F4FE] flex items-center justify-center text-sm text-[#7E6BB3]">
          Loading safety analysis...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}