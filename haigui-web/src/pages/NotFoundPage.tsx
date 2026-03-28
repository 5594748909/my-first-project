import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-100">页面不存在</h1>
      <p className="text-slate-300">你访问的页面未找到，请返回首页继续探索。</p>
      <Link to="/" className="inline-flex rounded-md bg-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-600">
        返回首页
      </Link>
    </section>
  )
}
