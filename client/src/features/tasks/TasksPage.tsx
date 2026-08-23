import { motion } from 'framer-motion'

import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../auth/auth.store'

export function TasksPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.25 }}
      >
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Dashboard</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Welcome, {user?.name}</h1>
          </div>
          <Button onClick={logout} variant="secondary">
            Logout
          </Button>
        </header>
      </motion.section>
    </main>
  )
}
