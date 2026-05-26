import clsx from 'clsx'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 outline-0 focus-visible:ring-2 ring-slate-300',
        props.className,
      )}
    />
  )
}
