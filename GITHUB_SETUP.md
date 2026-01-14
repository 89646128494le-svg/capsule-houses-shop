# Инструкция: Загрузка проекта на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Зайдите на https://github.com
2. Войдите в свой аккаунт (или создайте новый)
3. Нажмите кнопку **"+"** в правом верхнем углу → **"New repository"**
4. Заполните форму:
   - **Repository name:** `capsule-houses-shop` (или любое другое имя)
   - **Description:** "Интернет-магазин капсульных домов"
   - **Visibility:** Public или Private (на ваше усмотрение)
   - ⚠️ **НЕ ставьте галочки** на "Initialize with README", "Add .gitignore", "Choose a license"
5. Нажмите **"Create repository"**

## Шаг 2: Загрузите код на GitHub

После создания репозитория GitHub покажет инструкции. Выполните в PowerShell:

```powershell
# Перейдите в папку проекта (если еще не там)
cd "C:\Users\Lev\Desktop\Проекты\online shop"

# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/capsule-houses-shop.git

# Загрузите код на GitHub
git branch -M main
git push -u origin main
```

**Важно:** Замените `YOUR_USERNAME` на ваш реальный GitHub username!

Например, если ваш username `lev123`, команда будет:
```powershell
git remote add origin https://github.com/lev123/capsule-houses-shop.git
```

## Шаг 3: Проверьте результат

После выполнения команд:
1. Обновите страницу репозитория на GitHub
2. Вы должны увидеть все файлы проекта
3. Теперь можно деплоить на Vercel!

## Если возникли проблемы

### Ошибка "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/capsule-houses-shop.git
```

### Нужно авторизоваться
GitHub может попросить авторизацию. Используйте:
- Personal Access Token (рекомендуется)
- Или GitHub Desktop для визуального управления

## Следующий шаг: Деплой на Vercel

После загрузки на GitHub:
1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите ваш репозиторий
5. Нажмите "Deploy"
6. Получите публичную ссылку!

---

## Альтернатива: GitHub Desktop (проще для новичков)

Если командная строка кажется сложной:

1. Скачайте GitHub Desktop: https://desktop.github.com
2. Войдите в свой GitHub аккаунт
3. File → Add Local Repository
4. Выберите папку проекта
5. Нажмите "Publish repository"
6. Готово!
