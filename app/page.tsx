import Link from 'next/link';
import { ArrowRight, BarChart3, CalendarClock, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return <main className="min-h-screen bg-[#05070b] overflow-hidden">
    <nav className="mx-auto max-w-7xl px-6 py-6 flex justify-between items-center">
      <div className="flex items-center gap-2 font-bold text-xl"><Sparkles className="text-fuchsia-400" /> GrowPilot AI</div>
      <div className="flex gap-3"><Link href="/login" className="px-4 py-2 text-sm text-slate-300">Sign in</Link><Link href="/signup" className="primary">Start free</Link></div>
    </nav>
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-xs text-fuchsia-200"><Zap size={14} /> AI-powered Instagram growth workspace</div>
      <h1 className="mx-auto mt-8 max-w-5xl text-5xl md:text-7xl font-bold tracking-tight">Create smarter content.<br /><span className="text-gradient">Grow with a system.</span></h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">Plan your content, generate original posts with AI, schedule approved content, and learn from performance — all from one premium workspace.</p>
      <div className="mt-9 flex justify-center gap-3"><Link href="/signup" className="primary px-6 py-3">Build my workspace <ArrowRight size={17} /></Link><Link href="/login" className="secondary px-6 py-3">View dashboard</Link></div>
      <div className="mt-16 mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[.03] p-3 shadow-2xl shadow-fuchsia-950/20"><div className="rounded-2xl border border-white/10 bg-[#080c13] p-5 text-left"><div className="grid grid-cols-3 gap-3"><div className="h-24 rounded-xl bg-white/[.03]" /><div className="h-24 rounded-xl bg-white/[.03]" /><div className="h-24 rounded-xl bg-white/[.03]" /></div><div className="mt-3 h-56 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10" /></div></div>
    </section>
    <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-5">{[[Sparkles, 'AI Content Studio', 'Turn a topic into a structured post with hooks, captions and CTAs.'], [CalendarClock, 'Content Calendar', 'Keep drafts, approvals and schedules in one visual workspace.'], [BarChart3, 'Performance Intelligence', 'Use available analytics to guide your next content strategy.']].map(([Icon, title, text]: any) => <div key={title} className="card p-6"><Icon size={22} className="text-fuchsia-400" /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</section>
    <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-600"><ShieldCheck size={14} className="inline mr-1" /> Official API integrations only. GrowPilot never needs your Instagram password.</footer>
  </main>;
}
