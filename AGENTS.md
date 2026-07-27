# Асистент лікаря: правила для Codex

Перед початком будь-якої роботи обов'язково прочитай:

* `docs/PROJECT.md`
* `docs/CURRENT_STATE.md`
* `docs/ARCHITECTURE.md`, якщо файл доступний у робочому контексті
* `docs/BRANDBOOK.md`
* `docs/PRODUCT_VISION.md`
* `docs/ROADMAP.md`
* `docs/FEATURE_DECISIONS.md`

Перед роботою з вкладкою «Препарати» додатково прочитай:

* `docs/PHARMACOLOGY_GUIDE.md`

Перед публікацією змін на production додатково прочитай:

* `docs/DEPLOYMENT_CHECKLIST.md`

## Обов'язкове після змін

1. Запустити `npm run build`.
2. Якщо build успішний, зробити commit і `git push origin main`, якщо користувач не просив інакше.
3. Після push перевірити Vercel deployment.
4. Перевірити, що `https://asystent-likarya.vercel.app` дивиться на найновіший production deployment.
5. Якщо alias дивиться на старий deployment, переприв'язати його через Vercel CLI.
6. Для змін, пов'язаних із Google Analytics, перевірити production HTML і Network-запити до `googletagmanager.com` та `google-analytics.com`.

## Заборони без прямого запиту

* Не додавати OpenAI.
* Не додавати авторизацію.
* Не додавати базу даних.
* Не додавати оплату.
* Не змінювати медичні формули без прямого прохання користувача.
