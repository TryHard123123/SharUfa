export default function DaySelector({ days, selectedDay, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {days.map((day, idx) => (
        <button
          key={day}
          onClick={() => onChange(idx)}
          className={`min-w-[90px] rounded-[24px] px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.1em] ${selectedDay === idx ? 'bg-ink text-cream' : 'bg-white/90 text-ink border border-ink/10'}`}
        >
          {day}
        </button>
      ))}
    </div>
  )
}
