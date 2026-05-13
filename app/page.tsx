'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import SmartNewsSection from '../components/SmartNewsSection'

export default function Home() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh')

  const [data, setData] = useState<{
    international: any[]
    taiwan: any[]
    ai: any[]
    stock: any[]
  }>({
    international: [],
    taiwan: [],
    ai: [],
    stock: [],
  })

  useEffect(() => {
    async function fetchData() {
      const now = new Date()

      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      )

      const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      )

      const todayStart = startOfToday.toISOString()
      const tomorrowStart = startOfTomorrow.toISOString()

      const [
        { data: intData },
        { data: twData },
        { data: aiData },
        { data: stockData },
      ] = await Promise.all([
        supabase
          .from('news_items')
          .select('*')
          .eq('category', 'international')
          .gt('importance_score', 60)
          .gte('published_at', todayStart)
          .lt('published_at', tomorrowStart)
          .not('title_zh', 'is', null)
          .not('summary_zh', 'is', null)
          .order('importance_score', { ascending: false })
          .limit(6),

        supabase
          .from('news_items')
          .select('*')
          .eq('category', 'taiwan')
          .gt('importance_score', 60)
          .gte('published_at', todayStart)
          .lt('published_at', tomorrowStart)
          .not('title_zh', 'is', null)
          .not('summary_zh', 'is', null)
          .order('importance_score', { ascending: false })
          .limit(6),

        supabase
          .from('news_items')
          .select('*')
          .eq('category', 'ai')
          .gte('importance_score', 60)
          .gte('published_at', todayStart)
          .lt('published_at', tomorrowStart)
          .not('title_zh', 'is', null)
          .not('summary_zh', 'is', null)
          .order('importance_score', { ascending: false })
          .limit(6),

        supabase
          .from('news_items')
          .select('*')
          .eq('category', 'stock')
          .gt('importance_score', 60)
          .gte('published_at', todayStart)
          .lt('published_at', tomorrowStart)
          .not('title_zh', 'is', null)
          .not('summary_zh', 'is', null)
          .not('affected_market_zh', 'is', null)
          .not('short_term_impact_zh', 'is', null)
          .order('importance_score', { ascending: false })
          .limit(6),
      ])

      setData({
        international: intData || [],
        taiwan: twData || [],
        ai: aiData || [],
        stock: stockData || [],
      })
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-blue-500/30 font-sans">
      <div className="fixed top-6 right-6 z-50">
        <div className="flex p-1 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md shadow-2xl overflow-hidden text-sm">
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              lang === 'en'
                ? 'bg-zinc-100 text-zinc-900 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            EN
          </button>

          <button
            onClick={() => setLang('zh')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              lang === 'zh'
                ? 'bg-zinc-100 text-zinc-900 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            中文
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        <header className="space-y-5 border-b border-zinc-800/50 pb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{lang === 'zh' ? '系統運行中' : 'System Operational'}</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent italic">
            {lang === 'zh' ? '每日情報儀表板' : 'Daily Intelligence'}
          </h1>

          <p className="text-zinc-400 text-xl max-w-3xl leading-relaxed">
            {lang === 'zh'
              ? '由 n8n 自動化驅動的全球情報彙整，結合 Supabase 資料庫與 AI 分析，提供跨語言新聞摘要、重要性評分與市場洞察。'
              : 'Automated news aggregation powered by n8n, structured in Supabase, and enhanced with AI-generated summaries, importance scores, and market insights.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
          <SmartNewsSection
            data={data.international}
            lang={lang}
            titleEn="International"
            titleZh="國際新聞"
            fallbackSource="GLOBAL"
            theme="blue"
          />

          <SmartNewsSection
            data={data.taiwan}
            lang={lang}
            titleEn="Taiwan Local"
            titleZh="台灣新聞"
            fallbackSource="LOCAL"
            theme="orange"
          />

          <SmartNewsSection
            data={data.stock}
            lang={lang}
            titleEn="Stock Market"
            titleZh="股票市場"
            fallbackSource="MARKET"
            theme="emerald"
            isStock
          />

          <SmartNewsSection
            data={data.ai}
            lang={lang}
            titleEn="AI & Future Tech"
            titleZh="AI 與未來科技"
            fallbackSource="TECH"
            theme="purple"
          />
        </div>
      </div>
    </main>
  )
}