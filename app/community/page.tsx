'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaUsers,
  FaFileAlt,
  FaShieldAlt,
  FaSearch,
  FaChevronDown,
  FaUpload,
  FaQuestionCircle,
  FaCommentDots,
  FaHeart,
  FaComment,
  FaShareAlt,
  FaEllipsisH,
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PostCategory = 'Trip Experience' | 'Safety Warning';

type MockPost = {
  id: string;
  author: string;
  avatar: string;
  location: string;
  category: PostCategory;
  timestamp: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  image?: { src: string; alt: string };
};

const MOCK_POSTS: MockPost[] = [
  {
    id: 'meru',
    author: 'Amara Okafor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    location: 'Tanzania · Hiking',
    category: 'Trip Experience',
    timestamp: '2h ago',
    title: 'Hiking Mount Meru — An Unforgettable Experience',
    body: 'The trails were amazing and the local guides were knowledgeable and friendly. Weather changed quickly, so be prepared!',
    likes: 126,
    comments: 32,
    image: {
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
      alt: 'A hiker looking up at a mountain ridge',
    },
  },
  {
    id: 'ghorepani',
    author: 'Ravi Shrestha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    location: 'Nepal · Trekking',
    category: 'Safety Warning',
    timestamp: '5h ago',
    title: 'Landslide reported near Ghorepani trail',
    body: 'Avoid the lower trail section due to recent landslides and heavy rainfall. Local authorities are monitoring the situation.',
    likes: 126,
    comments: 32,
  },
];

const STATS = [
  { label: 'Total Members', value: '500+', Icon: FaUsers },
  { label: 'Total Posts', value: '1,200+', Icon: FaFileAlt },
  { label: 'Active Warnings', value: '24', Icon: FaShieldAlt },
];

const CATEGORY_STYLES: Record<PostCategory, string> = {
  'Trip Experience': 'bg-[#EDE7FB] text-[#7E6BB3]',
  'Safety Warning': 'bg-[#FDE8E8] text-[#C51D14]',
};

const inputClass =
  'w-full rounded-xl border border-[#EDE7FB] bg-[#F6F4FE] py-2 pl-9 pr-4 text-xs text-[#2B2740] placeholder:text-[#9A95A8] outline-none transition-all focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#7E6BB3]/20';

const filterClass =
  'flex w-full items-center justify-between rounded-xl border border-[#EDE7FB] bg-[#F6F4FE] px-3 py-2 text-xs font-medium text-[#6E6B80]';

const primaryButtonClass =
  'flex w-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7E6BB3] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90';

const secondaryButtonClass =
  'flex w-full items-center justify-center gap-2 rounded-xl border border-[#7E6BB3] px-4 py-2 text-xs font-semibold text-[#7E6BB3] transition-colors hover:bg-[#F6F4FE]';

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const visiblePosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return MOCK_POSTS;

    return MOCK_POSTS.filter((post) =>
      [post.title, post.body, post.author, post.location, post.category]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-grow px-4 py-8 sm:px-6">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="font-poppins text-3xl font-extrabold text-[#2B2740] md:text-4xl">
              Community Hub
            </h1>
            <p className="font-inter text-sm font-medium text-[#6E6B80]">
              Your safe space for connecting, learning, and travelling bolder.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#7E6BB3] p-4 text-white shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </div>
                <span className="font-poppins text-2xl font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4 rounded-2xl border border-[#EDE7FB] bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <FaSearch
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#9A95A8]"
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

            <div className={filterClass} aria-disabled="true">
              <span>All Activities</span>
              <FaChevronDown className="h-4 w-4 text-[#9A95A8]" aria-hidden="true" />
            </div>

            <div className={filterClass} aria-disabled="true">
              <span>All Locations</span>
              <FaChevronDown className="h-4 w-4 text-[#9A95A8]" aria-hidden="true" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/community" className={primaryButtonClass}>
              <FaUpload className="h-4 w-4" aria-hidden="true" />
              <span>Share your Adventure</span>
            </Link>
            <Link href="/safety-help" className={primaryButtonClass}>
              <FaQuestionCircle className="h-4 w-4" aria-hidden="true" />
              <span>Ask for Safety Help</span>
            </Link>
          </div>

          <div className="flex justify-center">
            <Link href="/community" className={`${secondaryButtonClass} sm:w-1/2`}>
              <FaCommentDots className="h-4 w-4" aria-hidden="true" />
              <span>Leave Safety Review</span>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center font-inter text-xs text-[#6E6B80]">
          Showing sample posts. Signing in, posting, and likes are not connected yet.
        </p>

        <div className="mt-4 space-y-6">
          {visiblePosts.length === 0 ? (
            <div className="rounded-2xl border border-[#EDE7FB] bg-white p-10 text-center shadow-sm">
              <FaSearch className="mx-auto h-6 w-6 text-[#9A95A8]" aria-hidden="true" />
              <p className="mt-3 font-inter text-sm font-semibold text-[#2B2740]">
                No posts match &ldquo;{searchTerm.trim()}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-4 font-inter text-xs font-semibold text-[#7E6BB3] hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            visiblePosts.map((post) => (
              <article
                key={post.id}
                className="space-y-4 rounded-2xl border border-[#EDE7FB] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#EDE7FB]">
                      <Image
                        src={post.avatar}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-inter text-sm font-bold text-[#2B2740]">
                        {post.author}
                      </h2>
                      <p className="font-inter text-[11px] text-[#9A95A8]">{post.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${CATEGORY_STYLES[post.category]}`}
                    >
                      {post.category}
                    </span>
                    <span className="font-inter text-xs text-[#9A95A8]">{post.timestamp}</span>
                    <FaEllipsisH
                      className="h-4 w-4 text-[#9A95A8]"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {post.image && (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <h3 className="font-inter text-sm font-bold text-[#2B2740]">{post.title}</h3>
                  <p className="font-inter text-xs leading-relaxed text-[#4A4560]">{post.body}</p>
                  <button
                    type="button"
                    className="block pt-1 font-inter text-xs font-semibold text-[#7E6BB3] hover:underline"
                  >
                    Read more
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[#EDE7FB] pt-3 font-inter text-xs text-[#6E6B80]">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5">
                      <FaHeart className="h-4 w-4" aria-hidden="true" />
                      <span>Like</span>
                      <span className="font-semibold">{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaComment className="h-4 w-4" aria-hidden="true" />
                      <span>Comment</span>
                      <span className="font-semibold">{post.comments}</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <FaShareAlt className="h-4 w-4" aria-hidden="true" />
                    <span>Share</span>
                  </span>
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
