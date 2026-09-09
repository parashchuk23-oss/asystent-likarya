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
4. Перевірити, що `https://www.asystentlikarya.com.ua` дивиться на найновіший production deployment.
5. Якщо production-домен дивиться на старий deployment, переприв'язати його через Vercel CLI.
6. Для змін, пов'язаних із Google Analytics, перевірити production HTML і Network-запити до `googletagmanager.com` та `google-analytics.com`.
7. Після кожної суттєвої користувацької зміни перевірити, чи потрібно оновити `CONTENT_LOG.md`. Якщо зміна має практичну цінність для лікаря або може бути темою для публікації — додати запис.
8. Для задач, що стосуються UX/UI сайту, за можливості використовувати разом `frontend-design` + `web-design-guidelines`.
9. Для реалізації змін React/Next.js додатково використовувати `vercel-react-best-practices`.
10. Після реалізації значущих змін інтерфейсу використовувати `webapp-testing` для перевірки результату.
11. UX/UI-рефакторинг не повинен змінювати медичні формули, пороги, клінічні алгоритми або інтерпретацію результатів без окремого завдання.
12. Якщо користувач просить внести правки на сайт і прямо не зазначає «не публікуй», «не commit» або «не push», довести зміни до релізу: перевірити, логічно закомітити, синхронізувати з `origin/main`, виконати push і перевірити актуальний production deployment та основний домен.

## Skills

* `frontend-design` — використовувати під час створення або суттєвої зміни UI, layout, visual hierarchy, typography, spacing, cards, navigation та загального дизайну інтерфейсу.
* `web-design-guidelines` — використовувати для UX/UI-аудиту, accessibility, responsive design, forms, navigation, focus states, interaction states та перевірки відповідності web best practices.
* `vercel-react-best-practices` — використовувати при змінах React/Next.js компонентів, routing, rendering, state management, performance та архітектури frontend.
* `webapp-testing` — використовувати після суттєвих UI/UX або функціональних змін для перевірки основних сценаріїв через браузер.

## Заборони без прямого запиту

* Не додавати OpenAI.
* Не додавати авторизацію.
* Не додавати базу даних.
* Не додавати оплату.
* Не змінювати медичні формули без прямого прохання користувача.
