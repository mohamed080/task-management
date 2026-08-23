import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Textarea({ className = '', label, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <textarea
        className={`min-h-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${className}`}
        {...props}
      />
    </label>
  )
}
