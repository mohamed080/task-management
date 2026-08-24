import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthLayout({
  children,
  eyebrow,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="auth-page min-h-screen overflow-hidden px-5 py-6 text-slate-950 sm:px-8 lg:px-12">
      <div className="auth-grid mx-auto grid min-h-[calc(100svh-3rem)] max-w-7xl overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="auth-visual relative hidden overflow-hidden bg-[#17231d] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="relative z-10 flex items-center gap-3 text-sm font-black uppercase tracking-[0.22em]">
            <span className="grid size-9 place-items-center rounded-xl bg-lime-300 text-sm text-[#17231d]">
              TM
            </span>
            Task Management
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-lime-300">
              A calmer way to work
            </p>
            <h2 className="max-w-md text-5xl font-black leading-[0.98] tracking-[-0.04em] xl:text-6xl">
              Make space for the work that matters.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/65">
              Keep projects moving with one clear place for the details,
              decisions, and next steps.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-white/55">
            <span className="size-2 rounded-full bg-lime-300 shadow-[0_0_0_5px_rgba(190,242,100,0.12)]" />
            Your workspace, in focus.
          </div>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-md"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em]">
                <span className="grid size-9 place-items-center rounded-xl bg-[#17231d] text-xs text-lime-300">
                  TM
                </span>
                Task Management
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              {description}
            </p>
            <div className="mt-9">{children}</div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
