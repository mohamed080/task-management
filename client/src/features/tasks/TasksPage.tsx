import { motion } from 'framer-motion'

import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../auth/auth.store'

export function TasksPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <main className="min-h-screen bg-[#f4f7f2] px-4 py-6 text-slate-950 sm:px-8">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.25 }}
      >
        <header className="flex flex-col gap-4 rounded-3xl border border-white bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Your workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Welcome, {user?.name}</h1>
          </div>
          <Button className="bg-[#17231d] text-white hover:bg-emerald-950" onClick={logout}>
            Logout
          </Button>
        </header>
      </motion.section>
    </main>
  )
}
