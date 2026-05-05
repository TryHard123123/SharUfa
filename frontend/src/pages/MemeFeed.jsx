import { useState, useEffect, useCallback } from 'react'
import MemeCard from '../components/MemeCard'
import MemeReactions from '../components/MemeReactions'
import BrutalButton from '../components/BrutalButton'
import { getTodayMeme, reactToMeme } from '../api/client'
import useTelegram from '../hooks/useTelegram'

export default function MemeFeed({ onOpenKipish }) {
  const { user, isReady } = useTelegram()
  const [meme, setMeme] = useState(null)
  const [status, setStatus] = useState('Загрузка...')
  const [isLoading, setIsLoading] = useState(false)

  const loadMeme = useCallback(async () => {
    setIsLoading(true)
    setStatus('Грузим мем...')
    
    const result = await getTodayMeme(user?.id)
    
    if (result && result.id !== 'empty') {
      setMeme(result)
      setStatus('')
    } else {
      setMeme(result)
      setStatus('')
    }
    
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    loadMeme()
  }, [loadMeme])

  const handleReact = async (reaction) => {
    if (!meme || meme.id === 'empty') return
    await reactToMeme(meme.id, reaction, user?.id)
    setStatus(`Ты поставил ${reaction}!`)
    setTimeout(() => setStatus(''), 2000)
  }

  const handleThrowBall = () => {
    loadMeme()
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Шар Уфы</p>
        <h1 className="mt-2 text-3xl font-black">Сегодня</h1>
      </div>

      {meme ? (
        <>
          <MemeCard
            key={meme.id || Date.now()}
            meme={meme}
            onSwipeLeft={loadMeme}
            onSwipeRight={loadMeme}
          />
          
          {meme.tags && (
            <div className="flex flex-wrap gap-2">
              {meme.tags.map((tag) => (
                <span key={tag} className="chip bg-ink text-cream">{tag}</span>
              ))}
            </div>
          )}
          
          {meme.id !== 'empty' && <MemeReactions onReact={handleReact} />}
          
          <div className="glass-card border-[1.5px] border-ink/20 bg-white/75 px-4 py-5 shadow-paper">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet">А что дальше?</p>
            <p className="mt-2 text-sm text-ink/80">Держи заряд</p>
            <BrutalButton 
              className="mt-5 w-full" 
              onClick={handleThrowBall}
              disabled={isLoading}
            >
              {isLoading ? 'Грузим...' : 'Кинуть еще шар'}
            </BrutalButton>
            <button 
              onClick={onOpenKipish} 
              className="mt-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-violet"
            >
              Чё за кипиш сегодня?
            </button>
          </div>
          
          {status && (
            <p className="text-xs text-ink/70 text-center">{status}</p>
          )}
        </>
      ) : (
        <div className="glass-card border-[1.5px] border-ink/20 bg-white/75 px-5 py-8 text-center text-sm text-ink/80 shadow-paper">
          {isLoading ? 'Загружаем мем...' : status}
        </div>
      )}
    </section>
  )
}