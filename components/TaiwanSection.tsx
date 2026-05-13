'use client'

export default function TaiwanSection({ data, lang }: { data: any[], lang: 'en' | 'zh' }) {
  return (
    <section className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="h-6 w-1.5 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
        <h2 className="text-2xl font-black tracking-tight text-zinc-100 italic uppercase">Taiwan Local</h2>
      </div>
      <div className="grid grid-cols-1 gap-y-12">
        {data.map((item) => {
          const title = lang === 'zh' ? (item.title_zh || item.title) : (item.title_en || item.title)
          const summary = lang === 'zh' ? (item.summary_zh || item.summary) : (item.summary_en || item.summary)
          return (
            <article key={item.id} className="group space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">{item.source || 'LOCAL'}</span>
                <span className="text-[10px] text-zinc-700 font-mono">{item.published_at ? new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 leading-tight group-hover:text-orange-400 transition-colors duration-300">
                <a href={item.article_url || '#'} target="_blank" rel="noreferrer" className="block">{title}</a>
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-2 font-light leading-relaxed">{summary}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}