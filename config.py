import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8652656840:AAFPN7K7yZrZcVFpBCfG6YzXFzOUhN9w9pk")
SUPABASE_URL = os.getenv("SUPABASE_URL", "SUPABASE_URL_SHUYERGA")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "SUPABASE_KEY_SHUYERGA")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://cefrdosh.vercel.app") # Keyinchalik Vercel URL'ini qoyasiz