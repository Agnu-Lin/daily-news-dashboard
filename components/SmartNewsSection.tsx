'use client'

import { useEffect, useRef, useState } from 'react'

type NewsItem = {
  id: string
  source: string | null
  published_at: string | null
  article_url: string | null
  title: string | null
  summary: string | null
  title_en: string | null
  title_zh: string | null
  summary_en: string | null
  summary_zh: string | null
  importance_score: number | null
  sentiment?: string | null
  affected_market?: string | null
  affected_market_zh?: string | null
  short_term_impact?: string | null
  short_term_impact_zh?: string | null
}

type SectionTheme = 'blue' | 'orange' | 'purple' | 'emerald'

type Props = {
  data: NewsItem[]
  lang: 'en' | 'zh'
  titleEn: string
  titleZh: string
  fallbackSource: string
  theme: SectionTheme
  isStock?: boolean
}

const themeMap = {
  blue: {
    bar: 'bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.55)]',
    hover: 'group-hover:text-blue-400',
    score: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
  },
  orange: {
    bar: 'bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.55)]',
    hover: 'group-hover:text-orange-400',
    score: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
  },
  purple: {
    bar: 'bg-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.55)]',
    hover: 'group-hover:text-purple-400',
    score: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
  },
  emerald: {
    bar: 'bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.55)]',
    hover: 'group-hover:text-emerald-400',
    score: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  },
}

function formatDateTime(value: string | null) {
  if (!value) return '--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hour}:${minute}`
}

export default function SmartNewsSection({
  data,
  lang,
  titleEn,
  titleZh,
  fallbackSource,
  theme,
  isStock = false,
}: Props) {
  const [showAll, setShowAll] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [overflowMap, setOverflowMap] = useState<Record<string, boolean>>({})

  const summaryRefs = useRef<Record<string, HTMLParagraphElement | null>>({})

  const visibleData = showAll ? data : data.slice(0, 6)
  const currentTheme = themeMap[theme]
  const sectionTitle = lang === 'zh' ? titleZh : titleEn
  const scoreLabel = lang === 'zh' ? 'AI 分數' : 'AI Score'

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const nextOverflowMap: Record<string, boolean> = {}

      visibleData.forEach((item) => {
        const element = summaryRefs.current[item.id]

        if (element) {
          nextOverflowMap[item.id] =
            element.scrollHeight > element.clientHeight + 1
        }
      })

      setOverflowMap(nextOverflowMap)
    })

    return () => cancelAnimationFrame(timer)
  }, [visibleData, lang, showAll])

  return (
    <section className="space-y-10">
      <div className="flex items-center space-x-4">
        <div className={`h-8 w-1.5 rounded-full ${currentTheme.bar}`} />
        <h2 className="text-3xl font-black tracking-tight text-zinc-100 italic">
          {sectionTitle}
        </h2>
      </div>

      {!data || data.length === 0 ? (
        <p className="text-zinc-600 italic text-base py-4">
          {lang === 'zh' ? '目前沒有可顯示的新聞。' : 'No stories found.'}
        </p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-zinc-800/50 border-t border-zinc-800/30">
            {visibleData.map((item) => {
              const displayTitle =
                lang === 'zh'
                  ? item.title_zh || item.title_en || item.title || '無標題'
                  : item.title_en || item.title_zh || item.title || 'Untitled'

              const displaySummary =
                lang === 'zh'
                  ? item.summary_zh ||
                    item.summary_en ||
                    item.summary ||
                    '尚無摘要內容'
                  : item.summary_en ||
                    item.summary_zh ||
                    item.summary ||
                    'No summary available.'

              const displayAffectedMarket =
                lang === 'zh'
                  ? item.affected_market_zh ||
                    item.affected_market ||
                    '未提供'
                  : item.affected_market ||
                    item.affected_market_zh ||
                    'Not available'

              const displayShortTermImpact =
                lang === 'zh'
                  ? item.short_term_impact_zh ||
                    item.short_term_impact ||
                    '未提供'
                  : item.short_term_impact ||
                    item.short_term_impact_zh ||
                    'Not available'

              const isExpanded = expandedId === item.id
              const summaryIsOverflowing = overflowMap[item.id]

              return (
                <article key={item.id} className="group py-10 first:pt-0">
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                          {item.source || fallbackSource}
                        </span>

                        {item.importance_score !== null &&
                          item.importance_score !== undefined && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${currentTheme.score}`}
                            >
                              {scoreLabel} {item.importance_score}
                            </span>
                          )}
                      </div>

                      <span className="text-xs text-zinc-600 font-mono whitespace-nowrap">
                        {formatDateTime(item.published_at)}
                      </span>
                    </div>

                    <h3
                      className={`text-2xl font-bold text-zinc-100 leading-snug transition-colors duration-300 decoration-2 underline-offset-4 group-hover:underline ${currentTheme.hover}`}
                    >
                      <a
                        href={item.article_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        {displayTitle}
                      </a>
                    </h3>

                    <p
                      ref={(element) => {
                        summaryRefs.current[item.id] = element
                      }}
                      className={`text-lg text-zinc-400 leading-relaxed font-normal ${
                        isExpanded ? '' : 'line-clamp-3'
                      }`}
                    >
                      {displaySummary}
                    </p>

                    {summaryIsOverflowing && (
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.id)
                        }
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {isExpanded
                          ? lang === 'zh'
                            ? '收合摘要'
                            : 'Show less'
                          : lang === 'zh'
                            ? '顯示完整摘要'
                            : 'Show full summary'}
                      </button>
                    )}

                    {isStock &&
                      (item.affected_market ||
                        item.affected_market_zh ||
                        item.short_term_impact ||
                        item.short_term_impact_zh) && (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-3">
                          <p className="text-base text-zinc-400 leading-relaxed">
                            <span className="text-zinc-500 font-semibold tracking-widest mr-3">
                              {lang === 'zh'
                                ? '影響市場'
                                : 'Affected Market'}
                            </span>
                            <span className="text-zinc-300">
                              {displayAffectedMarket}
                            </span>
                          </p>

                          <p className="text-base text-zinc-400 leading-relaxed">
                            <span className="text-zinc-500 font-semibold tracking-widest mr-3">
                              {lang === 'zh'
                                ? '短期影響'
                                : 'Short-term Impact'}
                            </span>
                            <span className="text-zinc-300">
                              {displayShortTermImpact}
                            </span>
                          </p>
                        </div>
                      )}
                  </div>
                </article>
              )
            })}
          </div>

          {data.length > 6 && (
            <div className="pt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="rounded-full border border-zinc-800 px-5 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
              >
                {showAll
                  ? lang === 'zh'
                    ? '收合'
                    : 'Show less'
                  : lang === 'zh'
                    ? `顯示更多（${data.length - 6}）`
                    : `Show more (${data.length - 6})`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}