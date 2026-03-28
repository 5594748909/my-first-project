import { GameCard } from '../components/GameCard'
import { stories } from '../constants'

export function HomePage() {
  return (
    <section className="space-y-5 sm:space-y-8">
      <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/40 p-4 shadow-[0_0_32px_rgba(76,29,149,0.25)] sm:p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-violet-300/80">Game Lobby</p>
        <h1 className="text-[1.8rem] font-bold tracking-tight text-slate-100 md:text-4xl">AI海龟汤</h1>
        <p className="mt-2 max-w-3xl leading-7 text-slate-300 sm:mt-3">
          欢迎来到推理大厅。每个故事只给你一句汤面，你需要通过提问拼出隐藏在黑暗中的真相。
          从入门到地狱难度，选择你的第一碗汤，开始这场神秘而烧脑的还原之旅。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <GameCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  )
}
