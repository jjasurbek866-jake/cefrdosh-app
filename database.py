import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_or_create_user(telegram_id: int, first_name: str, username: str = None):
    """Foydalanuvchini bazadan qidiradi yoki yangi yaratadi"""
    response = supabase.table("users").select("*").eq("telegram_id", telegram_id).execute()
    
    if response.data:
        return response.data[0]
    
    new_user = {
        "telegram_id": telegram_id,
        "first_name": first_name,
        "username": username,
        "xp": 0,
        "streak": 1,
        "level": "A1"
    }
    res = supabase.table("users").insert(new_user).execute()
    return res.data[0]

async def get_words_by_level(level: str = "A1", limit: int = 10):
    """Belgilangan CEFR darajasi bo'yicha so'zlarni oladi"""
    response = supabase.table("words").select("*").eq("cefr_level", level).limit(limit).execute()
    return response.data

async def update_user_xp(telegram_id: int, added_xp: int):
    """Foydalanuvchining XP balini oshiradi"""
    user = supabase.table("users").select("xp").eq("telegram_id", telegram_id).execute()
    if user.data:
        current_xp = user.data[0]["xp"]
        new_xp = current_xp + added_xp
        supabase.table("users").update({"xp": new_xp}).eq("telegram_id", telegram_id).execute()
        return new_xp
    return 0

async def get_leaderboard(limit: int = 10):
    """Eng yuqori XP ga ega top foydalanuvchilar ro'yxati"""
    response = supabase.table("users").select("first_name, username, xp, level").order("xp", desc=True).limit(limit).execute()
    return response.data
