import { NavLink } from 'react-router-dom'
import {
  Layers, LayoutDashboard, FolderOpen, Wand2, Zap, ShieldCheck, Settings
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/studio',      icon: Wand2,            label: 'Studio' },
  { to: '/packages',    icon: FolderOpen,       label: 'Packages' },
  { to: '/impact',      icon: Zap,              label: 'Impact Analysis' },
  { to: '/governance',  icon: ShieldCheck,      label: 'Governance' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-slate-950 border-r border-slate-800 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center flex-shrink-0">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">ArchSmith</div>
          <div className="text-xs text-slate-500 leading-tight">Architecture Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-xs font-medium text-slate-600 px-2 mb-2 uppercase tracking-widest">Platform</div>
        <ul className="space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-brand-900/60 text-brand-300 font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) => clsx(
            'flex items-center gap-2 text-xs transition-colors px-3 py-2 rounded-lg w-full',
            isActive ? 'bg-slate-800 text-brand-300' : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/40'
          )}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </NavLink>
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-500 px-3 py-1.5 transition-colors"
        >
          <Layers className="w-3 h-3" />
          ← Back to Landing
        </NavLink>
      </div>
    </aside>
  )
}
