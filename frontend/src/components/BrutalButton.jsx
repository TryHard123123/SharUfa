export default function BrutalButton({ children, className = '', ...props }) {
  return (
    <button
      className={`rounded-[24px] bg-lime px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-ink shadow-paper transition-transform duration-150 ease-out ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
