# 1. Глобально CLI 20
npm install -g @angular/cli@20

# 2. В папці поточного проекту
ng update @angular/cli@20 @angular/core@20 --force --allow-dirty

# 3. Якщо помилки – видали node_modules і package-lock.json
rm -rf node_modules package-lock.json

# 4. npm install

# 5. Тепер пробуй ng add @angular/fire – має піти чисто
