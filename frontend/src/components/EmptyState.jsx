export default function EmptyState({ title, description }) {
  return (
    <section className="space-y-5 text-center">
      <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-[36px] border-[1.5px] border-ink/20 bg-white/85 shadow-paper">
        <div className="pixel-art grid h-24 w-24 grid-cols-6 gap-0.5">
          {Array.from({ length: 36 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-3 w-3 ${[2,3,4,8,9,10,14,15,16,17,18,20,21,22,23,26,27,28,29].includes(idx) ? 'bg-ink' : 'bg-cream'}`}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-violet">{title}</p>
        <h2 className="mt-2 text-3xl font-black">{description}</h2>
      </div>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime text-4xl shadow-paper">⬇️</div>
    </section>
  )
}
