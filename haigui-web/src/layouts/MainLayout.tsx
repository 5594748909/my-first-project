import { Link, NavLink, Outlet } from 'react-router-dom'
import { useGlobalLoading } from '../hooks/useGlobalLoading'
import { GlobalErrorToast } from '../components/GlobalErrorToast'

const navBaseClass =
  'rounded-md px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700 active:scale-[0.98]'

export function MainLayout() {
  const { isGlobalLoading } = useGlobalLoading()

  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3 sm:px-4">
          <Link to="/" className="text-lg font-semibold text-teal-300">
            海龟汤
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <NavLink to="/" end className={navBaseClass}>
              首页
            </NavLink>
            <NavLink to="/" className={navBaseClass}>
              游戏大厅
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
        <div className="relative h-1 overflow-hidden">
          {isGlobalLoading ? (
            <span className="absolute inset-y-0 left-0 w-1/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-teal-400" />
          ) : null}
        </div>
      </div>

      <GlobalErrorToast />

      <main className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
