import { Outlet } from 'react-router-dom'
import { ClientSidebar } from './ClientSidebar'

export function ClientLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto p-6 pt-16 md:p-8 md:pt-8">
        <Outlet />
      </main>
    </div>
  )
}
