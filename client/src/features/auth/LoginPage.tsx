import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md place-items-center">
        <div className="w-full rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Task Management</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Sign in</h1>
          <Link className="mt-6 inline-flex font-bold text-indigo-700" to="/register">
            Create an account
          </Link>
        </div>
      </section>
    </main>
  )
}
