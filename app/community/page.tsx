'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiUsers,
  FiFileText,
  FiShield,
  FiSearch,
  FiChevronDown,
  FiArrowUpCircle,
  FiLifeBuoy,
  FiMessageSquare,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiMoreHorizontal,
} from 'react-icons/fi';
import ResultsNavbar from '@/components/ResultsNavbar';
import Footer from '@/components/Footer';

type PostCategory = 'Trip Experience' | 'Safety Warning';
type OpenDropdown = 'activity' | 'location' | null;

type MockPost = {
  id: string;
  author: string;
  avatar: string;
  location: string;
  country: string;
  activity: string;
  category: PostCategory;
  timestamp: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  image?: { src: string; alt: string };
};

type FilterDropdownProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

const MOCK_POSTS: MockPost[] = [
  {
    id: 'meru',
    author: 'Amara Okafor',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    location: 'Tanzania · Hiking',
    country: 'Tanzania',
    activity: 'Hiking',
    category: 'Trip Experience',
    timestamp: '2h ago',
    title: 'Hiking Mount Meru - An Unforgettable Experience',
    body:
      'The trails were amazing and the local guides were knowledgeable and friendly. Weather changed quickly, so be prepared!',
    likes: 126,
    comments: 32,
    image: {
      src:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=500&fit=crop',
      alt: 'A hiker looking up at a mountain ridge',
    },
  },
  {
    id: 'ghorepani',
    author: 'Ravi Shrestha',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    location: 'Nepal · Trekking',
    country: 'Nepal',
    activity: 'Trekking',
    category: 'Safety Warning',
    timestamp: '5h ago',
    title: 'Landslide reported near Ghorepani trail',
    body:
      'Avoid the lower trail section due to recent landslides and heavy rainfall. Local authorities are monitoring the situation.',
    likes: 126,
    comments: 32,
  },
];

const STATS = [
  { label: 'Total Members', value: '500+', Icon: FiUsers },
  { label: 'Total Posts', value: '1,200+', Icon: FiFileText },
  { label: 'Active Warnings', value: '24', Icon: FiShield },
];

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
  'flex h-[54px] w-full items-center justify-center gap-4 rounded-[9px] bg-[#7E6BB3] px-6 text-[18px] font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 sm:h-[54px] sm:text-[20px]';

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
  return (
    <div
      className="relative w-full lg:w-[240px] lg:flex-shrink-0"
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
        onClick={onToggle}
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
          {options.map((option) => {
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
                {/* Radio indicator */}
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
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('All Activities');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest('[data-community-dropdown="true"]')
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
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
    const query = searchTerm.trim().toLowerCase();

    return MOCK_POSTS.filter((post) => {
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

      return matchesSearch && matchesActivity && matchesLocation;
    });
  }, [searchTerm, selectedActivity, selectedLocation]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedActivity !== 'All Activities' ||
    selectedLocation !== 'All Locations';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedActivity('All Activities');
    setSelectedLocation('All Locations');
    setOpenDropdown(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <ResultsNavbar />

      <main className="mx-auto w-full max-w-[1316px] flex-grow px-5 pb-8 pt-12 sm:px-8 lg:px-0 lg:pt-14">
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
          {STATS.map(({ label, value, Icon }) => (
            <div
              key={label}
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

                <span className="mt-1 font-inter text-[32px] font-bold leading-none text-white lg:text-[36px]">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Search Section */}
        <div className="relative z-30 mt-10 flex min-h-[106px] w-full items-center rounded-[10px] border-[1.5px] border-[#7E6BB3] bg-transparent px-5 py-5 lg:mt-[30px] lg:h-[106px] lg:px-[55px]">
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            {/* Search */}
            <div className="relative w-full lg:w-[580px] lg:flex-shrink-0">
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

            {/* Activity Filter */}
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

            {/* Location Filter */}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-5 lg:flex-row lg:gap-6">
          <Link
            href="/community"
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
          </Link>

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
        <div className="mt-5 flex justify-center">
          <Link
            href="/community"
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
          </Link>
        </div>

        {/* Sample Data Notice */}
        <p className="mt-8 text-center font-inter text-[14px] text-black/50">
          Showing sample posts. Signing in, posting, and likes are not
          connected yet.
        </p>

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

        {/* Traveler Posts Section */}
        <div className="mt-7 w-full space-y-5">
          {visiblePosts.length === 0 ? (
            <div className="rounded-[10px] border border-[#7E6BB3] bg-[#F6F4FE] p-10 text-center shadow-[0_3px_5px_rgba(0,0,0,0.25)]">
              <FiSearch
                className="mx-auto h-8 w-8 text-black/50"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <p className="mt-4 font-inter text-[18px] font-semibold text-[#2B2740]">
                No posts match the selected filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 font-inter text-[16px] font-semibold text-[#7E6BB3] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            visiblePosts.map((post) => (
              <article
                key={post.id}
                className="w-full rounded-[10px] border border-[#7E6BB3] bg-[#F6F4FE] p-4 shadow-[0_3px_5px_rgba(0,0,0,0.25)] sm:p-6 lg:p-[24px]"
              >
                {/* Post Header */}
                <div className="flex min-h-[80px] flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    {/* Profile Circle */}
                    <div className="relative h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-full bg-[#C7B5F5]/75 sm:h-[64px] sm:w-[64px] lg:h-[80px] lg:w-[80px]">
                      <Image
                        src={post.avatar}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-inter text-[21px] font-semibold leading-tight text-[#2B2740] sm:text-[27px] lg:text-[32px]">
                        {post.author}
                      </h2>

                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <span className="truncate font-inter text-[14px] font-normal leading-tight text-black sm:text-[18px] lg:text-[24px]">
                          {post.country}
                        </span>

                        <span
                          className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-black sm:h-[6px] sm:w-[6px] lg:h-2 lg:w-2"
                          aria-hidden="true"
                        />

                        <span className="truncate font-inter text-[14px] font-normal leading-tight text-black sm:text-[18px] lg:text-[24px]">
                          {post.activity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:flex-wrap sm:justify-start sm:gap-4 lg:justify-end lg:gap-6">
                    <span
                      className={`flex h-[32px] min-w-0 items-center justify-center whitespace-nowrap rounded-[7px] px-3 text-center font-inter text-[13px] font-medium leading-none sm:h-[38px] sm:min-w-[175px] sm:px-4 sm:text-[18px] lg:h-[50px] lg:w-[220px] lg:text-[24px] ${
                        CATEGORY_STYLES[post.category]
                      }`}
                    >
                      {post.category}
                    </span>

                    <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4 lg:gap-6">
                      <span className="font-poppins text-[13px] font-medium leading-none text-black/50 sm:text-[18px] lg:text-[24px]">
                        {post.timestamp}
                      </span>

                      <FiMoreHorizontal
                        className="h-[20px] w-[20px] flex-shrink-0 text-black/50 sm:h-[22px] sm:w-[22px] lg:h-[24px] lg:w-[24px]"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {post.image && (
                  <div className="relative mt-4 h-[190px] w-full overflow-hidden rounded-[10px] sm:mt-5 sm:h-[220px] lg:mt-2 lg:h-[260px]">
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      fill
                      sizes="(max-width: 1316px) 100vw, 1256px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Post Text */}
                <div className="mt-4 space-y-1">
                  <h3 className="font-inter text-[18px] font-semibold leading-[1.3] text-black sm:text-[21px] lg:text-[26px]">
                    {post.title}
                  </h3>

                  <p className="max-w-[900px] font-inter text-[15px] font-normal leading-[1.45] text-black sm:text-[18px] lg:text-[24px]">
                    {post.body}
                  </p>

                  <button
                    type="button"
                    className="block pt-1 font-inter text-[16px] font-semibold leading-none text-[#7E6BB3] hover:underline sm:text-[19px] lg:text-[24px]"
                  >
                    Read more
                  </button>
                </div>

                {/* Interaction Divider */}
                <div className="mt-4 border-t border-black/50 pt-4 lg:mt-5">
                  <div className="grid grid-cols-3 items-center font-inter text-[16px] font-medium text-black/90 sm:text-[18px] lg:text-[24px]">
                    {/* Like */}
                    <span
                      className="flex items-center justify-start gap-2 sm:gap-3"
                      aria-label={`Like ${post.likes}`}
                    >
                      <FiHeart
                        className="h-[22px] w-[22px] flex-shrink-0 text-black/75 sm:h-[24px] sm:w-[24px] lg:h-[30px] lg:w-[30px]"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />

                      <span className="hidden sm:inline">Like</span>

                      <span className="font-inter text-[15px] font-medium text-black/75 sm:text-[18px] lg:text-[24px]">
                        {post.likes}
                      </span>
                    </span>

                    {/* Comment */}
                    <span
                      className="flex items-center justify-center gap-2 sm:gap-3"
                      aria-label={`Comment ${post.comments}`}
                    >
                      <FiMessageCircle
                        className="h-[22px] w-[22px] flex-shrink-0 text-black/75 sm:h-[24px] sm:w-[24px] lg:h-[30px] lg:w-[30px]"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />

                      <span className="hidden sm:inline">Comment</span>

                      <span className="font-inter text-[15px] font-medium text-black/75 sm:text-[18px] lg:text-[24px]">
                        {post.comments}
                      </span>
                    </span>

                    {/* Share */}
                    <span
                      className="flex items-center justify-end gap-2 sm:gap-3"
                      aria-label="Share"
                    >
                      <FiShare2
                        className="h-[22px] w-[22px] flex-shrink-0 text-black/75 sm:h-[24px] sm:w-[24px] lg:h-[30px] lg:w-[30px]"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />

                      <span className="hidden sm:inline">Share</span>
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}