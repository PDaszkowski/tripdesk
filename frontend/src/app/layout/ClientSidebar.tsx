import { useState, type ComponentType } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlinePaperAirplane,
  HiOutlineMap,
  HiOutlineCloud,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
    HiOutlineTicket,
} from 'react-icons/hi2'
import type { IconBaseProps } from 'react-icons'
import { cn } from '@/shared/lib/cn'
import { useAuth } from '@/features/auth/context/useAuth'
import { useLogoutMutation } from '@/features/auth/api/logout'

type IconType = ComponentType<IconBaseProps>

interface NavItem {
  to: string
  icon: IconType
  label: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/dashboard', icon: HiOutlineHome, label: 'Panel główny' },
  { to: '/documents', icon: HiOutlineDocumentText, label: 'Dokumenty' },
  { to: '/trips', icon: HiOutlinePaperAirplane, label: 'Karta podróży' },
    { to: '/my-trips', icon: HiOutlineTicket, label: 'Moje Podróże' },
  { to: '/destinations', icon: HiOutlineMap, label: 'Destynacje' },
  { to: '/weather', icon: HiOutlineCloud, label: 'Pogoda' },
] as const

export function ClientSidebar() {
  const [isMobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-100 md:flex">
        <SidebarContent onNavigate={() => undefined} />
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Otwórz menu"
        className="fixed top-4 left-4 z-40 rounded-lg bg-slate-100 p-2 text-sky-500 shadow-md md:hidden"
      >
        <HiOutlineBars3 size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="flex h-full w-64 flex-col bg-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Zamknij menu"
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <HiOutlineXMark size={24} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}

interface SidebarContentProps {
  onNavigate: () => void
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const logoutMutation = useLogoutMutation()

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        onNavigate()
        navigate('/login')
      },
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900">Panel Klienta</h2>
        {user && (
          <p className="mt-1 text-sm text-slate-500">
            {user.firstName} {user.lastName}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                      isActive
                        ? 'bg-sky-100 text-sky-500'
                        : 'text-slate-500 hover:bg-slate-200',
                    )
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiOutlineArrowRightOnRectangle size={20} />
          <span>{logoutMutation.isPending ? 'Wylogowywanie…' : 'Wyloguj'}</span>
        </button>
      </div>
    </div>
  )
}
