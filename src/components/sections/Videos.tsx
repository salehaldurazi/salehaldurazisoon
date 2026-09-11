"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { Youtube, Share2, VideoOff } from "lucide-react";

import { FadeInSection } from "../FadeInSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-js";

// ─────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────
interface VideoRow {
  id: string | number;
  title?: string | null;
  description?: string | null;
  youtube_url?: string | null;
  cover_url?: string | null;
  circular_cover_url?: string | null;
  category?: string | null;
  sub_category?: string | null;
  display_order?: number | null;
  created_at?: string | null;
}

const VIDEO_CATEGORIES = [
  { value: "featured", label: "مختارات" },
  { value: "popular", label: "الأكثر مشاهدة" },
  { value: "new", label: "الجديد" },
] as const;

type CategoryKey = (typeof VIDEO_CATEGORIES)[number]["value"];

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|[?&]v=)([^#&?]{11})/);
  return match ? match[1] : null;
}

function formatArabicDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleDateString("ar-BH", { year: "numeric", month: "short" });
}

// ─────────────────────────────────────────────────────────────
// RESILIENT FALLBACK DATA
// ─────────────────────────────────────────────────────────────
const FALLBACK_VIDEOS: VideoRow[] = [
  {
    id: "v-fallback-1",
    title: "يا جرح علي - الرادود صالح الدرازي",
    description: "مشاركة عاشوراء الحزينة للرادود صالح الدرازي في عزاء ليلة العاشر",
    youtube_url: "https://www.youtube.com/watch?v=R9K48E1D9Xg",
    category: "new",
    sub_category: "عزاء السنابس",
    display_order: 1,
    created_at: "2024-07-16T18:00:00Z",
  },
  {
    id: "v-fallback-2",
    title: "الحسين ضامناً - الإصدار الرسمي",
    description: "قصيدة الحسين ضامناً بصوت الرادود صالح الدرازي",
    youtube_url: "https://www.youtube.com/watch?v=Oj-9bKmlVgY",
    category: "new",
    sub_category: "إصدارات استوديو",
    display_order: 2,
    created_at: "2024-07-15T18:00:00Z",
  },
  {
    id: "v-fallback-3",
    title: "أبا تراب - التراث الخالد",
    description: "من أجمل وأروع كلاسيكيات التراث الحسيني للرادود صالح الدرازي",
    youtube_url: "https://www.youtube.com/watch?v=Oj-9bKmlVgY",
    category: "featured",
    sub_category: "مختارات تراثية",
    display_order: 1,
    created_at: "2023-01-10T12:00:00Z",
  },
  {
    id: "v-fallback-4",
    title: "موشحات وأدعية خاشعة بصوت الدرازي",
    description: "أدعية ومناجاه خاشعة بصوت الرادود صالح الدرازي",
    youtube_url: "https://www.youtube.com/watch?v=Oj-9bKmlVgY",
    category: "popular",
    sub_category: "أدعية ومناجاة",
    display_order: 1,
    created_at: "2023-05-12T20:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export function Videos() {
  const [activeCategory, setActiveCategory] = useState<string>("new");
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);

  const scrollToTitle = useCallback(() => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // Smoothly scroll directly to the 'المرئيات' section title on category tab switch
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToTitle();
  }, [activeCategory, scrollToTitle]);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from("videos")
        .select("*");

      if (dbError) {
        console.warn("[Videos] Database fetch error. Using fallback videos:", dbError);
        setVideos(FALLBACK_VIDEOS);
      } else if (!data || data.length === 0) {
        console.info("[Videos] Database empty. Using fallback videos.");
        setVideos(FALLBACK_VIDEOS);
      } else {
        setVideos(data as VideoRow[]);
      }
    } catch (err: any) {
      console.warn("[Videos] Fetch exception caught. Using fallback videos:", err);
      setVideos(FALLBACK_VIDEOS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Group and sort videos by category in a single unified memoization
  const groupedVideos = useMemo<Record<CategoryKey, VideoRow[]>>(() => {
    const grouped: Record<CategoryKey, VideoRow[]> = {
      featured: [],
      popular: [],
      new: [],
    };

    for (const vid of videos) {
      const cat = vid.category as CategoryKey;
      if (grouped[cat]) {
        grouped[cat].push(vid);
      }
    }

    const sortByDisplayOrder = (a: VideoRow, b: VideoRow) =>
      (a.display_order ?? 0) - (b.display_order ?? 0);

    grouped.featured.sort(sortByDisplayOrder);
    grouped.popular.sort(sortByDisplayOrder);
    grouped.new.sort(sortByDisplayOrder);

    return grouped;
  }, [videos]);

  const handleShare = useCallback((title?: string | null, url?: string | null) => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    toast({
      title: "تم نسخ الرابط",
      description: `تم نسخ رابط "${title ?? "الفيديو"}" بنجاح.`,
    });
  }, []);

  return (
    <section
      id="videos"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
      dir="rtl"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container max-w-6xl px-6 mx-auto relative z-10">
        {/* Pinpointed Section Title Target */}
        <div ref={titleRef} className="scroll-mt-20 md:scroll-mt-24">
          <FadeInSection className="text-center mb-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-light text-primary">المرئيات</h2>
            <p className="text-primary uppercase text-xs">قسم خاص للمرئيات</p>
          </FadeInSection>
        </div>

        <div className="max-w-4xl mx-auto w-full mt-12">
          {loading ? (
            <LoadingSpinner size={36} strokeWidth={0.8} />
          ) : error ? (
            <div className="text-center py-10 text-destructive bg-destructive/5 rounded-2xl border border-destructive/10 p-6">
              <p className="text-sm font-bold">حدث خطأ أثناء جلب البيانات</p>
              <p className="text-xs mt-2 opacity-70">{error}</p>
            </div>
          ) : (
            <Tabs
              defaultValue="new"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              {/* Category Filter Tabs (Exact match with Audio Library dimensions) */}
              <div className="max-w-3xl mx-auto w-full mb-8">
                <TabsList className="w-full bg-muted/50 dark:bg-black/40 backdrop-blur-2xl p-1.5 rounded-full border border-primary/10 h-auto inline-flex items-center gap-1.5 overflow-hidden">
                  {VIDEO_CATEGORIES.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="flex-1 rounded-full py-2.5 text-[11px] md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-foreground/5 whitespace-nowrap"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab Contents */}
              {VIDEO_CATEGORIES.map(({ value }) => {
                const categoryVideos = groupedVideos[value] ?? [];

                return (
                  <TabsContent
                    key={value}
                    value={value}
                    className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
                  >
                    {categoryVideos.length === 0 ? (
                      <EmptyState
                        icon={VideoOff}
                        title="لا توجد مرئيات متوفرة"
                        description="لا توجد مقاطع فيديو مضافة في هذا القسم حالياً."
                      />
                    ) : (
                      /* Auto-Centering Responsive Flex Container: Perfectly centers 1, 2, or 3+ cards */
                      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 max-w-4xl mx-auto w-full" dir="rtl">
                        {categoryVideos.map((vid, idx) => {
                          const videoId = extractYouTubeId(vid.youtube_url);
                          const watchUrl =
                            vid.youtube_url ?? (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#");
                          
                          // Custom circular cover or YouTube maxresdefault / hqdefault fallback
                          const customCover = vid.circular_cover_url || vid.cover_url;
                          const thumbnailUrl = customCover
                            ? customCover
                            : videoId
                            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                            : null;
                          const formattedDate = formatArabicDate(vid.created_at);

                          return (
                            <FadeInSection key={vid.id} delay={idx * 100} className="shrink-0 flex justify-center">
                              {/* 100% Seamless Circular Card: Scaled up, zero outer border or drop shadow */}
                              <div className="w-[155px] sm:w-[185px] md:w-[225px] lg:w-[245px] aspect-square shrink-0 rounded-full overflow-hidden relative group transition-transform duration-500 hover:scale-[1.02] mx-auto">
                                {/* Cover Image Filling Full Circle */}
                                {thumbnailUrl ? (
                                  <Image
                                    src={thumbnailUrl}
                                    alt={vid.title ?? ""}
                                    fill
                                    unoptimized={!!customCover}
                                    sizes="(max-width: 640px) 155px, (max-width: 768px) 185px, (max-width: 1024px) 225px, 245px"
                                    referrerPolicy="no-referrer"
                                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.92] group-hover:brightness-100"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-xs">
                                    رابط يوتيوب غير صالح
                                  </div>
                                )}

                                {/* Bottom Gradient Overlay (Adaptive Light & Dark Modes) */}
                                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-black dark:via-black/90 dark:to-transparent flex flex-col justify-end items-center pb-3.5 sm:pb-4 md:pb-5 pt-3 sm:pt-4 px-2.5 sm:px-3.5 md:px-4 text-center z-10">
                                  {/* 1. Category Badge: Soft semi-transparent frosted style */}
                                  {vid.sub_category && (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm border border-primary/30 text-primary text-[8px] sm:text-[9px] font-semibold mb-1 tracking-wide shadow-sm">
                                      {vid.sub_category}
                                    </span>
                                  )}

                                  {/* 2. Video Title */}
                                  <h3
                                    className="text-[11px] sm:text-xs md:text-sm font-bold text-foreground truncate max-w-[85%] leading-tight group-hover:text-primary transition-colors duration-300"
                                    title={vid.title ?? ""}
                                  >
                                    {vid.title ?? "بدون عنوان"}
                                  </h3>

                                  {/* 3. Year / Metadata */}
                                  {(formattedDate || vid.description) && (
                                    <p className="text-[8.5px] sm:text-[9px] md:text-[10px] text-muted-foreground font-light mt-0.5 truncate max-w-[85%]">
                                      {formattedDate || vid.description}
                                    </p>
                                  )}

                                  {/* 4. Action Buttons (YouTube & Share Only) */}
                                  <div
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* YouTube Button */}
                                    <a
                                      href={watchUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 backdrop-blur-md hover:bg-primary/20 dark:hover:bg-primary/30 flex items-center justify-center transition-all cursor-pointer text-primary group/btn"
                                      title="مشاهدة على يوتيوب"
                                      aria-label="مشاهدة على يوتيوب"
                                    >
                                      <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary group-hover/btn:scale-110 transition-transform" />
                                    </a>

                                    {/* Share Button */}
                                    <button
                                      onClick={() => handleShare(vid.title, watchUrl)}
                                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 backdrop-blur-md hover:bg-primary/20 dark:hover:bg-primary/30 flex items-center justify-center transition-all cursor-pointer text-primary group/btn"
                                      title="مشاركة الفيديو"
                                      aria-label="مشاركة الفيديو"
                                    >
                                      <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </FadeInSection>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </div>
    </section>
  );
}
