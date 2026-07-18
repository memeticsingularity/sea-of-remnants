import { NavLink, useLocation } from 'react-router-dom'
import { BookOpen, Anchor, Users, Ship, Sparkles, Music, Shield, Package, Map, Scroll, HelpCircle, Activity, Ticket } from 'lucide-react'

interface NavItem {
  label: string
  to?: string
  icon?: React.ReactNode
  children?: NavItem[]
}

const navGroups: NavItem[] = [
  {
    label: '培养',
    icon: <Sparkles className="h-4 w-4" />,
    children: [
      { label: '船员培养', to: '/crews' },
      { label: '船只培养', to: '/ships' },
      { label: '全域培养', to: '/guides/crew-training' },
    ],
  },
  { label: '船员', to: '/crews', icon: <Users className="h-4 w-4" /> },
  { label: '船只', to: '/ships', icon: <Ship className="h-4 w-4" /> },
  { label: '职业', to: '/classes', icon: <Anchor className="h-4 w-4" /> },
  { label: '技能', to: '/skills', icon: <Sparkles className="h-4 w-4" /> },
  { label: '船歌', to: '/songs', icon: <Music className="h-4 w-4" /> },
  { label: '行装', to: '/equipment', icon: <Shield className="h-4 w-4" /> },
  { label: '物品', to: '/items', icon: <Package className="h-4 w-4" /> },
  { label: '任务', to: '/quests', icon: <Scroll className="h-4 w-4" /> },
  { label: '地点', to: '/locations', icon: <Map className="h-4 w-4" /> },
  { label: '症状', to: '/symptoms', icon: <Activity className="h-4 w-4" /> },
  { label: '招募模拟器', to: '/recruitment', icon: <Ticket className="h-4 w-4" /> },
  { label: '指南', to: '/guides/crew-training', icon: <BookOpen className="h-4 w-4" /> },
  { label: '术语表', to: '/glossary', icon: <HelpCircle className="h-4 w-4" /> },
]

function NavItemComponent({ item }: { item: NavItem }) {
  const location = useLocation()

  if (item.children) {
    const isActive = item.children.some((c) =>
      location.pathname.startsWith(c.to || ''),
    )
    return (
      <div className="mb-2">
        <div
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${
            isActive ? 'text-accent' : 'text-text-muted'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
        <div className="ml-4 border-l border-border pl-2">
          {item.children.map((child) => (
            <NavLink
              key={child.label}
              to={child.to || '#'}
              className={({ isActive }) =>
                `block rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-surface-light text-accent'
                    : 'text-text-muted hover:bg-surface-light hover:text-text'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    )
  }

  return (
    <NavLink
      to={item.to || '#'}
      className={({ isActive }) =>
        `mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-surface-light text-accent'
            : 'text-text-muted hover:bg-surface-light hover:text-text'
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  )
}

export function SidebarNav() {
  return (
    <aside className="flex w-56 flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-4">
        <NavLink to="/" className="text-lg font-bold text-text">
          遗忘之海 Wiki
        </NavLink>
        <p className="text-xs text-text-dim">Sea of Remnants</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {navGroups.map((item) => (
          <NavItemComponent key={item.label} item={item} />
        ))}
      </nav>
      <div className="border-t border-border p-3 text-xs text-text-dim">
        按 / 聚焦搜索
      </div>
    </aside>
  )
}
