import clsx from 'clsx'

export function Block(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        'font-mono border-2 border-sky-200 p-1 rounded-xl h-fit',
        props.className,
      )}>
      {props.children}
    </div>
  )
}
