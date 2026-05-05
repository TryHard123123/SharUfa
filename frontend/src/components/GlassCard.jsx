export default function GlassCard({ className = '', children, ...props }) {
  return (
    <div
      className={`glass-card rounded-[28px] border border-ink/20 bg-white/70 backdrop-blur-xl shadow-paper ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
