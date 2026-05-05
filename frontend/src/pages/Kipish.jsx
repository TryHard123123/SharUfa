import { useEffect, useState } from 'react'
import DaySelector from '../components/DaySelector'
import EventCard from '../components/EventCard'
import { getEvents } from '../api/client'
import useTelegram from '../hooks/useTelegram'

const availableDays = ['Пн 4.05', 'Вт 5.05', 'Ср 6.05', 'Чт 7.05']

export default function Kipish() {
  const { user, isReady } = useTelegram()
  const [selectedDay, setSelectedDay] = useState(1)
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('Загрузка…')

  useEffect(() => {
    if (!isReady) return
    const date = availableDays[selectedDay]
    getEvents(date).then((result) => {
      setEvents(result?.events || [])
      setStatus(result?.events?.length ? '' : 'Местный кипиш не найден.')
    }).catch(() => setStatus('Не удалось загрузить афишу.'))
  }, [isReady, selectedDay, user])

  const handleJoin = (id) => {
    setStatus(`Ты шлифанул событие ${id}.`) 
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Где сегодня шум?</p>
        <h2 className="mt-2 text-2xl font-black">Ну и куда мы сегодня идем?</h2>
      </div>

      <DaySelector days={availableDays} selectedDay={selectedDay} onChange={setSelectedDay} />

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onJoin={handleJoin} />
        ))}
      </div>
      {status && <p className="text-xs text-ink/70">{status}</p>}
    </section>
  )
}
