# cau hinh bien moi truong cho database
  export DB_CONNECTION=mongodb
  export DB_HOST=localhost
  export DB_PORT=27017
  export DB_NAME=db_projectApp
  export DB_USERNAME=""
  export DB_PASSWORD=""

# tao bien moi truong cho port
export APP_HOST=localhost
# nen de port tren 3000
export APP_PORT=3030

# Cấu hình sesion
export SESSION_KEY="express.sid"
export SESSION_SECRET="mySecret"

#cau hinh bien moi truong cho login facebook
export FB_APP_ID=292872395395027
export FB_APP_SECRET=79aecc6492882860c0d241cf302b56e6
export FB_CALLBACK_URL=https://localhost:2020/auth/facebook/callback

#cau hinh bien moi truong cho login google
export GG_APP_ID=655524890166-ds0vpad0sgjja3vg9s81pnu03606cotu.apps.googleusercontent.com
export GG_APP_SECRET=NZY6JBgM1twurKyyg9s_qqzO
export GG_CALLBACK_URL=https://localhost:2020/auth/google/callback
