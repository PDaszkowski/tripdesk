import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col px-5 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
        <Outlet />
      </main>
    </div>
  )
}
