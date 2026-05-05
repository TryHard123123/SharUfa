# Шар Уфы

Проект разделён на frontend и backend.

## Структура

- `frontend/` — React + Vite + Tailwind приложение
- `backend/` — Python проект с Aiogram 3 и FastAPI
- `.env.example` — переменные окружения

## Запуск frontend

1. Перейти в папку `frontend`
2. Установить зависимости: `npm install`
3. Запустить: `npm run dev`

## Запуск backend

1. Перейти в папку `backend`
2. Установить зависимости: `pip install -r requirements.txt`
3. Запустить API: `uvicorn api:app --reload --host 0.0.0.0 --port 8000`
4. Запустить бота: `python bot.py`

## Переменные окружения

- `VITE_API_URL` — адрес FastAPI
- `BOT_TOKEN` — токен Telegram-бота
- `WEB_APP_URL` — URL WebApp, обычно `http://localhost:4173`
