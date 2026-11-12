# Dummy Shop

Магазин на Nuxt 4 поверх публичного API [dummyjson.com](https://dummyjson.com): каталог товаров, карточка товара с отзывами, корзины и вход по токену.

## Стек

- Nuxt 4, Vue 3, TypeScript
- Tailwind CSS 4
- lucide-vue-next — иконки
- @fontsource-variable — шрифты Golos Text и Oswald

## Страницы

| Маршрут | Что делает |
|---|---|
| `/` | перенаправляет на `/products` |
| `/products` | каталог товаров |
| `/products/:id` | карточка товара с отзывами |
| `/carts` | корзины, доступны после входа |
| `/login` | вход, токен кладётся в cookie |

## Запуск

```bash
npm install
npm run dev
```

Дев-сервер поднимается на `http://localhost:3100`.

## Команды

```bash
npm run build      # сборка
npm run preview    # просмотр собранной версии
npm run typecheck  # проверка типов
```

## Структура

```
app/
  pages/        страницы и маршруты
  composables/  useAuth — токен, вход и выход
  middleware/   auth — закрывает страницы от неавторизованных
  types/        типы ответов API
  assets/css/   стили и шрифты
samples/        примеры ответов dummyjson для справки
```

а так че когоооооооооооооооооооооо
