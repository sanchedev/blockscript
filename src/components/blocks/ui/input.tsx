export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      onDragStart={(ev) => ev.stopPropagation()}
      onDragEnd={(ev) => ev.stopPropagation()}
      {...props}
    />
  )
}
