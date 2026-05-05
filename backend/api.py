from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from models import init_db, get_session, Meme, Reaction
import random
import httpx

BOT_TOKEN = os.getenv('BOT_TOKEN')
if not BOT_TOKEN:
    raise RuntimeError('BOT_TOKEN must be set in environment for API to resolve Telegram files')

init_db()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

class MemeReactionRequest(BaseModel):
    memeId: int
    reaction: str
    userId: str | None = None

class MemeSubmitRequest(BaseModel):
    fileId: str
    caption: str | None = None
    userId: str | None = None

class MegaEvent(BaseModel):
    id: int
    emoji: str
    title: str
    time: str
    place: str
    price: str
    buzz: int


def get_telegram_file_url(file_id: str) -> str | None:
    """Получает прямую ссылку на файл через Telegram API"""
    if not file_id or not BOT_TOKEN:
        return None
    try:
        # Сначала получаем file_path
        url = f'https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}'
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            data = response.json()
            file_path = data.get('result', {}).get('file_path')
            if not file_path:
                return None
            # Формируем прямую ссылку
            return f'https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}'
    except Exception as e:
        print(f'Ошибка получения URL файла: {e}')
        return None


@app.get('/meme/today')
def get_today_meme(userId: str | None = Query(None)):
    session = get_session()
    memes = session.query(Meme).all()
    session.close()
    
    if not memes:
        raise HTTPException(status_code=404, detail='No memes yet')
    
    meme = random.choice(memes)
    
    # Получаем прямую ссылку ТОЛЬКО для фото из Telegram
    image_url = None
    if meme.file_id and BOT_TOKEN:
        try:
            url = f'https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={meme.file_id}'
            with httpx.Client(timeout=10.0) as client:
                resp = client.get(url)
                data = resp.json()
                file_path = data.get('result', {}).get('file_path')
                if file_path:
                    image_url = f'https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}'
        except Exception as e:
            print(f'Ошибка получения файла: {e}')
    
    return {
        'id': meme.id,
        'title': meme.caption or 'Новый шар',
        'caption': meme.caption or 'Заряд от анона',
        'image': image_url or '',
        'tags': ['#местный', '#шар_настроения']
    }

def telegram_file_url(file_id: str) -> str | None:
    if not file_id:
        return None
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}'
    with httpx.Client(timeout=10.0) as client:
        response = client.get(url)
        response.raise_for_status()
        data = response.json()
        path = data.get('result', {}).get('file_path')
        if not path:
            return None
        return f'https://api.telegram.org/file/bot{BOT_TOKEN}/{path}'

@app.get('/meme/today')
def get_today_meme(userId: str | None = Query(None)):
    session = get_session()
    memes = session.query(Meme).all()
    session.close()
    
    if not memes:
        raise HTTPException(status_code=404, detail='No memes yet')
    
    # Выбираем случайный мем
    meme = random.choice(memes)
    
    return {
        'id': meme.id,
        'title': meme.caption or 'Новый шар',
        'caption': meme.caption or 'Заряд от анона',
        'image': meme.file_id,  # Telegram file_id для локального использования
        'tags': ['#местный', '#шар_настроения']
    }


@app.post('/meme/submit')
def submit_meme(payload: MemeSubmitRequest):
    session = get_session()
    meme = Meme(
        telegram_user_id=str(payload.userId) if payload.userId else None,
        file_id=payload.fileId,
        caption=payload.caption or 'Мем из WebApp',
        media_type='photo'
    )
    session.add(meme)
    session.commit()
    session.refresh(meme)
    session.close()
    return {'status': 'ok', 'memeId': meme.id}


@app.post('/meme/react')
def react_to_meme(payload: MemeReactionRequest):
    session = get_session()
    meme = session.query(Meme).filter(Meme.id == payload.memeId).first()
    if not meme:
        session.close()
        raise HTTPException(status_code=404, detail='Meme not found')
    reaction = Reaction(
        meme_id=meme.id,
        telegram_user_id=str(payload.userId) if payload.userId else None,
        reaction=payload.reaction
    )
    session.add(reaction)
    session.commit()
    count = session.query(Reaction).filter(Reaction.meme_id == meme.id).count()
    session.close()
    return {'status': 'ok', 'count': count}


@app.get('/events')
def get_events(date: str = Query(...)):
    sample = [
        MegaEvent(id=1, emoji='🎸', title='Рок в подвале', time='21:00', place='За рынком', price='Бесплатно', buzz=12),
        MegaEvent(id=2, emoji='🎭', title='Импро на лавочке', time='19:00', place='Парк Фонтанов', price='200₽', buzz=24),
        MegaEvent(id=3, emoji='🍜', title='Ночной лапшичный поп-up', time='23:30', place='Ул. Ленина', price='150₽', buzz=8)
    ]
    return {'events': [event.dict() for event in sample]}


@app.get('/health')
def health():
    return {'status': 'ok'}
