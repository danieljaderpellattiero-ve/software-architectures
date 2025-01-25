# Устанавливаем базовый образ
FROM node:16

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Устанавливаем переменную окружения
ENV NODE_ENV=production

# Открываем порт приложения
EXPOSE 5000

# Команда запуска приложения
CMD ["npm", "start"]
