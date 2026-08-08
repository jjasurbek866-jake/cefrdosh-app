import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from config import BOT_TOKEN, WEBAPP_URL
from databse import get_or_create_user

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def start_handler(message: types.Message):
    user = get_or_create_user(
        user_id=message.from_user.id,
        username=message.from_user.username or "",
        full_name=message.from_user.full_name
    )
    
    # Web App tugmasi
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 CEFRdosh ni Ochish",
                    web_app=WebAppInfo(url=f"{WEBAPP_URL}?user_id={message.from_user.id}")
                )
            ]
        ]
    )
    
    caption = (
        f"Xush kelibsiz, **{message.from_user.first_name}**!\n\n"
        f"🎯 Hozirgi darajangiz: **{user['cefr_level']}**\n"
        f"⚡ XP Ballar: **{user['xp']}** | 💎 Gemlar: **{user['gems']}**\n\n"
        f"Ingliz tilini CEFR standartida o'rganish va AI bilan muloqot qilish uchun pastdagi tugmani bosing!"
    )
    
    await message.answer(caption, parse_mode="Markdown", reply_markup=keyboard)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
