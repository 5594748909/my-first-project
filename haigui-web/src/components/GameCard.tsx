import { Link } from 'react-router-dom'
import type { StoryDifficulty, TurtleStory } from '../constants'

interface GameCardProps {
  story: TurtleStory
}

const difficultyLabelMap: Record<StoryDifficulty, string> = {
  easy: '入门',
  medium: '中等',
  hard: '困难',
  expert: '地狱',
}

const difficultyClassMap: Record<StoryDifficulty, string> = {
  easy: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  medium: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
  hard: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  expert: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
}

export function GameCard({ story }: GameCardProps) {
  const difficultyLabel = difficultyLabelMap[story.difficulty]
  const difficultyClass = difficultyClassMap[story.difficulty]

  return (
    <Link
      to={`/game/${story.id}`}
      className="group block rounded-xl border border-slate-700/80 bg-slate-800/60 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-slate-800 hover:shadow-[0_0_24px_rgba(45,212,191,0.16)] active:scale-[0.99]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-100 transition-colors group-hover:text-teal-200">
          {story.title}
        </h3>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${difficultyClass}`}>
          {difficultyLabel}
        </span>
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-slate-300">{story.surface}</p>
    </Link>
  )
}
