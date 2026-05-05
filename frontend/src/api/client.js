function getApiUrl() {
  return 'https://sharufa-production.up.railway.app';
}

const API_URL = getApiUrl();

let memeQueue = [];
let usedIds = new Set();

export async function getTodayMeme(userId) {
  try {
    const response = await fetch(`${API_URL}/meme/today?userId=${encodeURIComponent(userId || 'anon')}`);
    if (response.ok) {
      const data = await response.json();
      if (data?.id && data?.image) {
        // Не показываем мем, если он уже был в этой сессии
        if (usedIds.has(data.id)) {
          // Если этот мем уже был — пробуем ещё раз
          return getTodayMeme(userId);
        }
        usedIds.add(data.id);
        return data;
      }
    }
  } catch (error) {
    console.log('Ошибка API:', error);
  }
  
  // Если API не ответил — пробуем ещё раз через секунду
  return new Promise(resolve => {
    setTimeout(async () => {
      try {
        const retryResponse = await fetch(`${API_URL}/meme/today?userId=${encodeURIComponent(userId || 'anon')}`);
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          if (data?.id && data?.image && !usedIds.has(data.id)) {
            usedIds.add(data.id);
            resolve(data);
            return;
          }
        }
      } catch (e) {}
      
      // Совсем ничего нет — показываем заглушку
      resolve({
        id: 'empty',
        title: 'Мемов пока нет',
        caption: 'Отправь фото или видео боту @Shar_Ufy_bot',
        image: '',
        tags: ['#пусто']
      });
    }, 1000);
  });
}

export async function submitMeme(fileId, caption, userId) {
  return { status: 'ok' };
}

export async function reactToMeme(memeId, reaction, userId) {
  return { status: 'ok' };
}

export async function getEvents(date) {
  return {
    events: [
      { id: 1, emoji: '🎸', title: 'Рок в подвале', time: '21:00', place: 'За рынком', price: 'Бесплатно', buzz: 12 },
      { id: 2, emoji: '🎭', title: 'Импро на лавочке', time: '19:00', place: 'Парк Фонтанов', price: '200₽', buzz: 24 },
      { id: 3, emoji: '🍜', title: 'Ночной лапшичный поп-up', time: '23:30', place: 'Ул. Ленина', price: '150₽', buzz: 8 }
    ]
  };
}