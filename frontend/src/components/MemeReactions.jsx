export default function MemeReactions({ onReact }) {
  const buttons = [
    { label: '🔥 Угар', value: 'fire' },
    { label: '💩 Шляпа', value: 'trash' },
    { label: '❤️ В самое сердце', value: 'heart' }
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {buttons.map((button) => (
        <button
          key={button.value}
          onClick={() => onReact?.(button.value)}
          className="rounded-[22px] border border-ink/15 bg-white px-3 py-4 text-center text-sm font-bold shadow-paper transition-transform duration-150 ease-out hover:scale-[1.02]"
        >
          {button.label}
        </button>
      ))}
    </div>
  )
}
