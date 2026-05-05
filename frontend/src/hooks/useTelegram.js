import { useEffect, useState } from 'react'

export default function useTelegram() {
  const [tgData, setTgData] = useState({ user: null, isReady: false })

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) {
      setTgData({ user: null, isReady: true })
      return
    }

    tg.ready()
    tg.expand()
    setTgData({ user: tg.initDataUnsafe?.user || null, isReady: true })
  }, [])

  return tgData
}
