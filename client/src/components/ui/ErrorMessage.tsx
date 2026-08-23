interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null
  }

  return (
    <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
      {message}
    </p>
  )
}
