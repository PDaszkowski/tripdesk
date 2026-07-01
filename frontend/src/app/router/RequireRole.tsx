import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/useAuth'
import type { RegisterRole } from '@/features/auth/types'

interface RequireRoleProps {
  role: RegisterRole | RegisterRole[]
}

export function RequireRole({ role }: RequireRoleProps) {
  const { user } = useAuth()
  const allowed = Array.isArray(role) ? role : [role]

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
