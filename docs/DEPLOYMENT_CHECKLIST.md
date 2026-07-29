# Deployment Checklist

Цей документ є пам'яткою для Codex перед публікацією змін на production.

## Основний сайт

Production-домен:

* `https://www.asystentlikarya.com.ua`

GitHub:

* `https://github.com/parashchuk23-oss/asystent-likarya`

Основна гілка:

* `main`

## Після змін у коді

1. Запустити:

```bash
npm run build
```

2. Якщо build успішний:

```bash
git add .
git commit -m "..."
git push origin main
```

3. Перевірити, що Vercel створив production deployment для нового commit:

```bash
npx vercel ls cardio-assistant-online
```

4. Перевірити, куди дивиться основний домен:

```bash
npx vercel inspect https://www.asystentlikarya.com.ua
```

5. Якщо `www.asystentlikarya.com.ua` дивиться на старий deployment, переприв'язати alias до нового production deployment:

```bash
npx vercel alias set https://NEW_DEPLOYMENT_URL www.asystentlikarya.com.ua
```

## Google Analytics

Google Analytics 4 працює тільки якщо під час production build доступна змінна:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

Значення має бути у форматі:

```text
G-XXXXXXXXXX
```

Поточний Measurement ID:

```text
G-GB076YVKX1
```

ID не хардкодити в коді. Він має братися тільки з environment variable.

Після зміни `NEXT_PUBLIC_GA_MEASUREMENT_ID` у Vercel потрібно зробити новий production redeploy, тому що `NEXT_PUBLIC_*` змінні вшиваються в сайт під час `next build`.

## Перевірка Google Analytics після деплою

Перевірити production HTML:

```bash
curl -L -s https://www.asystentlikarya.com.ua | grep -ao "G-GB076YVKX1\\|googletagmanager\\|google-analytics\\|GoogleAnalytics"
```

Очікувано мають з'явитися:

* `G-GB076YVKX1`
* `googletagmanager`
* `GoogleAnalytics`

У браузері:

1. Відкрити `https://www.asystentlikarya.com.ua`.
2. Відкрити Chrome DevTools.
3. Перейти у вкладку `Network`.
4. У фільтрі написати `google`.
5. Оновити сторінку.

Очікувані запити:

* `https://www.googletagmanager.com/gtag/js?id=G-GB076YVKX1`
* `https://www.google-analytics.com/g/collect...`

Якщо цих запитів немає:

1. Перевірити, чи production alias дивиться на найновіший deployment.
2. Перевірити, чи `NEXT_PUBLIC_GA_MEASUREMENT_ID` існує у Vercel Production.
3. Зробити Redeploy після зміни environment variables.
4. Перевірити, чи не блокує запити AdBlock, Brave Shields або privacy extension.
