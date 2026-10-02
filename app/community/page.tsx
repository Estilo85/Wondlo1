'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import {
  FiUsers,
  FiFileText,
  FiShield,
  FiSearch,
  FiChevronDown,
  FiArrowUpCircle,
  FiLifeBuoy,
  FiMessageSquare,
  FiMessageCircle,
  FiShare2,
  FiMoreHorizontal,
  FiLink,
  FiX,
  FiCheck,
  FiImage,
  FiStar,
  FiBell,
  FiCheckCircle,
  FiCornerDownRight,
  FiTag,
  FiClock,
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from 'react-icons/fa6';
import ResultsNavbar from '@/components/ResultsNavbar';
import Footer from '@/components/Footer';
import { auth } from '@/lib/firebase-client';
import {
  COMMUNITY_REPORT_REASONS,
  MAX_REPORT_DETAILS_LENGTH,
  type CommunityReportReason,
} from '@/lib/community-reports';
import { MAX_POST_IMAGES } from '@/lib/community-images';
import { formatTag, MAX_POST_TAGS, normaliseTag } from '@/lib/community-tags';
import { resizePostImage } from '@/lib/image';

type PostCategory = 'Trip Experience' | 'Safety Warning';
type OpenDropdown = 'activity' | 'location' | 'sort' | null;

type PostImage = {
  src: string;
  alt: string;
};

type CommunityPost = {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  location: string;
  country: string;
  activity: string;
  category: PostCategory;
  timestamp: string;
  createdAt: number;
  title: string;
  body: string;
  likes: number;
  comments: number;
  ownedByMe?: boolean;
  tags: string[];
  images: PostImage[];
  pinned: boolean;
  verified: boolean;
  resolved: boolean;
};

type SortOption = 'top' | 'newest' | 'discussed' | 'trending';

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'top', label: 'Top' },
  { value: 'newest', label: 'Newest' },
  { value: 'discussed', label: 'Most discussed' },
  { value: 'trending', label: 'Trending' },
];

type FilterDropdownProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

type PostInteraction = {
  liked: boolean;
  likes: number;
  comments: number;
  shares: number;
};

type LocalComment = {
  id: string;
  text: string;
  author?: string;
  authorId?: string;
  authorAvatarUrl?: string | null;
  ownedByMe?: boolean;
  createdAt?: string;
  editedAt?: string | null;
  replies: LocalComment[];
};

type DraftImage = {
  src: string;
  name: string;
  alt: string;
};

type ReportTarget = {
  postId?: string;
  commentId?: string;
  userId?: string;
  label: string;
};

type SafetyReviewScore = 1 | 2 | 3 | 4 | 5;
type SafetyReviewQuestionKey =
  | 'operatorAssessment'
  | 'adventurePreparation'
  | 'riskAwareness'
  | 'safetyQuestions'
  | 'realWorldAccuracy';

type SafetyReviewAnswers = Record<
  SafetyReviewQuestionKey,
  SafetyReviewScore | null
>;

const COMMUNITY_POST_DRAFT_KEY = 'wondlo-community-post-draft-v2';

const SAFETY_REVIEW_QUESTIONS: Array<{
  key: SafetyReviewQuestionKey;
  question: string;
}> = [
  {
    key: 'operatorAssessment',
    question:
      'How much did the platform help you assess the operator’s safety before your adventure?',
  },
  {
    key: 'adventurePreparation',
    question:
      'How much did the platform help you prepare for the safety requirements of your adventure?',
  },
  {
    key: 'riskAwareness',
    question:
      'How much did the platform improve your awareness of the activity’s risks and safety precautions?',
  },
  {
    key: 'safetyQuestions',
    question:
      'How much did the platform help you know which safety checks or questions to raise with the operator?',
  },
  {
    key: 'realWorldAccuracy',
    question:
      'How closely did the safety information you used on the platform match what you experienced during the actual adventure?',
  },
];

const SAFETY_REVIEW_SCORES: Array<{
  value: SafetyReviewScore;
  label: string;
}> = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'A little' },
  { value: 3, label: 'Somewhat' },
  { value: 4, label: 'A lot' },
  { value: 5, label: 'Extremely' },
];

function formatPostTimestamp(timestamp: string) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(timestamp).getTime()) / 60_000)
  );

  if (elapsedMinutes < 1) return 'Just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

/*
 * Comments get the same relative time as posts. Older than a week the exact date
 * is more use than "12d ago", so anything past that switches format rather than
 * making the reader do arithmetic.
 */
function formatCommentTimestamp(timestamp?: string) {
  if (!timestamp) return '';

  const created = new Date(timestamp).getTime();

  if (!Number.isFinite(created)) return '';

  const elapsedMinutes = Math.floor((Date.now() - created) / 60_000);

  if (elapsedMinutes < 1) return 'Just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedMinutes < 60 * 24) return `${Math.floor(elapsedMinutes / 60)}h ago`;
  if (elapsedMinutes < 60 * 24 * 7) {
    return `${Math.floor(elapsedMinutes / (60 * 24))}d ago`;
  }

  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function sendCommunityRequest(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  payload?: Record<string, unknown>
) {
  const token = await auth?.currentUser?.getIdToken();
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload ?? {}),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || 'Unable to complete this action.');
  }

  return result;
}

/**
 * Renders a large count the way the stat cards read best: 1,284 stays exact
 * because it is useful, and 1,284 becomes "1.2k" only once the exact number is
 * too long to sit in the card without wrapping.
 */
function formatStatValue(value: number) {
  return value >= 10_000 ? `${(value / 1_000).toFixed(1)}k` : value.toLocaleString('en-GB');
}

const STATS = [
  { key: 'members', label: 'Total Members', Icon: FiUsers },
  { key: 'posts', label: 'Total Posts', Icon: FiFileText },
  { key: 'activeWarnings', label: 'Active Warnings', Icon: FiShield },
] as const;

type CommunityStats = {
  members: number | null;
  posts: number | null;
  activeWarnings: number | null;
};

/*
 * Engagement weighted towards conversation and reach rather than raw upvotes,
 * then divided by age. Without the age term the newest post with one upvote
 * would outrank a warning the community has been discussing for a week, which
 * is the opposite of what "trending" should mean.
 */
function trendingScore(
  post: CommunityPost,
  interaction: PostInteraction | undefined
) {
  const likes = interaction?.likes ?? post.likes;
  const comments = interaction?.comments ?? post.comments;
  const shares = interaction?.shares ?? 0;
  const ageHours = Math.max(
    1,
    (Date.now() - post.createdAt) / (60 * 60 * 1000)
  );

  return (likes + comments * 2 + shares * 3) / Math.pow(ageHours + 2, 1.5);
}

const CATEGORY_STYLES: Record<PostCategory, string> = {
  'Trip Experience': 'bg-[#EDE7FB] text-[#7E6BB3]',
  'Safety Warning': 'bg-[#FFF1E8] text-[#C51D14]',
};

const ACTIVITIES = [
  'All Activities',
  'Parasailing',
  'Snowboarding',
  'Trekking',
  'Kayaking',
  'ATV',
  'Ziplining',
  'Cave Diving',
  'Paragliding',
  'Volcano Boarding',
  'Heli-Skiing',
  'Hiking',
  'Snorkeling',
  'Safari',
  'Kayaking (Calm Water)',
  'Biking (Easy Trails)',
  'Horseback Riding (Easy)',
  'Canoeing',
  'Bungee Jumping',
  'Climbing',
  'Mountaineering',
  'Skydiving',
  'Base Jumping',
  'White-water Rafting (Advanced)',
  'Rock Climbing (Advanced)',
  'Ice Climbing',
  'Scuba Diving (Deep)',
  'Extreme Skiing',
  'Canyoning',
  'Shark Cage Diving',
  'Expedition',
  'Gorilla Tracking',
  'Free Solo Climbing',
  'Scuba Diving',
  'Freediving',
  'Surfing',
  'Kitesurfing',
  'Windsurfing',
  'Stand-up Paddleboarding',
  'Rafting',
  'River Tubing',
  'Sea Kayaking',
  'Mountain Biking',
  'Downhill Mountain Biking',
  'Trail Running',
  'Trail Hiking',
  'Backpacking',
  'Camping',
  'Glacier Hiking',
  'Glacier Trekking',
  'Alpine Climbing',
  'Via Ferrata',
  'Canyoneering',
  'Caving',
  'Wilderness Expedition',
  'Polar Expedition',
  'Desert Safari',
  'Dune Bashing',
  'Sandboarding',
  'Snowmobiling',
  'Dog Sledding',
  'Skiing',
  'Cross-country Skiing',
  'Ski Touring',
  'Rafting (Advanced)',
  'Wreck Diving',
  'Cage Diving',
  'Whale Watching',
  'Dolphin Watching',
  'Wildlife Tracking',
  'Wildlife Safari',
  'Birdwatching',
  'Rock Scrambling',
  'Abseiling',
  'Rappelling',
  'Caving Expedition',
  'Bouldering',
  'Mountaineering Expedition',
  'Hot Air Ballooning',
  'Paramotoring',
  'Microlight Flying',
  'Hang Gliding',
  'Aerobatic Flying',
  'Parachuting',
  'Zip Line',
  'Canopy Tour',
  'Tree Climbing',
  'Off-road Driving',
  '4x4 Adventure',
  'Motorcycle Touring',
  'Adventure Racing',
  'Orienteering',
  'Wilderness Survival',
  'Fishing Expedition',
  'Sport Fishing',
  'Ice Diving',
  'Underwater Caving',
  'Volcano Hiking',
  'Volcano Trekking',
];

const COUNTRIES = [
  'All Locations',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Côte d’Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'São Tomé and Príncipe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Türkiye',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const inputClass =
  'h-[50px] w-full rounded-[8px] border-0 bg-[#EDE7FB] py-2 pl-[48px] pr-4 text-[18px] font-normal leading-none text-[#2B2740] placeholder:text-black/50 outline-none transition-all focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[20px]';

const filterClass =
  'flex h-[50px] w-full items-center justify-between rounded-[7px] border border-[#7E6BB3] bg-[#F6F4FE] px-4 text-[18px] font-normal leading-none text-[#2B2740] sm:text-[20px]';

const primaryButtonClass =
  'flex h-[54px] w-full items-center justify-center gap-4 rounded-[9px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-6 text-[18px] font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 sm:h-[54px] sm:text-[20px]';

const secondaryButtonClass =
  'flex h-[54px] w-full items-center justify-center gap-4 rounded-[9px] border border-[#2B2740] bg-[#F6F4FE] px-6 text-[18px] font-semibold text-[#2B2740] shadow-[0_3px_5px_rgba(0,0,0,0.25)] transition-colors hover:bg-white sm:h-[54px] sm:text-[20px]';

function FilterDropdown({
  id,
  label,
  options,
  value,
  isOpen,
  onToggle,
  onChange,
}: FilterDropdownProps) {
  const [optionSearch, setOptionSearch] = useState('');

  const normalizedOptionSearch = optionSearch.trim().toLowerCase();
  const visibleOptions = normalizedOptionSearch
    ? options.filter((option) =>
        option.toLowerCase().includes(normalizedOptionSearch)
      )
    : options;

  return (
    <div
      className="relative w-full min-w-0 xl:w-[240px] xl:flex-shrink-0"
      data-community-dropdown="true"
    >
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}`}
        onClick={() => {
          if (!isOpen) setOptionSearch('');
          onToggle();
        }}
        className={`${filterClass} cursor-pointer gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E6BB3]/40`}
      >
        <span className="min-w-0 flex-1 truncate text-left">{value}</span>

        <FiChevronDown
          className={`h-[25px] w-[25px] flex-shrink-0 text-[#2B2740] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 top-full z-50 mt-2 max-h-[280px] w-full overflow-y-auto overscroll-contain rounded-[8px] border border-[#7E6BB3] bg-[#F6F4FE] py-1 shadow-[0_8px_24px_rgba(126,107,179,0.25)] sm:max-h-[320px]"
        >
          <div className="sticky top-0 z-10 bg-[#F6F4FE] px-2 pb-2 pt-1">
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-black/45"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <label htmlFor={`${id}-option-search`} className="sr-only">
                Search {label.toLowerCase()} options
              </label>

              <input
                id={`${id}-option-search`}
                type="search"
                value={optionSearch}
                onChange={(event) => setOptionSearch(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                autoComplete="off"
                className="h-[40px] w-full rounded-[7px] border border-[#7E6BB3]/60 bg-white py-2 pl-10 pr-3 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[15px]"
              />
            </div>
          </div>

          {visibleOptions.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onChange(option)}
                className={`group flex min-h-[44px] w-full items-center gap-3 px-4 py-2.5 text-left font-inter text-[15px] leading-snug transition-colors focus:bg-[#7E6BB3] focus:text-white focus:outline-none sm:text-[16px] ${
                  isSelected
                    ? 'bg-[#EDE7FB] font-semibold text-[#7E6BB3] hover:bg-[#7E6BB3] hover:text-white'
                    : 'text-[#2B2740] hover:bg-[#7E6BB3] hover:text-white'
                }`}
              >
                <span
                  className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white transition-colors ${
                    isSelected
                      ? 'border-[#7E6BB3] group-hover:border-white group-focus:border-white'
                      : 'border-[#7E6BB3]/60 group-hover:border-white group-focus:border-white'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <span className="h-[9px] w-[9px] rounded-full bg-[#7E6BB3]" />
                  )}
                </span>

                <span>{option}</span>
              </button>
            );
          })}

          {visibleOptions.length === 0 && (
            <p className="px-4 py-4 text-center font-inter text-[14px] text-black/50">
              No matching options.
            </p>
          )}
        </div>
      )}
    </div>
  );
}


/*
 * Replaces a comment wherever it sits in the tree, keeping its replies. An edit
 * only ever changes the text and the edited flag, so the reply list is carried
 * over rather than rebuilt from a refetch.
 */
function replaceComment(
  comments: LocalComment[],
  commentId: string,
  updated: LocalComment
): LocalComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, ...updated, replies: comment.replies };
    }

    if (comment.replies.length === 0) {
      return comment;
    }

    return {
      ...comment,
      replies: replaceComment(comment.replies, commentId, updated),
    };
  });
}

/*
 * Removes a comment and, when it was a top level one, its replies with it. The
 * database cascades a deleted parent onto its replies, so dropping the whole
 * branch locally is what matches the server.
 */
function removeComment(
  comments: LocalComment[],
  commentId: string
): LocalComment[] {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) =>
      comment.replies.length === 0
        ? comment
        : { ...comment, replies: removeComment(comment.replies, commentId) }
    );
}

function PostDescription({ body }: { body: string }) {
  const measurementRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMoreThanTwoLines, setHasMoreThanTwoLines] = useState(false);

  useEffect(() => {
    const element = measurementRef.current;

    if (!element) {
      return;
    }

    const measure = () => {
      const styles = window.getComputedStyle(element);
      const lineHeight = Number.parseFloat(styles.lineHeight);

      if (!Number.isFinite(lineHeight)) {
        return;
      }

      setHasMoreThanTwoLines(
        element.scrollHeight > lineHeight * 2 + 1
      );
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(measure);

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [body]);

  return (
    <div className="relative max-w-[900px]">
      <p
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 w-full font-inter text-[15px] font-normal leading-[1.45] text-black sm:text-[18px] lg:text-[24px]"
      >
        {body}
      </p>

      <p
        className="font-inter text-[15px] font-normal leading-[1.45] text-black sm:text-[18px] lg:text-[24px]"
        style={
          !isExpanded && hasMoreThanTwoLines
            ? {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {body}
      </p>

      {hasMoreThanTwoLines && (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="block pt-1 font-inter text-[16px] font-semibold leading-none text-[#7E6BB3] hover:underline sm:text-[19px] lg:text-[24px]"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('All Activities');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [composerDropdown, setComposerDropdown] = useState<OpenDropdown>(null);

  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [communityError, setCommunityError] = useState('');
  const [communityNotice, setCommunityNotice] = useState('');
  const [stats, setStats] = useState<CommunityStats>({
    members: null,
    posts: null,
    activeWarnings: null,
  });
  const [sortBy, setSortBy] = useState<SortOption>('top');
  const [selectedTag, setSelectedTag] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [isSafetyReviewOpen, setIsSafetyReviewOpen] = useState(false);
  const [safetyReviewDropdown, setSafetyReviewDropdown] =
    useState<OpenDropdown>(null);
  const [safetyReviewOperator, setSafetyReviewOperator] = useState('');
  const [safetyReviewCountry, setSafetyReviewCountry] = useState('');
  const [safetyReviewActivity, setSafetyReviewActivity] = useState('');
  const [safetyReviewAnswers, setSafetyReviewAnswers] =
    useState<SafetyReviewAnswers>({
      operatorAssessment: null,
      adventurePreparation: null,
      riskAwareness: null,
      safetyQuestions: null,
      realWorldAccuracy: null,
    });
  const [safetyReviewExperience, setSafetyReviewExperience] = useState('');
  const [safetyReviewImprovement, setSafetyReviewImprovement] = useState('');
  const [isSubmittingSafetyReview, setIsSubmittingSafetyReview] =
    useState(false);

  const allPosts = userPosts;

  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);

  const [draftCategory, setDraftCategory] =
    useState<PostCategory>('Trip Experience');

  const [draftCountry, setDraftCountry] = useState('');
  const [draftActivity, setDraftActivity] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftImages, setDraftImages] = useState<DraftImage[]>([]);
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [draftTagInput, setDraftTagInput] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const [sharedPostId, setSharedPostId] = useState<string | null>(null);

  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [reportReason, setReportReason] =
    useState<CommunityReportReason | ''>('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [postInteractions, setPostInteractions] = useState<
    Record<string, PostInteraction>
  >({});

  /*
   * A post id that has an in-flight upvote. The count moves immediately and the
   * button is disabled while the request runs, which stops a fast double click
   * from sending two toggles that both read the same starting state.
   */
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>(
    {}
  );

  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(
    null
  );

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {}
  );

  /*
   * Which comment a reply is being written under, per post. A null entry means
   * the reply box is closed for that post.
   */
  const [replyTargets, setReplyTargets] = useState<
    Record<string, string | null>
  >({});

  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const [editingCommentId, setEditingCommentId] = useState<string | null>(
    null
  );

  const [commentEditDrafts, setCommentEditDrafts] = useState<
    Record<string, string>
  >({});

  const [commentBusyId, setCommentBusyId] = useState<string | null>(null);

  /*
   * A post id with a post level action in flight, so the menu that opened the
   * warning and the post card cannot be triggered twice at once.
   */
  const [postBusyId, setPostBusyId] = useState<string | null>(null);

  const [localComments, setLocalComments] = useState<
    Record<string, LocalComment[]>
  >({});

  /*
   * Which image of a multi image post is on screen. A post with one image never
   * touches this, and a post with several keeps the rest of the strip hidden
   * until it is tapped.
   */
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});

  const loadCommunityPosts = useCallback(async () => {
    const token = await auth?.currentUser?.getIdToken();
    const response = await fetch('/api/community', {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Unable to sync community posts. Please try again.');
    }

    const data = (await response.json()) as {
      posts: Array<{
        id: string;
        author: string;
        authorId: string;
        authorAvatarUrl: string | null;
        country: string;
        activity: string;
        category: PostCategory;
        timestamp: string;
        title: string;
        body: string;
        likes: number;
        comments: number;
        shares: number;
        likedByMe: boolean;
        ownedByMe: boolean;
        tags: string[];
        images: PostImage[];
        pinned: boolean;
        verified: boolean;
        resolved: boolean;
        commentsList: LocalComment[];
      }>;
    };

    const posts = data.posts.map((post) => ({
      id: post.id,
      author: post.author,
      authorId: post.authorId,
      avatar: post.authorAvatarUrl ?? '',
      location: `${post.country} · ${post.activity}`,
      country: post.country,
      activity: post.activity,
      category: post.category,
      timestamp: formatPostTimestamp(post.timestamp),
      createdAt: new Date(post.timestamp).getTime(),
      title: post.title,
      body: post.body,
      likes: post.likes,
      comments: post.comments,
      ownedByMe: post.ownedByMe,
      tags: post.tags,
      images: post.images,
      pinned: post.pinned,
      verified: post.verified,
      resolved: post.resolved,
    }));

    setUserPosts(posts);
    setPostInteractions((current) => ({
      ...current,
      ...Object.fromEntries(
        data.posts.map((post) => [
          post.id,
          {
            liked: post.likedByMe,
            likes: post.likes,
            comments: post.comments,
            shares: post.shares,
          },
        ])
      ),
    }));
    setLocalComments((current) => ({
      ...current,
      ...Object.fromEntries(
        data.posts.map((post) => [post.id, post.commentsList])
      ),
    }));
  }, []);

  /*
   * The three stat cards used to read "500+", "1,200+" and "24" from a constant,
   * which meant they could be wrong indefinitely. They are now counted, and a
   * failure leaves the dash rather than inventing a number.
   */
  const loadCommunityStats = useCallback(async () => {
    try {
      const response = await fetch('/api/community/stats', { cache: 'no-store' });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as CommunityStats;

      setStats({
        members: typeof data.members === 'number' ? data.members : null,
        posts: typeof data.posts === 'number' ? data.posts : null,
        activeWarnings:
          typeof data.activeWarnings === 'number' ? data.activeWarnings : null,
      });
    } catch {
      // A missing count is not worth surfacing: the cards fall back to a dash.
    }
  }, []);

  const loadUnreadNotifications = useCallback(async () => {
    if (!auth?.currentUser) {
      setUnreadNotifications(0);
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/community/notifications?unread=1', {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { unreadCount?: number };
      setUnreadNotifications(data.unreadCount ?? 0);
    } catch {
      // The badge simply stays where it was.
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    void (async () => {
      try {
        await loadCommunityPosts();
        if (isActive) setCommunityError('');
      } catch {
        if (isActive) {
          setCommunityError('Unable to sync community posts. Please try again.');
        }
      }
    })();
    void (async () => {
      try {
        await loadCommunityStats();
      } catch {
        /* already logged */
      }
    })();
    void (async () => {
      try {
        await loadUnreadNotifications();
      } catch {
        /* already logged */
      }
    })();

    /*
     * The feed carries post images, so it is a heavy payload. Polling often
     * enough to exhaust the database connection pool costs more than it buys,
     * and a hidden tab does not need fresh data at all.
     */
    const POLL_INTERVAL_MS = 60_000;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void (async () => {
          try {
            await loadCommunityPosts();
            if (isActive) setCommunityError('');
          } catch {
            if (isActive) {
              setCommunityError(
                'Unable to sync community posts. Please try again.'
              );
            }
          }
        })();
      }
    }, POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
        void loadUnreadNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const unsubscribe = auth
      ? onAuthStateChanged(auth, (user) => {
          void refresh();
          void loadCommunityStats();
          void loadUnreadNotifications();

          /*
           * Signing in and out changes which posts are owned, which upvotes
           * are ours and how many notifications are unread, so the counts and
           * the badge both have to be read again from scratch.
           */
          if (!user) {
            setUnreadNotifications(0);
          }
        })
      : undefined;

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe?.();
    };
  }, [
    loadCommunityPosts,
    loadCommunityStats,
    loadUnreadNotifications,
  ]);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      const params = new URLSearchParams(window.location.search);
      if (params.get('compose') !== '1') return;

      try {
        const savedDraft = window.sessionStorage.getItem(
          COMMUNITY_POST_DRAFT_KEY
        );
        if (savedDraft) {
          const draft = JSON.parse(savedDraft) as {
            category?: PostCategory;
            country?: string;
            activity?: string;
            title?: string;
            body?: string;
            images?: DraftImage[];
            tags?: string[];
          };

          if (draft.category) setDraftCategory(draft.category);
          if (draft.country) setDraftCountry(draft.country);
          if (draft.activity) setDraftActivity(draft.activity);
          if (draft.title) setDraftTitle(draft.title);
          if (draft.body) setDraftBody(draft.body);
          if (draft.images) setDraftImages(draft.images);
          if (draft.tags) setDraftTags(draft.tags);
          setIsPostComposerOpen(true);
        }
        window.sessionStorage.removeItem(COMMUNITY_POST_DRAFT_KEY);
      } catch {
        setCommunityError('Your saved post draft could not be restored.');
      }

      window.history.replaceState({}, '', '/community');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const readSharedPost = () => {
      const params = new URLSearchParams(window.location.search);
      setSharedPostId(params.get('post'));
    };

    readSharedPost();

    window.addEventListener('popstate', readSharedPost);

    return () => {
      window.removeEventListener('popstate', readSharedPost);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest('[data-community-dropdown="true"]')
      ) {
        setOpenDropdown(null);
        setComposerDropdown(null);
        setSafetyReviewDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setComposerDropdown(null);
        setSafetyReviewDropdown(null);
        setOpenPostMenuId(null);
        setSharePostId(null);
        setLinkCopied(false);
        setIsPostComposerOpen(false);
        setEditingPostId(null);
        setIsSafetyReviewOpen(false);
        /*
         * Reset directly rather than through closeReportModal: this listener
         * is registered once, so it must only touch stable setters.
         */
        setReportTarget(null);
        setReportReason('');
        setReportDetails('');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const visiblePosts = useMemo(() => {
    if (sharedPostId) {
      return allPosts.filter((post) => post.id === sharedPostId);
    }

    const query = searchTerm.trim().toLowerCase();

    const filtered = allPosts.filter((post) => {
      const matchesSearch =
        !query ||
        [
          post.title,
          post.body,
          post.author,
          post.location,
          post.country,
          post.activity,
          post.category,
          ...post.tags,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesActivity =
        selectedActivity === 'All Activities' ||
        post.activity.toLowerCase() === selectedActivity.toLowerCase();

      const matchesLocation =
        selectedLocation === 'All Locations' ||
        post.country.toLowerCase() === selectedLocation.toLowerCase();

      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      return matchesSearch && matchesActivity && matchesLocation && matchesTag;
    });

    /*
     * Sorting reads the interaction counts, so an upvote moves a post up under
     * "Top" immediately rather than waiting for the next feed poll.
     */
    const sorted = [...filtered].sort((first, second) => {
      const firstInteraction = postInteractions[first.id];
      const secondInteraction = postInteractions[second.id];

      const firstLikes = firstInteraction?.likes ?? first.likes;
      const secondLikes = secondInteraction?.likes ?? second.likes;
      const firstComments = firstInteraction?.comments ?? first.comments;
      const secondComments = secondInteraction?.comments ?? second.comments;

      if (sortBy === 'newest') {
        return second.createdAt - first.createdAt;
      }

      if (sortBy === 'discussed') {
        return (
          secondComments - firstComments ||
          secondLikes - firstLikes ||
          second.createdAt - first.createdAt
        );
      }

      if (sortBy === 'trending') {
        return (
          trendingScore(second, secondInteraction) -
          trendingScore(first, firstInteraction)
        );
      }

      return secondLikes - firstLikes || second.createdAt - first.createdAt;
    });

    /*
     * Pinned posts are moderator picks, so they sit above the chosen sort on
     * every option except "Newest", where recency is the whole point and a
     * stale pinned post would only get in the way.
     */
    if (sortBy === 'newest') {
      return sorted;
    }

    return [
      ...sorted.filter((post) => post.pinned),
      ...sorted.filter((post) => !post.pinned),
    ];
  }, [
    allPosts,
    searchTerm,
    selectedActivity,
    selectedLocation,
    selectedTag,
    sharedPostId,
    sortBy,
    postInteractions,
  ]);

  /*
   * Every tag currently in the feed, so the filter only ever offers topics that
   * exist. A brand new post with a tag nobody else used still shows up, because
   * its own tag is in this list.
   */
  const availableTags = useMemo(() => {
    const tags = new Set<string>();

    for (const post of allPosts) {
      for (const tag of post.tags) {
        tags.add(tag);
      }
    }

    return [...tags].sort((first, second) => first.localeCompare(second));
  }, [allPosts]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedActivity !== 'All Activities' ||
    selectedLocation !== 'All Locations' ||
    selectedTag !== '';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedActivity('All Activities');
    setSelectedLocation('All Locations');
    setSelectedTag('');
    setOpenDropdown(null);
  };

  const resetSafetyReview = () => {
    setSafetyReviewDropdown(null);
    setSafetyReviewOperator('');
    setSafetyReviewCountry('');
    setSafetyReviewActivity('');
    setSafetyReviewAnswers({
      operatorAssessment: null,
      adventurePreparation: null,
      riskAwareness: null,
      safetyQuestions: null,
      realWorldAccuracy: null,
    });
    setSafetyReviewExperience('');
    setSafetyReviewImprovement('');
  };

  const openSafetyReviewModal = () => {
    setCommunityError('');
    setCommunityNotice('');
    setOpenDropdown(null);
    setComposerDropdown(null);
    resetSafetyReview();
    setIsSafetyReviewOpen(true);
  };

  const closeSafetyReviewModal = () => {
    if (isSubmittingSafetyReview) {
      return;
    }

    setIsSafetyReviewOpen(false);
    resetSafetyReview();
  };

  const submitSafetyReview = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmittingSafetyReview) {
      return;
    }

    const hasAllSafetyAnswers = SAFETY_REVIEW_QUESTIONS.every(
      ({ key }) => safetyReviewAnswers[key] !== null
    );
    const experience = safetyReviewExperience.trim();

    if (
      !safetyReviewOperator.trim() ||
      !safetyReviewCountry ||
      !safetyReviewActivity ||
      !hasAllSafetyAnswers ||
      experience.length < 20
    ) {
      return;
    }

    setIsSubmittingSafetyReview(true);

    try {
      await sendCommunityRequest('/api/safety-reviews', 'POST', {
        operatorName: safetyReviewOperator.trim(),
        country: safetyReviewCountry,
        activity: safetyReviewActivity,
        answers: safetyReviewAnswers,
        experience,
        improvement: safetyReviewImprovement.trim(),
      });

      setIsSafetyReviewOpen(false);
      resetSafetyReview();
      setCommunityError('');
      setCommunityNotice(
        'Thank you. Your safety review has been submitted.'
      );
    } catch (error) {
      setCommunityError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your safety review.'
      );
    } finally {
      setIsSubmittingSafetyReview(false);
    }
  };

  const resetPostComposer = () => {
    setDraftCategory('Trip Experience');
    setDraftCountry('');
    setDraftActivity('');
    setDraftTitle('');
    setDraftBody('');
    setDraftImages([]);
    setDraftTags([]);
    setDraftTagInput('');
    setEditingPostId(null);
  };

  const openNewPostComposer = () => {
    setOpenDropdown(null);
    setComposerDropdown(null);
    resetPostComposer();
    setIsPostComposerOpen(true);
  };

  const openEditPost = (post: CommunityPost) => {
    /*
     * ownedByMe comes from the server, which is the only place that can be
     * trusted: it is computed from the signed in user against the post's author.
     * This used to check the post list for the post's own id, which is always
     * true for a post that is on screen, so the guard never did anything.
     */
    if (!post.ownedByMe) {
      return;
    }

    setOpenPostMenuId(null);
    setOpenDropdown(null);
    setComposerDropdown(null);
    setEditingPostId(post.id);
    setDraftCategory(post.category);
    setDraftCountry(post.country);
    setDraftActivity(post.activity);
    setDraftTitle(post.title);
    setDraftBody(post.body);
    setDraftImages(
      post.images.map((image, index) => ({
        src: image.src,
        name: `Image ${index + 1}`,
        alt: image.alt,
      }))
    );
    setDraftTags(post.tags);
    setDraftTagInput('');
    setIsPostComposerOpen(true);
  };

  const deletePost = async (postId: string) => {
    setOpenPostMenuId(null);

    if (!window.confirm('Delete this community post? This cannot be undone.')) {
      return;
    }

    try {
      await sendCommunityRequest('/api/community', 'DELETE', { id: postId });
      setUserPosts((current) => current.filter((post) => post.id !== postId));
      setPostInteractions((current) => {
        const next = { ...current };
        delete next[postId];
        return next;
      });
      setLocalComments((current) => {
        const next = { ...current };
        delete next[postId];
        return next;
      });
      setCommunityError('');
    } catch (error) {
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to delete your post.'
      );
    }
  };

  const openReportModal = (post: CommunityPost) => {
    setOpenPostMenuId(null);
    setCommunityError('');
    setCommunityNotice('');
    setReportReason('');
    setReportDetails('');
    setReportTarget({ postId: post.id, label: post.title });
  };

  const openCommentReportModal = (postId: string, comment: LocalComment) => {
    setCommunityError('');
    setCommunityNotice('');
    setReportReason('');
    setReportDetails('');
    setReportTarget({
      postId,
      commentId: comment.id,
      label: comment.text,
    });
  };

  const openMemberReportModal = (
    post: CommunityPost,
    comment?: LocalComment
  ) => {
    setOpenPostMenuId(null);
    setCommunityError('');
    setCommunityNotice('');
    setReportReason('');
    setReportDetails('');
    setReportTarget({
      postId: post.id,
      userId: post.authorId,
      label: comment
        ? `${post.author} — "${comment.text}"`
        : `${post.author} — "${post.title}"`,
    });
  };

  const closeReportModal = () => {
    if (isSubmittingReport) {
      return;
    }

    setReportTarget(null);
    setReportReason('');
    setReportDetails('');
  };

  const submitReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reportTarget || !reportReason || isSubmittingReport) {
      return;
    }

    setIsSubmittingReport(true);

    try {
      await sendCommunityRequest('/api/community/report', 'POST', {
        postId: reportTarget.commentId || reportTarget.userId
          ? undefined
          : reportTarget.postId,
        commentId: reportTarget.commentId,
        userId: reportTarget.userId,
        reason: reportReason,
        details: reportDetails.trim(),
      });
      setReportTarget(null);
      setReportReason('');
      setReportDetails('');
      setCommunityError('');
      setCommunityNotice(
        'Thank you. Our moderators will review this and take action if needed.'
      );
    } catch (error) {
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to send your report.'
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const closePostComposer = () => {
    setIsPostComposerOpen(false);
    setComposerDropdown(null);
    resetPostComposer();
  };

  const handlePostImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    const remaining = MAX_POST_IMAGES - draftImages.length;

    if (remaining <= 0) {
      setCommunityError(
        `You can add up to ${MAX_POST_IMAGES} images to a post.`
      );
      return;
    }

    /*
     * Selecting several files at once is allowed, so extras are dropped rather
     * than failing the whole batch: a photographer picking six frames should
     * still get their first four.
     */
    if (files.length > remaining) {
      setCommunityError(
        `Only the first ${remaining} image${remaining === 1 ? '' : 's'} ${
          remaining === 1 ? 'was' : 'were'
        } added.`
      );
    }

    const accepted: DraftImage[] = [];

    for (const file of files.slice(0, remaining)) {
      const result = await resizePostImage(file);

      if (!result.ok) {
        setCommunityError(result.error);
        break;
      }

      accepted.push({
        src: result.dataUrl,
        name: result.name,
        alt: `${draftTitle.trim() || 'Post'} image ${accepted.length + 1}`,
      });
    }

    if (accepted.length > 0) {
      setDraftImages((current) => [...current, ...accepted]);
    }
  };

  const removePostImage = (index: number) => {
    setDraftImages((current) => current.filter((_, i) => i !== index));
  };

  const addDraftTag = () => {
    const tag = normaliseTag(draftTagInput);

    if (!tag) {
      setDraftTagInput('');
      return;
    }

    if (draftTags.includes(tag)) {
      setDraftTagInput('');
      return;
    }

    if (draftTags.length >= MAX_POST_TAGS) {
      setCommunityError(
        `You can add up to ${MAX_POST_TAGS} topics to a post.`
      );
      return;
    }

    setDraftTags((current) => [...current, tag]);
    setDraftTagInput('');
    setCommunityError('');
  };

  const submitAdventurePost = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmittingPost) {
      return;
    }

    const title = draftTitle.trim();
    const body = draftBody.trim();

    if (!title || !body || !draftCountry || !draftActivity) {
      return;
    }

    if (!auth?.currentUser) {
      try {
        window.sessionStorage.setItem(
          COMMUNITY_POST_DRAFT_KEY,
          JSON.stringify({
            category: draftCategory,
            country: draftCountry,
            activity: draftActivity,
            title,
            body,
            images: draftImages,
            tags: draftTags,
          })
        );
      } catch {
        setCommunityError('Unable to save your draft. Please try again.');
        return;
      }

      router.push(
        `/signin?redirect=${encodeURIComponent('/community?compose=1')}`
      );
      return;
    }

    setIsSubmittingPost(true);

    try {
      const payload = {
        category: draftCategory,
        country: draftCountry,
        activity: draftActivity,
        title,
        body,
        images: draftImages.map((image) => ({ src: image.src, alt: image.alt })),
        tags: draftTags,
      };

      if (editingPostId) {
        await sendCommunityRequest('/api/community', 'PATCH', {
          id: editingPostId,
          ...payload,
        });
      } else {
        await sendCommunityRequest('/api/community', 'POST', payload);
      }

      resetPostComposer();
      setIsPostComposerOpen(false);
      setCommunityError('');
      await loadCommunityPosts();
      await loadCommunityStats();
    } catch (error) {
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to save your post.'
      );
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const toggleLike = async (postId: string) => {
    const interaction = postInteractions[postId];

    if (!interaction || pendingLikes[postId]) {
      return;
    }

    /*
     * The count and the pressed state move before the request goes out, so the
     * button responds on the click rather than after a round trip. If the write
     * fails both go back to exactly what they were.
     */
    const nextLiked = !interaction.liked;
    const previous = interaction;

    setPendingLikes((current) => ({ ...current, [postId]: true }));
    setPostInteractions((current) =>
      current[postId]
        ? {
            ...current,
            [postId]: {
              ...current[postId],
              liked: nextLiked,
              likes: Math.max(
                0,
                current[postId].likes + (nextLiked ? 1 : -1)
              ),
            },
          }
        : current
    );

    try {
      const result = await sendCommunityRequest(
        `/api/community/${encodeURIComponent(postId)}/like`,
        'POST',
        { liked: nextLiked }
      );
      setPostInteractions((current) =>
        current[postId]
          ? {
              ...current,
              [postId]: {
                ...current[postId],
                liked: result.liked,
                likes: result.likes,
              },
            }
          : current
      );
      setCommunityError('');
    } catch (error) {
      setPostInteractions((current) =>
        current[postId] ? { ...current, [postId]: previous } : current
      );
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to update this upvote.'
      );
    } finally {
      setPendingLikes((current) => {
        const next = { ...current };
        delete next[postId];
        return next;
      });
    }
  };

  const toggleComments = (postId: string) => {
    setActiveCommentPost((current) =>
      current === postId ? null : postId
    );
  };

  const openReplyBox = (postId: string, commentId: string) => {
    setReplyTargets((current) => ({
      ...current,
      [postId]: current[postId] === commentId ? null : commentId,
    }));
  };

  /*
   * Applies a comment change to local state instead of reloading the whole feed.
   * A reply arrives with the id of the comment it hangs from, which is exactly
   * what the server returns, so a new comment appears the moment the write lands
   * rather than a second later. The server's total is what the counter shows,
   * so it never disagrees with the list.
   */
  const applyCommentChange = (
    postId: string,
    totalComments: number | null,
    change: (comments: LocalComment[]) => LocalComment[]
  ) => {
    setLocalComments((current) => ({
      ...current,
      [postId]: change(current[postId] ?? []),
    }));

    if (totalComments === null) {
      return;
    }

    setPostInteractions((current) =>
      current[postId]
        ? {
            ...current,
            [postId]: { ...current[postId], comments: totalComments },
          }
        : current
    );
  };

  const submitComment = async (
    event: React.FormEvent<HTMLFormElement>,
    postId: string,
    parentId: string | null = null
  ) => {
    event.preventDefault();

    const draftKey = parentId ?? postId;
    const text = (commentDrafts[draftKey] ?? '').trim();

    if (!text) {
      return;
    }

    setCommentBusyId(draftKey);

    try {
      const result = await sendCommunityRequest(
        `/api/community/${encodeURIComponent(postId)}/comments`,
        'POST',
        { text, parentId: parentId ?? undefined }
      );

      const newComment = {
        ...result.comment,
        replies: [],
      } satisfies LocalComment;

      if (parentId) {
        applyCommentChange(
          postId,
          result.comments,
          (comments) =>
            comments.map((comment) =>
              comment.id === parentId
                ? { ...comment, replies: [...comment.replies, newComment] }
                : comment
            )
        );
        setReplyTargets((current) => ({ ...current, [postId]: null }));
      } else {
        applyCommentChange(postId, result.comments, (comments) => [
          ...comments,
          newComment,
        ]);
      }

      setCommentDrafts((current) => ({ ...current, [draftKey]: '' }));
      setCommunityError('');
    } catch (error) {
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to post your comment.'
      );
    } finally {
      setCommentBusyId(null);
    }
  };

  const startEditingComment = (comment: LocalComment) => {
    setEditingCommentId(comment.id);
    setCommentEditDrafts((current) => ({
      ...current,
      [comment.id]: comment.text,
    }));
    setCommunityError('');
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setCommentEditDrafts((current) => {
      const next = { ...current };

      if (editingCommentId) {
        delete next[editingCommentId];
      }

      return next;
    });
  };

  const saveCommentEdit = async (postId: string, commentId: string) => {
    const text = (commentEditDrafts[commentId] ?? '').trim();

    if (!text || commentBusyId) {
      return;
    }

    setCommentBusyId(commentId);

    try {
      const result = await sendCommunityRequest(
        `/api/community/${encodeURIComponent(postId)}/comments`,
        'PATCH',
        { commentId, text }
      );

      const updated = result.comment;

      /*
       * An edit changes the text and the edited flag, never the total, so null
       * here leaves the counter that is already on screen alone.
       */
      applyCommentChange(postId, null, (comments) =>
        replaceComment(comments, commentId, updated)
      );

      setCommunityError('');
      cancelEditingComment();
    } catch (error) {
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to update this comment.'
      );
    } finally {
      setCommentBusyId(null);
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    if (commentBusyId) {
      return;
    }

    if (
      !window.confirm('Delete this comment? This cannot be undone.')
    ) {
      return;
    }

    setCommentBusyId(commentId);

    try {
      const result = await sendCommunityRequest(
        `/api/community/${encodeURIComponent(postId)}/comments`,
        'DELETE',
        { commentId }
      );

      applyCommentChange(postId, result.comments, (comments) =>
        removeComment(comments, commentId)
      );
      cancelEditingComment();
      setCommunityError('');
    } catch (error) {
      setCommunityError(
        error instanceof Error ? error.message : 'Unable to delete this comment.'
      );
    } finally {
      setCommentBusyId(null);
    }
  };

  /*
   * A share is only counted for a signed in member, because the count is a
   * reach metric rather than a personal action and the endpoint needs a session.
   * Reporting that here stops a signed out visitor being told their share was
   * recorded when nothing was written.
   */
  const incrementShareCount = async (postId: string) => {
    if (!auth?.currentUser) {
      return;
    }

    setPostInteractions((current) => {
      const interaction = current[postId];

      if (!interaction) {
        return current;
      }

      return {
        ...current,
        [postId]: {
          ...interaction,
          shares: interaction.shares + 1,
        },
      };
    });

    try {
      const result = await sendCommunityRequest(
        `/api/community/${encodeURIComponent(postId)}/share`,
        'POST'
      );

      if (typeof result.shares === 'number') {
        setPostInteractions((current) => {
          const interaction = current[postId];

          if (!interaction) {
            return current;
          }

          return {
            ...current,
            [postId]: { ...interaction, shares: result.shares },
          };
        });
      }
    } catch {
      /*
       * The optimistic count stays visible: a share genuinely happened, and the
       * next feed load reconciles the number against the database.
       */
    }
  };

  const getPostShareUrl = (postId: string) => {
    const url = new URL(window.location.href);

    url.search = '';
    url.hash = '';
    url.searchParams.set('post', postId);

    return url.toString();
  };

  const openSharePopup = (postId: string) => {
    setLinkCopied(false);
    setSharePostId(postId);
  };

  const openExternalShare = (
    post: CommunityPost,
    platform: 'whatsapp' | 'x' | 'facebook'
  ) => {
    const postUrl = getPostShareUrl(post.id);
    const shareText = `${post.title}\n${postUrl}`;

    let url = '';

    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    }

    if (platform === 'x') {
      url = `https://x.com/intent/post?text=${encodeURIComponent(
        post.title
      )}&url=${encodeURIComponent(postUrl)}`;
    }

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postUrl
      )}`;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer,width=720,height=620'
    );

    incrementShareCount(post.id);
    setSharePostId(null);
    setLinkCopied(false);
  };

  const copyTextToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    document.execCommand('copy');

    document.body.removeChild(textarea);
  };

  const copyPostLink = async (post: CommunityPost) => {
    const postUrl = getPostShareUrl(post.id);

    try {
      await copyTextToClipboard(postUrl);

      incrementShareCount(post.id);
      setLinkCopied(true);
    } catch {
      setLinkCopied(false);
    }
  };

  const shareToInstagram = async (post: CommunityPost) => {
    const postUrl = getPostShareUrl(post.id);

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.body,
          url: postUrl,
        });

        incrementShareCount(post.id);
        setSharePostId(null);
        setLinkCopied(false);
        return;
      }

      await copyTextToClipboard(postUrl);

      incrementShareCount(post.id);
      setLinkCopied(true);

      window.open(
        'https://www.instagram.com/',
        '_blank',
        'noopener,noreferrer'
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      /*
       * Cancelling the native share sheet is a choice; anything else means the
       * link could not be copied or the share sheet failed, and the visitor
       * should be told rather than left with a dialog that did nothing.
       */
      setLinkCopied(false);
      setCommunityError(
        'We could not share this post. Try copying the link instead.'
      );
    }
  };

  /*
 * Marks a safety warning as still current, or reopens one the author has
 * resolved. Only the author can do it, and only on a Safety Warning, so the
 * button is not offered anywhere else.
 */
  const shareTarget =
    allPosts.find((post) => post.id === sharePostId) ?? null;

  /*
   * A post can disappear while its share dialog is open, which used to leave the
   * dialog stuck on screen with nothing in it. Closing it is the safe reaction:
   * the share simply did not happen.
   */
  useEffect(() => {
    if (!sharePostId || shareTarget) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSharePostId(null);
      setLinkCopied(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [sharePostId, shareTarget]);

  const isSharedPostView = Boolean(sharedPostId);

  const canSubmitPost =
    Boolean(draftTitle.trim()) &&
    Boolean(draftBody.trim()) &&
    Boolean(draftCountry) &&
    Boolean(draftActivity) &&
    !isSubmittingPost;

  const canSubmitSafetyReview =
    Boolean(safetyReviewOperator.trim()) &&
    Boolean(safetyReviewCountry) &&
    Boolean(safetyReviewActivity) &&
    SAFETY_REVIEW_QUESTIONS.every(
      ({ key }) => safetyReviewAnswers[key] !== null
    ) &&
    safetyReviewExperience.trim().length >= 20 &&
    !isSubmittingSafetyReview;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <ResultsNavbar />

      <main className="mx-auto w-full max-w-[1316px] flex-grow px-5 pb-8 pt-12 sm:px-8 lg:px-0 lg:pt-14">
        {!isSharedPostView && (
          <>
            {/* Page Header */}
            <div className="text-center">
              <h1 className="font-poppins text-[38px] font-bold leading-[1.1] text-[#2B2740] sm:text-[44px] lg:text-[50px]">
                Community Hub
              </h1>

              <p className="mt-2 font-poppins text-[17px] font-normal leading-[1.35] text-black sm:text-[20px] lg:text-[24px]">
                Your safe space for connecting, learning, and travelling bolder.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="mt-10 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-8 lg:mt-11 lg:gap-[36px]">
              {STATS.map(({ key, label, Icon }) => (
                <div
                  key={key}
                  className="flex h-[120px] w-full max-w-[300px] items-center rounded-[10px] bg-[#7E6BB3] px-5 text-white"
                >
                  <div className="flex h-[55px] w-[55px] flex-shrink-0 items-center justify-center rounded-full border border-white">
                    <Icon
                      className="h-[36px] w-[36px] text-white"
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="ml-5 flex flex-col justify-center">
                    <span className="font-inter text-[18px] font-semibold leading-tight text-white lg:text-[22px]">
                      {label}
                    </span>

                    {/*
                     * A dash while the count loads or after it fails, rather
                     * than a placeholder number that could be mistaken for a
                     * real total.
                     */}
                    <span className="mt-1 font-inter text-[32px] font-bold leading-none text-white lg:text-[36px]">
                      {stats[key] === null
                        ? '—'
                        : formatStatValue(stats[key] as number)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Section */}
            <div className="relative z-30 mt-10 w-full rounded-[10px] border-[1.5px] border-[#7E6BB3] bg-transparent px-5 py-5 lg:mt-[30px] lg:px-[55px]">
              <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_180px_180px] md:items-center md:gap-4 xl:flex xl:flex-row xl:justify-between xl:gap-8">
                <div className="relative w-full min-w-0 xl:w-[580px] xl:flex-shrink-0">
                  <FiSearch
                    className="pointer-events-none absolute left-4 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-black/50"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <label htmlFor="community-search" className="sr-only">
                    Search community posts
                  </label>

                  <input
                    id="community-search"
                    type="text"
                    placeholder="Search for a destination, topic, or warning..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <FilterDropdown
                  id="activity-filter"
                  label="Filter by activity"
                  options={ACTIVITIES}
                  value={selectedActivity}
                  isOpen={openDropdown === 'activity'}
                  onToggle={() =>
                    setOpenDropdown((current) =>
                      current === 'activity' ? null : 'activity'
                    )
                  }
                  onChange={(activity) => {
                    setSelectedActivity(activity);
                    setOpenDropdown(null);
                  }}
                />

                <FilterDropdown
                  id="location-filter"
                  label="Filter by location"
                  options={COUNTRIES}
                  value={selectedLocation}
                  isOpen={openDropdown === 'location'}
                  onToggle={() =>
                    setOpenDropdown((current) =>
                      current === 'location' ? null : 'location'
                    )
                  }
                  onChange={(location) => {
                    setSelectedLocation(location);
                    setOpenDropdown(null);
                  }}
                />

                {/*
                 * Sorting used to be hardwired to "most upvoted". The order is
                 * a third dropdown rather than a segmented control so it sits
                 * with the other feed controls and reads the same on mobile.
                 */}
                <FilterDropdown
                  id="sort-filter"
                  label="Sort posts"
                  options={SORT_OPTIONS.map((option) => option.label)}
                  value={
                    SORT_OPTIONS.find((option) => option.value === sortBy)
                      ?.label ?? 'Top'
                  }
                  isOpen={openDropdown === 'sort'}
                  onToggle={() =>
                    setOpenDropdown((current) =>
                      current === 'sort' ? null : 'sort'
                    )
                  }
                  onChange={(label) => {
                    const option = SORT_OPTIONS.find(
                      (entry) => entry.label === label
                    );

                    if (option) {
                      setSortBy(option.value);
                    }

                    setOpenDropdown(null);
                  }}
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="mt-4 flex justify-end">
              <Link
                href="/community/notifications"
                className="relative inline-flex h-[48px] items-center gap-2 rounded-[8px] border border-[#7E6BB3] bg-[#F6F4FE] px-5 font-inter text-[15px] font-semibold text-[#2B2740] transition-colors hover:bg-[#EDE7FB]"
              >
                <FiBell
                  className="h-[20px] w-[20px]"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <span>Notifications</span>

                {/*
                 * The count is announced politely rather than assertively: a
                 * reply arriving is worth noticing but not worth interrupting
                 * whatever the visitor is reading.
                 */}
                {unreadNotifications > 0 && (
                  <span
                    role="status"
                    aria-live="polite"
                    className="ml-1 flex h-[24px] min-w-[24px] items-center justify-center rounded-full bg-[#C51D14] px-2 font-inter text-[12px] font-semibold text-white"
                  >
                    {unreadNotifications > 99
                      ? '99+'
                      : unreadNotifications}
                  </span>
                )}
              </Link>
            </div>

            {/*
             * Topics are chips rather than a dropdown: they double as a summary
             * of what people are actually posting about, which the fixed
             * activity and location lists cannot show.
             */}
            {availableTags.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span className="flex items-center gap-1 font-inter text-[13px] font-semibold uppercase tracking-wide text-black/45">
                  <FiTag
                    className="h-[14px] w-[14px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  Topics
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedTag('')}
                  aria-pressed={selectedTag === ''}
                  className={`rounded-full px-3 py-1 font-inter text-[13px] font-semibold transition-colors ${
                    selectedTag === ''
                      ? 'bg-[#7E6BB3] text-white'
                      : 'bg-[#EDE7FB] text-[#7E6BB3] hover:bg-[#C7B5F5]'
                  }`}
                >
                  All
                </button>

                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSelectedTag((current) =>
                        current === tag ? '' : tag
                      )
                    }
                    aria-pressed={selectedTag === tag}
                    className={`rounded-full px-3 py-1 font-inter text-[13px] font-semibold transition-colors ${
                      selectedTag === tag
                        ? 'bg-[#7E6BB3] text-white'
                        : 'bg-[#EDE7FB] text-[#7E6BB3] hover:bg-[#C7B5F5]'
                    }`}
                  >
                    {formatTag(tag)}
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-5 lg:flex-row lg:gap-6">
              <button
                type="button"
                onClick={openNewPostComposer}
                className="w-full lg:w-[484px] lg:flex-shrink-0"
              >
                <span className={primaryButtonClass}>
                  <FiArrowUpCircle
                    className="h-[38px] w-[38px] flex-shrink-0 text-white sm:h-[40px] sm:w-[40px]"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />

                  <span>Share your Adventure</span>
                </span>
              </button>

              <Link
                href="/safety-help"
                className="w-full lg:w-[484px] lg:flex-shrink-0"
              >
                <span className={primaryButtonClass}>
                  <FiLifeBuoy
                    className="h-[38px] w-[38px] flex-shrink-0 text-white sm:h-[40px] sm:w-[40px]"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />

                  <span>Ask for Safety Help</span>
                </span>
              </Link>
            </div>

            {/* Leave Safety Review */}
            <div className="mt-5 flex flex-col items-center justify-center gap-5 lg:flex-row lg:gap-6">
              <button
                type="button"
                onClick={openSafetyReviewModal}
                className="w-full lg:w-[484px] lg:flex-shrink-0"
              >
                <span className={secondaryButtonClass}>
                  <FiMessageSquare
                    className="h-[38px] w-[38px] flex-shrink-0 text-[#2B2740] sm:h-[40px] sm:w-[40px]"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />

                  <span>Leave Safety Review</span>
                </span>
              </button>

              <Link
                href="/safety-reviews"
                className="w-full lg:w-[484px] lg:flex-shrink-0"
              >
                <span className={secondaryButtonClass}>
                  <FiStar
                    className="h-[38px] w-[38px] flex-shrink-0 text-[#2B2740] sm:h-[40px] sm:w-[40px]"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />

                  <span>Read Safety Reviews</span>
                </span>
              </Link>
            </div>

            {/* Sample Data Notice */}
            <p className="mt-8 text-center font-inter text-[14px] text-black/50">
              Community posts, upvotes, and comments are shared with everyone.
            </p>

            {communityError && (
              <p
                role="status"
                className="mt-3 text-center font-inter text-[14px] text-[#C51D14]"
              >
                {communityError}
              </p>
            )}

            {communityNotice && (
              <p
                role="status"
                className="mt-3 text-center font-inter text-[14px] text-[#196469]"
              >
                {communityNotice}
              </p>
            )}

            {/* Active Filter Summary */}
            {hasActiveFilters && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-center">
                {searchTerm.trim() && (
                  <span className="rounded-full bg-[#EDE7FB] px-3 py-1 font-inter text-[14px] text-[#7E6BB3]">
                    Search: {searchTerm.trim()}
                  </span>
                )}

                {selectedActivity !== 'All Activities' && (
                  <span className="rounded-full bg-[#EDE7FB] px-3 py-1 font-inter text-[14px] text-[#7E6BB3]">
                    Activity: {selectedActivity}
                  </span>
                )}

                {selectedLocation !== 'All Locations' && (
                  <span className="rounded-full bg-[#EDE7FB] px-3 py-1 font-inter text-[14px] text-[#7E6BB3]">
                    Location: {selectedLocation}
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-inter text-[14px] font-semibold text-[#7E6BB3] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Traveler Posts */}
        <div
          className={
            isSharedPostView
              ? 'w-full space-y-5'
              : 'mt-7 w-full space-y-5'
          }
        >
          {visiblePosts.length === 0 ? (
            <div className="rounded-[10px] border border-[#7E6BB3] bg-[#F6F4FE] p-10 text-center shadow-[0_3px_5px_rgba(0,0,0,0.25)]">
              <FiSearch
                className="mx-auto h-8 w-8 text-black/50"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <p className="mt-4 font-inter text-[18px] font-semibold text-[#2B2740]">
                {isSharedPostView
                  ? 'This shared post could not be found.'
                  : 'No posts match the selected filters.'}
              </p>

              {!isSharedPostView && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 font-inter text-[16px] font-semibold text-[#7E6BB3] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            visiblePosts.map((post) => {
              const interaction = postInteractions[post.id] ?? {
                liked: false,
                likes: post.likes,
                comments: post.comments,
                shares: 0,
              };

              const comments = localComments[post.id] ?? [];

              const isCommenting =
                activeCommentPost === post.id ||
                sharedPostId === post.id;

              const isOwnPost = Boolean(post.ownedByMe);

              return (
                <article
                  key={post.id}
                  className="w-full rounded-[10px] border border-[#7E6BB3] bg-[#F6F4FE] p-4 shadow-[0_3px_5px_rgba(0,0,0,0.25)] sm:p-6 lg:p-[24px]"
                >
                  {/* Post Header */}
                  <div className="flex min-h-[80px] items-center gap-3 sm:gap-4">
                    <div className="relative flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#C7B5F5]/75 sm:h-[64px] sm:w-[64px] lg:h-[80px] lg:w-[80px]">
                      {post.avatar ? (
                        <Image
                          src={post.avatar}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <FiUsers
                          className="h-[28px] w-[28px] text-[#7E6BB3] sm:h-[32px] sm:w-[32px] lg:h-[40px] lg:w-[40px]"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-inter text-[21px] font-semibold leading-tight text-[#2B2740] sm:text-[27px] lg:text-[32px]">
                        {post.author}
                      </h2>

                      <div className="mt-1 flex min-w-0 flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                        {/* Location + Activity */}
                        <div className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1 lg:flex-1">
                          <span className="max-w-full break-words font-inter text-[14px] font-normal leading-tight text-black sm:text-[18px] lg:text-[24px]">
                            {post.country}
                          </span>

                          <span
                            className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-black sm:h-[6px] sm:w-[6px] lg:h-2 lg:w-2"
                            aria-hidden="true"
                          />

                          <span className="max-w-full break-words font-inter text-[14px] font-normal leading-tight text-black sm:text-[18px] lg:text-[24px]">
                            {post.activity}
                          </span>
                        </div>

                        {/* Post Type + Time + Dots */}
                        <div className="flex w-full flex-shrink-0 items-center justify-end gap-2 sm:gap-4 lg:w-auto lg:gap-6">
                          <span
                            className={`flex h-[28px] items-center justify-center whitespace-nowrap rounded-[7px] px-2 text-center font-inter text-[11px] font-medium leading-none sm:h-[38px] sm:min-w-[175px] sm:px-4 sm:text-[18px] lg:h-[50px] lg:w-[220px] lg:text-[24px] ${
                              CATEGORY_STYLES[post.category]
                            }`}
                          >
                            {post.category}
                          </span>

                          <span className="whitespace-nowrap font-poppins text-[12px] font-medium leading-none text-black/50 sm:text-[18px] lg:text-[24px]">
                            {post.timestamp}
                          </span>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenPostMenuId((current) =>
                                  current === post.id ? null : post.id
                                )
                              }
                              aria-label="Post options"
                              aria-expanded={openPostMenuId === post.id}
                              title="Post options"
                              className="flex flex-shrink-0 items-center justify-center focus:outline-none"
                            >
                              <FiMoreHorizontal
                                className="h-[20px] w-[20px] text-black/50 sm:h-[22px] sm:w-[22px] lg:h-[24px] lg:w-[24px]"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            </button>

                            {openPostMenuId === post.id && (
                              <div className="absolute right-0 top-full z-20 mt-2 w-36 rounded-[8px] border border-[#7E6BB3]/30 bg-white p-1 shadow-lg">
                                {isOwnPost ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openEditPost(post)}
                                      className="block w-full rounded-md px-3 py-2 text-left font-inter text-[14px] font-medium text-[#2B2740] hover:bg-[#EDE7FB]"
                                    >
                                      Update post
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void deletePost(post.id)
                                      }
                                      className="block w-full rounded-md px-3 py-2 text-left font-inter text-[14px] font-medium text-[#C51D14] hover:bg-[#FFF1E8]"
                                    >
                                      Delete post
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openReportModal(post)}
                                    className="block w-full rounded-md px-3 py-2 text-left font-inter text-[14px] font-medium text-[#2B2740] hover:bg-[#EDE7FB]"
                                  >
                                    Report post
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {post.images.length > 0 && (
                    <div className="relative mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:mt-2">
                      {post.images.map((image, index) => (
                        <div
                          key={`${post.id}-image-${index}`}
                          className="relative h-[190px] w-full overflow-hidden rounded-[10px] sm:h-[220px] lg:h-[240px]"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt ?? `${post.title} image ${index + 1}`}
                            fill
                            sizes="(max-width: 1316px) 100vw, 600px"
                            className="object-cover"
                            unoptimized={image.src.startsWith('data:')}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Text */}
                  <div className="mt-4 space-y-1">
                    <h3 className="font-inter text-[18px] font-semibold leading-[1.3] text-[#2B2740] sm:text-[21px] lg:text-[26px]">
                      {post.title}
                    </h3>

                    <PostDescription
                      key={`${post.id}-${post.body}`}
                      body={post.body}
                    />
                  </div>

                  {/* Interaction Divider */}
                  <div className="mt-4 border-t border-black/50 pt-4 lg:mt-5">
                    <div className="grid grid-cols-3 items-center font-inter text-[16px] font-medium text-black/90 sm:text-[18px] lg:text-[24px]">
                      {/* Upvote */}
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        aria-pressed={interaction.liked}
                        aria-label={`Upvote ${interaction.likes}`}
                        className="flex items-center justify-start gap-2 focus:outline-none sm:gap-3"
                      >
                        <FiArrowUpCircle
                          className={`h-[22px] w-[22px] flex-shrink-0 transition-colors sm:h-[24px] sm:w-[24px] lg:h-[30px] lg:w-[30px] ${
                            interaction.liked
                              ? 'text-[#7E6BB3]'
                              : 'text-black/75'
                          }`}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />

                        <span className="hidden sm:inline">
                          Upvote
                        </span>

                        <span
                          className={`font-inter text-[15px] font-medium sm:text-[18px] lg:text-[24px] ${
                            interaction.liked
                              ? 'text-[#7E6BB3]'
                              : 'text-black/75'
                          }`}
                        >
                          {interaction.likes}
                        </span>
                      </button>

                      {/* Comment */}
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        aria-expanded={isCommenting}
                        aria-label={`Comment ${interaction.comments}`}
                        className="flex items-center justify-center gap-2 focus:outline-none sm:gap-3"
                      >
                        <FiMessageCircle
                          className="h-[22px] w-[22px] flex-shrink-0 text-black/75 sm:h-[24px] sm:w-[24px] lg:h-[30px] lg:w-[30px]"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />

                        <span className="hidden sm:inline">
                          Comment
                        </span>

                        <span className="font-inter text-[15px] font-medium text-black/75 sm:text-[18px] lg:text-[24px]">
                          {interaction.comments}
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => openSharePopup(post.id)}
                        aria-label={`Share ${interaction.shares}`}
                        className="flex items-center justify-end gap-2 focus:outline-none sm:gap-3"
                      >
                        <FiShare2
                          className="h-[22px] w-[22px] flex-shrink-0 text-black/75 sm:h-[24px] sm:w-[24px] lg:h-[30px] lg:w-[30px]"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />

                        <span className="hidden sm:inline">
                          Share
                        </span>

                        <span className="font-inter text-[15px] font-medium text-black/75 sm:text-[18px] lg:text-[24px]">
                          {interaction.shares}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Comments */}
                  {isCommenting && (
                    <div className="mt-4 border-t border-[#7E6BB3]/20 pt-4">
                      {comments.length > 0 && (
                        <div className="mb-4 space-y-3">
                          {comments.map((comment) => {
                            const isEditingComment =
                              editingCommentId === comment.id;
                            const isCommentBusy = commentBusyId === comment.id;

                            return (
                              <div
                                key={comment.id}
                                className="flex items-start gap-3 rounded-[8px] bg-[#EDE7FB] px-4 py-3"
                              >
                                <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#C7B5F5]/75">
                                  {comment.authorAvatarUrl ? (
                                    <Image
                                      src={comment.authorAvatarUrl}
                                      alt=""
                                      fill
                                      sizes="36px"
                                      className="object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <FiUsers
                                      className="h-5 w-5 text-[#7E6BB3]"
                                      strokeWidth={1.6}
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <p className="font-inter text-[13px] font-semibold text-[#2B2740] sm:text-[14px]">
                                      {comment.author || 'You'}
                                    </p>

                                    {comment.ownedByMe && !isEditingComment && (
                                      <div className="flex items-center gap-3">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            startEditingComment(comment)
                                          }
                                          className="font-inter text-[12px] font-semibold text-[#7E6BB3] underline-offset-2 hover:underline sm:text-[13px]"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void deleteComment(
                                              post.id,
                                              comment.id
                                            )
                                          }
                                          disabled={isCommentBusy}
                                          className="font-inter text-[12px] font-semibold text-[#C51D14] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}

                                    {!comment.ownedByMe && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openCommentReportModal(
                                            post.id,
                                            comment
                                          )
                                        }
                                        className="font-inter text-[12px] font-semibold text-black/50 underline-offset-2 hover:text-[#7E6BB3] hover:underline sm:text-[13px]"
                                      >
                                        Report
                                      </button>
                                    )}
                                  </div>

                                  {isEditingComment ? (
                                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
                                      <label
                                        htmlFor={`comment-edit-${comment.id}`}
                                        className="sr-only"
                                      >
                                        Edit your comment
                                      </label>

                                      <input
                                        id={`comment-edit-${comment.id}`}
                                        type="text"
                                        value={
                                          commentEditDrafts[comment.id] ?? ''
                                        }
                                        onChange={(event) =>
                                          setCommentEditDrafts((current) => ({
                                            ...current,
                                            [comment.id]: event.target.value,
                                          }))
                                        }
                                        disabled={isCommentBusy}
                                        className="h-[40px] min-w-0 flex-1 rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-3 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 disabled:opacity-50 sm:text-[16px]"
                                      />

                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void saveCommentEdit(
                                              post.id,
                                              comment.id
                                            )
                                          }
                                          disabled={
                                            isCommentBusy ||
                                            !(
                                              commentEditDrafts[comment.id] ??
                                              ''
                                            ).trim()
                                          }
                                          className="h-[40px] rounded-[8px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-4 font-inter text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={cancelEditingComment}
                                          disabled={isCommentBusy}
                                          className="h-[40px] rounded-[8px] border border-[#7E6BB3] px-4 font-inter text-[14px] font-semibold text-[#2B2740] transition-colors hover:bg-[#F6F4FE] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="mt-1 font-inter text-[14px] leading-relaxed text-[#2B2740] sm:text-[16px]">
                                      {comment.text}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <form
                        onSubmit={(event) =>
                          submitComment(event, post.id)
                        }
                        className="flex flex-col gap-3 sm:flex-row"
                      >
                        <label
                          htmlFor={`comment-${post.id}`}
                          className="sr-only"
                        >
                          Write a comment
                        </label>

                        <input
                          id={`comment-${post.id}`}
                          type="text"
                          value={commentDrafts[post.id] ?? ''}
                          onChange={(event) =>
                            setCommentDrafts((current) => ({
                              ...current,
                              [post.id]: event.target.value,
                            }))
                          }
                          placeholder="Write a comment..."
                          className="h-[44px] min-w-0 flex-1 rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-4 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[16px]"
                        />

                        <button
                          type="submit"
                          disabled={
                            !(commentDrafts[post.id] ?? '').trim()
                          }
                          className="h-[44px] rounded-[8px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-6 font-inter text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[16px]"
                        >
                          Post
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </main>

      <Footer />

      {/* Safety Review */}
      {isSafetyReviewOpen && (
        <div
          className="fixed inset-0 z-[115] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSafetyReviewModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="safety-review-title"
            className="my-auto w-full max-w-[780px] rounded-[18px] border border-[#EDE7FB] bg-[#FAF9FE] p-5 shadow-[0_20px_60px_rgba(43,39,64,0.3)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="safety-review-title"
                  className="font-poppins text-[22px] font-semibold text-[#2B2740] sm:text-[28px]"
                >
                  Leave a Safety Review
                </h2>

                <p className="mt-1 max-w-[650px] font-inter text-[14px] leading-relaxed text-black/60 sm:text-[15px]">
                  Tell us how the platform affected your safety decisions and
                  preparation, and how that information compared with your
                  actual adventure experience.
                </p>
              </div>

              <button
                type="button"
                onClick={closeSafetyReviewModal}
                disabled={isSubmittingSafetyReview}
                aria-label="Close safety review"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#2B2740] transition-colors hover:bg-[#EDE7FB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX
                  className="h-6 w-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>
            </div>

            <form onSubmit={submitSafetyReview} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_240px_240px]">
                <div>
                  <label
                    htmlFor="safety-review-operator"
                    className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                  >
                    Operator
                  </label>
                  <input
                    id="safety-review-operator"
                    type="text"
                    required
                    value={safetyReviewOperator}
                    onChange={(event) =>
                      setSafetyReviewOperator(event.target.value)
                    }
                    placeholder="Operator name"
                    className="h-[46px] w-full rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-3 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="safety-review-country"
                    className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                  >
                    Country
                  </label>

                  <FilterDropdown
                    id="safety-review-country"
                    label="Country"
                    options={COUNTRIES.filter(
                      (country) => country !== 'All Locations'
                    )}
                    value={safetyReviewCountry || 'Select country'}
                    isOpen={safetyReviewDropdown === 'location'}
                    onToggle={() => {
                      setOpenDropdown(null);
                      setComposerDropdown(null);
                      setSafetyReviewDropdown((current) =>
                        current === 'location' ? null : 'location'
                      );
                    }}
                    onChange={(country) => {
                      setSafetyReviewCountry(country);
                      setSafetyReviewDropdown(null);
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="safety-review-activity"
                    className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                  >
                    Activity
                  </label>

                  <FilterDropdown
                    id="safety-review-activity"
                    label="Activity"
                    options={ACTIVITIES.filter(
                      (activity) => activity !== 'All Activities'
                    )}
                    value={safetyReviewActivity || 'Select activity'}
                    isOpen={safetyReviewDropdown === 'activity'}
                    onToggle={() => {
                      setOpenDropdown(null);
                      setComposerDropdown(null);
                      setSafetyReviewDropdown((current) =>
                        current === 'activity' ? null : 'activity'
                      );
                    }}
                    onChange={(activity) => {
                      setSafetyReviewActivity(activity);
                      setSafetyReviewDropdown(null);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-5">
                {SAFETY_REVIEW_QUESTIONS.map(({ key, question }, index) => {
                  const selectedScore = safetyReviewAnswers[key];
                  const selectedScoreLabel =
                    SAFETY_REVIEW_SCORES.find(
                      ({ value }) => value === selectedScore
                    )?.label ?? 'Select a rating';

                  return (
                    <fieldset
                      key={key}
                      className="rounded-[10px] border border-[#7E6BB3]/25 bg-[#F6F4FE] p-4"
                    >
                      <legend className="sr-only">
                        {index + 1}. {question}
                      </legend>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <p className="min-w-0 flex-1 font-inter text-[14px] font-semibold leading-relaxed text-[#2B2740] sm:text-[15px]">
                          {index + 1}. {question}
                        </p>

                        <div className="flex flex-shrink-0 flex-col items-start gap-1 sm:items-end">
                          <div
                            className="flex items-center gap-1"
                            role="radiogroup"
                            aria-label={`Rating for question ${index + 1}`}
                          >
                            {SAFETY_REVIEW_SCORES.map(({ value, label }) => {
                              const isSelected =
                                selectedScore !== null &&
                                value <= selectedScore;

                              return (
                                <button
                                  key={value}
                                  type="button"
                                  role="radio"
                                  aria-checked={selectedScore === value}
                                  aria-label={`${value} star${
                                    value === 1 ? '' : 's'
                                  }: ${label}`}
                                  title={`${value} star${
                                    value === 1 ? '' : 's'
                                  } — ${label}`}
                                  onClick={() =>
                                    setSafetyReviewAnswers((current) => ({
                                      ...current,
                                      [key]: value,
                                    }))
                                  }
                                  className="rounded-[5px] p-0.5 text-[#7E6BB3] transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E6BB3]/35"
                                >
                                  <FiStar
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    fill={isSelected ? 'currentColor' : 'none'}
                                    strokeWidth={1.7}
                                    aria-hidden="true"
                                  />
                                </button>
                              );
                            })}
                          </div>

                          <span className="font-inter text-[12px] text-black/50">
                            {selectedScore
                              ? `${selectedScore}/5 · ${selectedScoreLabel}`
                              : selectedScoreLabel}
                          </span>
                        </div>
                      </div>
                    </fieldset>
                  );
                })}
              </div>

              <div>
                <label
                  htmlFor="safety-review-experience"
                  className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                >
                  What happened during the actual adventure that confirmed,
                  contradicted, or added to the safety information you used?
                </label>

                <textarea
                  id="safety-review-experience"
                  rows={4}
                  required
                  minLength={20}
                  maxLength={1500}
                  value={safetyReviewExperience}
                  onChange={(event) =>
                    setSafetyReviewExperience(event.target.value)
                  }
                  placeholder="Describe the safety briefing, equipment, staff behaviour, emergency readiness, conditions, or anything else you actually observed."
                  className="w-full resize-y rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-4 py-3 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[16px]"
                />
                <p className="mt-1 font-inter text-[12px] text-black/45">
                  Minimum 20 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="safety-review-improvement"
                  className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                >
                  What safety information or feature would have helped you more?{' '}
                  <span className="font-normal text-black/45">(optional)</span>
                </label>

                <textarea
                  id="safety-review-improvement"
                  rows={3}
                  maxLength={1200}
                  value={safetyReviewImprovement}
                  onChange={(event) =>
                    setSafetyReviewImprovement(event.target.value)
                  }
                  placeholder="Tell us what would make the platform more useful for safer adventure decisions."
                  className="w-full resize-y rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-4 py-3 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[16px]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#7E6BB3]/20 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeSafetyReviewModal}
                  disabled={isSubmittingSafetyReview}
                  className="h-[48px] rounded-[8px] border border-[#2B2740] bg-[#F6F4FE] px-6 font-inter text-[15px] font-semibold text-[#2B2740] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmitSafetyReview}
                  className="h-[48px] rounded-[8px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-7 font-inter text-[15px] font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingSafetyReview
                    ? 'Submitting...'
                    : 'Submit Safety Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share your Adventure Composer */}
      {isPostComposerOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePostComposer();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-community-post-title"
            className="my-auto w-full max-w-[720px] rounded-[18px] border border-[#EDE7FB] bg-[#FAF9FE] p-5 shadow-[0_20px_60px_rgba(43,39,64,0.3)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-community-post-title"
                  className="font-poppins text-[22px] font-semibold text-[#2B2740] sm:text-[28px]"
                >
                  {editingPostId
                    ? 'Update your Post'
                    : 'Share your Adventure'}
                </h2>

                <p className="mt-1 font-inter text-[14px] text-black/60 sm:text-[15px]">
                  {editingPostId
                    ? 'Update your community post.'
                    : 'Share an experience or alert the community about a safety concern.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closePostComposer}
                aria-label="Close post composer"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#2B2740] transition-colors hover:bg-[#EDE7FB]"
              >
                <FiX
                  className="h-6 w-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>
            </div>

            <form
              onSubmit={submitAdventurePost}
              className="mt-6 space-y-5"
            >
              {/* Post Type */}
              <fieldset>
                <legend className="mb-3 font-inter text-[14px] font-semibold text-[#2B2740] sm:text-[16px]">
                  Post type
                </legend>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDraftCategory('Trip Experience')
                    }
                    className={`flex min-h-[52px] items-center gap-3 rounded-[9px] border px-4 font-inter text-[15px] font-semibold transition-colors ${
                      draftCategory === 'Trip Experience'
                        ? 'border-[#7E6BB3] bg-[#EDE7FB] text-[#7E6BB3]'
                        : 'border-[#CFC7E4] bg-[#FAF9FE] text-[#2B2740] hover:border-[#7E6BB3]'
                    }`}
                  >
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                        draftCategory === 'Trip Experience'
                          ? 'border-[#7E6BB3]'
                          : 'border-black/40'
                      }`}
                    >
                      {draftCategory === 'Trip Experience' && (
                        <span className="h-[9px] w-[9px] rounded-full bg-[#7E6BB3]" />
                      )}
                    </span>

                    Trip Experience
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDraftCategory('Safety Warning')
                    }
                    className={`flex min-h-[52px] items-center gap-3 rounded-[9px] border px-4 font-inter text-[15px] font-semibold transition-colors ${
                      draftCategory === 'Safety Warning'
                        ? 'border-[#C51D14] bg-[#FFF1E8] text-[#C51D14]'
                        : 'border-[#CFC7E4] bg-[#FAF9FE] text-[#2B2740] hover:border-[#C51D14]'
                    }`}
                  >
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                        draftCategory === 'Safety Warning'
                          ? 'border-[#C51D14]'
                          : 'border-black/40'
                      }`}
                    >
                      {draftCategory === 'Safety Warning' && (
                        <span className="h-[9px] w-[9px] rounded-full bg-[#C51D14]" />
                      )}
                    </span>

                    Safety Warning
                  </button>
                </div>
              </fieldset>

              {/* Country and Activity */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="new-post-country-filter"
                    className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                  >
                    Country
                  </label>

                  <FilterDropdown
                    id="new-post-country-filter"
                    label="Country"
                    options={COUNTRIES.filter(
                      (country) => country !== 'All Locations'
                    )}
                    value={draftCountry || 'Select country'}
                    isOpen={composerDropdown === 'location'}
                    onToggle={() => {
                      setOpenDropdown(null);
                      setComposerDropdown((current) =>
                        current === 'location' ? null : 'location'
                      );
                    }}
                    onChange={(country) => {
                      setDraftCountry(country);
                      setComposerDropdown(null);
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-post-activity-filter"
                    className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                  >
                    Activity
                  </label>

                  <FilterDropdown
                    id="new-post-activity-filter"
                    label="Activity"
                    options={ACTIVITIES.filter(
                      (activity) => activity !== 'All Activities'
                    )}
                    value={draftActivity || 'Select activity'}
                    isOpen={composerDropdown === 'activity'}
                    onToggle={() => {
                      setOpenDropdown(null);
                      setComposerDropdown((current) =>
                        current === 'activity' ? null : 'activity'
                      );
                    }}
                    onChange={(activity) => {
                      setDraftActivity(activity);
                      setComposerDropdown(null);
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="new-post-title"
                  className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                >
                  Post title
                </label>

                <input
                  id="new-post-title"
                  type="text"
                  value={draftTitle}
                  onChange={(event) =>
                    setDraftTitle(event.target.value)
                  }
                  placeholder={
                    draftCategory === 'Safety Warning'
                      ? 'What should travelers know?'
                      : 'Give your adventure a title'
                  }
                  maxLength={120}
                  required
                  className="h-[50px] w-full rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-4 font-inter text-[15px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[16px]"
                />
              </div>

              {/* Body */}
              <div>
                <label
                  htmlFor="new-post-body"
                  className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                >
                  Description
                </label>

                <textarea
                  id="new-post-body"
                  value={draftBody}
                  onChange={(event) =>
                    setDraftBody(event.target.value)
                  }
                  placeholder={
                    draftCategory === 'Safety Warning'
                      ? 'Describe the warning, conditions, affected area, and anything travelers should avoid...'
                      : 'Tell the community about your experience...'
                  }
                  rows={5}
                  required
                  className="w-full resize-none rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-4 py-3 font-inter text-[15px] leading-relaxed text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[16px]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <span className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]">
                  Images{' '}
                  <span className="font-normal text-black/45">
                    (optional, up to {MAX_POST_IMAGES})
                  </span>
                </span>

                {draftImages.length > 0 && (
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    {draftImages.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="relative overflow-hidden rounded-[10px] border border-[#7E6BB3]/30"
                      >
                        <div className="relative h-[180px] w-full sm:h-[220px]">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 bg-[#EDE7FB] px-4 py-2">
                          <span className="min-w-0 truncate font-inter text-[12px] text-[#2B2740]">
                            {image.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => removePostImage(index)}
                            className="flex flex-shrink-0 items-center gap-1 font-inter text-[12px] font-semibold text-[#7E6BB3] hover:underline"
                          >
                            <FiX
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <label
                  htmlFor="new-post-image"
                  className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-[#7E6BB3] bg-[#F6F4FE] px-5 text-center transition-colors hover:bg-[#EDE7FB]"
                >
                  <FiImage
                    className="h-8 w-8 text-[#7E6BB3]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <span className="mt-2 font-inter text-[14px] font-semibold text-[#7E6BB3]">
                    Add images
                  </span>

                  <span className="mt-1 font-inter text-[12px] text-black/50">
                    Choose up to {MAX_POST_IMAGES} images from your device
                  </span>
                </label>

                <input
                  id="new-post-image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePostImageChange}
                  className="sr-only"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#7E6BB3]/20 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePostComposer}
                  className="h-[48px] rounded-[8px] border border-[#2B2740] bg-[#F6F4FE] px-6 font-inter text-[15px] font-semibold text-[#2B2740] transition-colors hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmitPost}
                  className="h-[48px] rounded-[8px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-7 font-inter text-[15px] font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingPost
                    ? 'Posting...'
                    : editingPostId
                      ? 'Update Post'
                      : 'Post to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportTarget && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReportModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-content-title"
            className="w-full max-w-[560px] rounded-[18px] border border-[#EDE7FB] bg-[#FAF9FE] p-5 shadow-[0_20px_60px_rgba(43,39,64,0.3)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id="report-content-title"
                  className="font-poppins text-[22px] font-semibold text-[#2B2740] sm:text-[26px]"
                >
                  Report this {reportTarget.commentId ? 'comment' : 'post'}
                </h2>

                <p className="mt-1 font-inter text-[14px] text-black/60 sm:text-[15px]">
                  Tell us what is wrong and our moderators will take a look.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReportModal}
                aria-label="Close report form"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#2B2740] transition-colors hover:bg-[#EDE7FB]"
              >
                <FiX
                  className="h-6 w-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>
            </div>

            <form
              onSubmit={submitReport}
              className="mt-6 flex flex-col gap-5"
            >
              <div className="rounded-[10px] border border-[#7E6BB3]/30 bg-[#EDE7FB] px-4 py-3">
                <p className="font-inter text-[12px] font-semibold uppercase tracking-wide text-black/50">
                  Reported content
                </p>

                <p className="mt-1 line-clamp-3 font-inter text-[14px] leading-relaxed text-[#2B2740]">
                  {reportTarget.label}
                </p>
              </div>

              <fieldset>
                <legend className="mb-2 font-inter text-[14px] font-semibold text-[#2B2740]">
                  Reason
                </legend>

                <div className="flex flex-col gap-2">
                  {COMMUNITY_REPORT_REASONS.map((reason) => (
                    <label
                      key={reason.value}
                      className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#7E6BB3]/30 bg-[#F6F4FE] px-4 py-3 font-inter text-[14px] text-[#2B2740] transition-colors hover:bg-[#EDE7FB]"
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={reason.value}
                        checked={reportReason === reason.value}
                        onChange={() => setReportReason(reason.value)}
                        className="h-4 w-4 flex-shrink-0 accent-[#7E6BB3]"
                      />

                      <span>{reason.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="report-details"
                  className="mb-2 block font-inter text-[14px] font-semibold text-[#2B2740]"
                >
                  Anything else?{' '}
                  <span className="font-normal text-black/45">(optional)</span>
                </label>

                <textarea
                  id="report-details"
                  rows={3}
                  value={reportDetails}
                  maxLength={MAX_REPORT_DETAILS_LENGTH}
                  onChange={(event) => setReportDetails(event.target.value)}
                  placeholder="Add any detail that would help us review this."
                  className="w-full resize-y rounded-[8px] border border-[#7E6BB3] bg-[#FAF9FE] px-4 py-3 font-inter text-[14px] text-[#2B2740] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[#7E6BB3]/20 sm:text-[16px]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#7E6BB3]/20 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeReportModal}
                  disabled={isSubmittingReport}
                  className="h-[48px] rounded-[8px] border border-[#2B2740] bg-[#F6F4FE] px-6 font-inter text-[15px] font-semibold text-[#2B2740] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!reportReason || isSubmittingReport}
                  className="h-[48px] rounded-[8px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-7 font-inter text-[15px] font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingReport ? 'Sending...' : 'Send report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Popup */}
      {shareTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSharePostId(null);
              setLinkCopied(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-post-title"
            className="w-full max-w-[560px] rounded-[18px] border border-[#EDE7FB] bg-[#FAF9FE] p-5 shadow-[0_20px_60px_rgba(43,39,64,0.3)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="share-post-title"
                  className="font-poppins text-[22px] font-semibold text-[#2B2740] sm:text-[26px]"
                >
                  Share this post
                </h2>

                <p className="mt-1 font-inter text-[14px] text-black/60 sm:text-[15px]">
                  Choose where you would like to share it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSharePostId(null);
                  setLinkCopied(false);
                }}
                aria-label="Close share popup"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#2B2740] transition-colors hover:bg-[#EDE7FB]"
              >
                <FiX
                  className="h-6 w-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <button
                type="button"
                onClick={() =>
                  openExternalShare(shareTarget, 'whatsapp')
                }
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[#25D366] px-3 text-white transition-transform hover:-translate-y-0.5"
              >
                <FaWhatsapp
                  className="h-8 w-8"
                  aria-hidden="true"
                />

                <span className="font-inter text-[13px] font-semibold">
                  WhatsApp
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  openExternalShare(shareTarget, 'x')
                }
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[12px] bg-black px-3 text-white transition-transform hover:-translate-y-0.5"
              >
                <FaXTwitter
                  className="h-7 w-7"
                  aria-hidden="true"
                />

                <span className="font-inter text-[13px] font-semibold">
                  X
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  openExternalShare(shareTarget, 'facebook')
                }
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[#1877F2] px-3 text-white transition-transform hover:-translate-y-0.5"
              >
                <FaFacebookF
                  className="h-7 w-7"
                  aria-hidden="true"
                />

                <span className="font-inter text-[13px] font-semibold">
                  Facebook
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  shareToInstagram(shareTarget)
                }
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,_#833AB4_0%,_#FD1D1D_55%,_#FCAF45_100%)] px-3 text-white transition-transform hover:-translate-y-0.5"
              >
                <FaInstagram
                  className="h-8 w-8"
                  aria-hidden="true"
                />

                <span className="font-inter text-[13px] font-semibold">
                  Instagram
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  copyPostLink(shareTarget)
                }
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(90deg,_#7E6BB3_25%,_#2B2740_100%)] px-3 text-white transition-transform hover:-translate-y-0.5"
              >
                {linkCopied ? (
                  <FiCheck
                    className="h-8 w-8"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <FiLink
                    className="h-8 w-8"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                )}

                <span className="font-inter text-[13px] font-semibold">
                  {linkCopied ? 'Copied!' : 'Copy link'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}