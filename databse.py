from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_or_create_user(user_id: int, username: str, full_name: str):
    """Foydalanuvchini bazadan qidiradi, yo'q bo'lsa yangi yaratadi."""
    response = supabase.table("users").select("*").eq("telegram_id", user_id).execute()
    
    if response.data:
        return response.data[0]
    
    # Yangi foydalanuvchi yaratish
    new_user = {
        "telegram_id": user_id,
        "username": username,
        "full_name": full_name,
        "cefr_level": "A1",
        "xp": 0,
        "streak": 1,
        "gems": 50
    }
    res = supabase.table("users").insert(new_user).execute()
    return res.data[0]
