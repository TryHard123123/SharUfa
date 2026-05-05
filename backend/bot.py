from dotenv import load_dotenv
load_dotenv()

import os
import random
from datetime import datetime
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from models import get_session, Meme

BOT_TOKEN = os.getenv('BOT_TOKEN')
if not BOT_TOKEN:
    raise RuntimeError('BOT_TOKEN must be set in environment')

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

user_viewed_memes = {}


def save_meme_to_db(file_id: str, user_id: int, caption: str = None, media_type: str = 'photo'):
    session = get_session()
    try:
        meme = Meme(
            telegram_user_id=str(user_id),
            file_id=file_id,
            caption=caption or 'Без подписи',
            media_type=media_type,
            created_at=datetime.utcnow()
        )
        session.add(meme)
        session.commit()
        return meme.id
    except Exception as e:
        session.rollback()
        print(f'Ошибка сохранения мема: {e}')
        return None
    finally:
        session.close()


def get_random_meme(user_id: int):
    session = get_session()
    try:
        all_memes = session.query(Meme).all()
        if not all_memes:
            return None
        
        if user_id not in user_viewed_memes:
            user_viewed_memes[user_id] = set()
        
        viewed = user_viewed_memes[user_id]
        unseen = [m for m in all_memes if m.id not in viewed]
        
        if not unseen:
            user_viewed_memes[user_id] = set()
            unseen = all_memes
        
        meme = random.choice(unseen)
        user_viewed_memes[user_id].add(meme.id)
        return meme
    finally:
        session.close()


@dp.message(Command('start'))
async def cmd_start(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text='🌀 Открыть Шар Уфы', web_app=WebAppInfo(url='https://shar-ufa.vercel.app'))],
        [InlineKeyboardButton(text='🎲 Мем дня', callback_data='meme')],
        [InlineKeyboardButton(text='🎭 Афиша', callback_data='kipish')]
    ])
    await message.answer(
        f'👋 Привет, {message.from_user.first_name}!\n\n'
        'Это Шар Уфы — городской мем-сервис.\n\n'
        '📸 Отправь фото или видео, чтобы добавить мем.\n'
        '🎲 Нажми кнопку или /meme чтобы получить мем.',
        reply_markup=keyboard
    )


@dp.callback_query(lambda c: c.data == 'meme')
async def callback_meme(callback: types.CallbackQuery):
    meme = get_random_meme(callback.from_user.id)
    
    if not meme:
        await callback.message.answer('😔 Мемов пока нет. Отправь мне фото или видео!')
        await callback.answer()
        return
    
    if meme.media_type == 'photo':
        await callback.message.answer_photo(
            meme.file_id,
            caption=f'🎲 {meme.caption}\n\nЖми /meme — ещё мем!'
        )
    elif meme.media_type == 'video':
        await callback.message.answer_video(
            meme.file_id,
            caption=f'🎲 {meme.caption}\n\nЖми /meme — ещё мем!'
        )
    
    await callback.answer()


@dp.callback_query(lambda c: c.data == 'kipish')
async def callback_kipish(callback: types.CallbackQuery):
    await callback.message.answer(
        '🎭 Афиша Уфы:\n\n'
        '🎸 Рок в подвале — 21:00 (За рынком)\n'
        '🎭 Импро на лавочке — 19:00 (Парк Фонтанов)\n'
        '🍜 Ночной лапшичный поп-up — 23:30 (Ул. Ленина)'
    )
    await callback.answer()


@dp.message(Command('meme'))
async def cmd_meme(message: types.Message):
    meme = get_random_meme(message.from_user.id)
    
    if not meme:
        await message.answer('😔 Мемов пока нет. Отправь мне фото или видео!')
        return
    
    if meme.media_type == 'photo':
        await message.answer_photo(
            meme.file_id,
            caption=f'🎲 {meme.caption}\n\nЖми /meme — ещё мем!'
        )
    elif meme.media_type == 'video':
        await message.answer_video(
            meme.file_id,
            caption=f'🎲 {meme.caption}\n\nЖми /meme — ещё мем!'
        )


@dp.message(lambda message: message.photo)
async def handle_photo(message: types.Message):
    file_id = message.photo[-1].file_id
    caption = message.caption or 'Мем дня'
    
    meme_id = save_meme_to_db(
        file_id=file_id,
        user_id=message.from_user.id,
        caption=caption,
        media_type='photo'
    )
    
    if meme_id:
        await message.reply('📸 Фото принято! Жми /meme чтобы увидеть мемы!')


@dp.message(lambda message: message.video)
async def handle_video(message: types.Message):
    file_id = message.video.file_id
    caption = message.caption or 'Видео-мем'
    
    meme_id = save_meme_to_db(
        file_id=file_id,
        user_id=message.from_user.id,
        caption=caption,
        media_type='video'
    )
    
    if meme_id:
        await message.reply('🎬 Видео принято! Жми /meme чтобы увидеть мемы!')


@dp.message(Command('kipish'))
async def cmd_kipish(message: types.Message):
    await message.answer(
        '🎭 Афиша Уфы:\n\n'
        '🎸 Рок в подвале — 21:00 (За рынком)\n'
        '🎭 Импро на лавочке — 19:00 (Парк Фонтанов)\n'
        '🍜 Ночной лапшичный поп-up — 23:30 (Ул. Ленина)\n\n'
        'Жми /meme чтобы развлечься!'
    )


@dp.message(Command('help'))
async def cmd_help(message: types.Message):
    await message.answer(
        '🎲 Команды:\n'
        '/start — меню с кнопками\n'
        '/meme — получить случайный мем\n'
        '/kipish — афиша событий\n\n'
        '📸 Просто отправь фото или видео!'
    )


async def main():
    print('Бот запущен!')
    await dp.start_polling(bot)


if __name__ == '__main__':
    import asyncio
    asyncio.run(main())