export default function EventCard({ event, onJoin }) {
  return (
    <div className="glass-card flex gap-4 border-[1.5px] border-ink/20 p-4 shadow-paper">
      <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-ink text-3xl text-cream">
        {event.emoji}
      </div>
      <div className="flex-1">
        <p className="text-base font-black">{event.title}</p>
        <p className="mt-2 text-sm text-ink/75">{event.time} · {event.place}</p>
        <p className="mt-1 text-sm font-semibold text-violet">{event.price}</p>
      </div>
      <div className="flex flex-col items-end justify-between text-right text-xs text-ink/70">
        <span>Уже шлифанули</span>
        <button
          onClick={() => onJoin?.(event.id)}
          className="mt-2 rounded-full bg-lime px-3 py-2 font-black text-ink"
        >
          {event.buzz}
        </button>
      </div>
    </div>
  )
}
