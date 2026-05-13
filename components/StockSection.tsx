'use client'

export default function StockSection({ data, lang }: { data: any[], lang: 'en' | 'zh' }) {
  const getSStyle = (s: string) => {
    if (s?.toLowerCase() === 'positive') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (s?.toLowerCase() === 'negative') return 'text-red-400 border-red-500/30 bg-red-500/10'
    return 'text-zinc-500 border-zinc-800 bg-zinc-900/50'
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="h-6 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <h2 className="text-2xl font-black tracking-tight text-zinc-100 italic uppercase">Stock Market</h2>
      </div>
      <div className="grid grid-cols-1 gap-y-12">
        {data.map((item) => {
          const title = lang === 'zh' ? (item.title_zh || item.title) : (item.title_en || item.title)
          const summary = lang === 'zh' ? (item.summary_zh || item.summary) : (item.summary_en || item.summary)
          return (
            <article key={item.id} className="group space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">{item.source || 'MARKET'}</span>
                  {item.sentiment && <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getSStyle(item.sentiment)}`}>{item.sentiment}</span>}
                </div>
                <span className="text-[10px] text-zinc-700 font-mono">{item.published_at ? new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 leading-tight group-hover:text-emerald-400 transition-colors duration-300">
                <a href={item.article_url || '#'} target="_blank" rel="noreferrer" className="block">{title}</a>
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-2 font-light leading-relaxed">{summary}</p>
              {item.affected_market && <p className="text-[10px] text-zinc-500 border-l border-zinc-800 pl-2 italic">Market: {item.affected_market}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}