import { useState } from 'react'
import MemeFeed from './pages/MemeFeed'
import Kipish from './pages/Kipish'
import EmptyState from './components/EmptyState'
import useTelegram from './hooks/useTelegram'

const routes = [
  { id: 'feed', label: 'Лента' },
  { id: 'kipish', label: 'Кипиш' },
  { id: 'empty', label: 'Пустой стейт' }
]

function App() {
  const [route, setRoute] = useState('feed')
  const { user, isReady } = useTelegram()

  return (
    <div className="min-h-screen bg-cream text-ink px-4 py-4 sm:px-6">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-[30px] border border-ink/20 bg-white/60 p-4 shadow-paper backdrop-blur-xl">
        <div className="absolute inset-0 pointer-events-none bg-noise opacity-10"></div>

        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-violet">Шар Уфы</p>
            <h1 className="mt-2 text-3xl font-black leading-snug">{route === 'feed' ? 'Сегодня' : route === 'kipish' ? 'Кипиш' : 'Пустой шар'}</h1>
          </div>
          <div className="space-y-2 text-right">
            <button className="rounded-2xl border border-ink px-3 py-2 text-xs font-semibold uppercase text-ink">{user?.username || user?.first_name || 'Анон'}</button>
            <button className="rounded-2xl bg-lime px-3 py-2 text-xs font-semibold uppercase text-ink">WebApp</button>
          </div>
        </header>

        <nav className="mb-5 flex flex-wrap gap-2">
          {routes.map((item) => (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`chip ${route === item.id ? 'bg-ink text-cream' : 'bg-white/80 text-ink'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {route === 'feed' && <MemeFeed onOpenKipish={() => setRoute('kipish')} />}
        {route === 'kipish' && <Kipish />}
        {route === 'empty' && <EmptyState title="Пустой шар" description="Сегодня в Шаре пусто." />}

        {!isReady && <p className="mt-4 text-sm text-ink/70">Инициализируем Telegram WebApp...</p>}
      </div>
    </div>
  )
}

export default App
