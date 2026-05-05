import { motion } from 'framer-motion'

export default function MemeCard({ meme, onSwipeLeft, onSwipeRight }) {
  if (!meme) return null

  return (
    <motion.div
      key={meme.id || meme.label}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        if (info.offset.x > 80) onSwipeRight?.()
        if (info.offset.x < -80) onSwipeLeft?.()
      }}
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      className="glass-card relative mx-auto mb-4 h-[380px] max-w-[340px] overflow-hidden rounded-[28px] border-[1.5px] border-ink shadow-paper"
    >
      <img src={meme.image} alt={meme.title || meme.label} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 bg-ink px-4 py-4 text-sm text-white">
        <p className="font-semibold">{meme.title || meme.label}</p>
        <p className="mt-2 text-xs leading-5">{meme.caption}</p>
      </div>
    </motion.div>
  )
}
