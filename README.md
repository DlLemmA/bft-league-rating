# Любительская Лига Триатлона

Веб-приложение для отображения результатов соревнований и рейтинга участников Любительской Лиги триатлона Беларуси.

## Благодарности

<div align="center">
  <a href="https://github.com/mkharytonau">
    <img src="https://github.com/mkharytonau.png?size=60" width="60" height="60" style="border-radius: 50%; border: 2px solid #e5e7eb;" alt="mkharytonau">
  </a>
  <br><br>
  <strong>Проект вдохновлен работой <a href="https://github.com/mkharytonau">@mkharytonau</a></strong>
  <br>
  <em><a href="https://github.com/mkharytonau/bft-league-rating">🔗 bft-league-rating</a></em>
</div>

## Описание проекта

Это приложение на базе Nuxt 4 предоставляет:

- 📊 **Рейтинговые таблицы** участников по годам
- 🏆 **Результаты соревнований** с детальной статистикой
- 🧮 **Калькуляторы очков** для дистанционных и рейтинговых баллов
- 📋 **Информацию о лицензиях** участников
- 📈 **Статистику** по сезонам и соревнованиям

## Структура директории `content`

Все данные приложения хранятся в директории `content` в структурированном виде:

```
content/
└── [год]/                          # Данные по годам (например, 2025)
    ├── competition-points.json      # Таблица очков за соревнования
    ├── licenses.csv                 # Список лицензированных участников
    ├── name_mapping.csv             # Сопоставление имен участников
    ├── competitions/                # Описания соревнований
    │   ├── minsk-indoor.json
    │   ├── brest-aquathlon.json
    │   └── ...
    └── results/                     # Результаты соревнований
        ├── minsk-indoor/
        │   ├── men.csv
        │   └── women.csv
        ├── brest-aquathlon/
        │   ├── men.csv
        │   └── women.csv
        └── ...
```

### Файлы конфигурации соревнований

Каждое соревнование описывается JSON-файлом в `content/[год]/competitions/`:

```json
{
  "slug": "minsk-indoor",
  "title": "Минск Индор Триатлон",
  "description": "Зимний триатлон в спортивных залах Минска",
  "readerType": "minskIndoor",
  "category": "Kross",
  "startDate": "2025-03-15",
  "endDate": "2025-03-15"
}
```

### Файлы результатов

Результаты хранятся в CSV-файлах в директории `content/[год]/results/[соревнование]/`:
- `men.csv` - результаты мужчин
- `women.csv` - результаты женщин

### Дополнительные файлы

- `competition-points.json` - таблица очков за места в соревнованиях
- `licenses.csv` - список участников с лицензиями
- `name_mapping.csv` - сопоставление различных написаний имен участников

## Установка и запуск

### Установка зависимостей

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Запуск сервера разработки

Запустите сервер разработки на `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Сборка для продакшена

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Предварительный просмотр продакшен-сборки

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Технологии

- **Nuxt 4** - фреймворк для Vue.js
- **Nuxt Content** - система управления контентом
- **Nuxt UI** - библиотека компонентов
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - CSS-фреймворк

## Добавление новых данных

1. **Новый сезон**: создайте директорию `content/[год]/`
2. **Новое соревнование**: добавьте JSON-файл в `content/[год]/competitions/`
3. **Результаты**: добавьте CSV-файлы в `content/[год]/results/[соревнование]/`
4. **Лицензии**: обновите файл `content/[год]/licenses.csv`

Приложение автоматически подхватит новые данные при следующей сборке.

---

## Для разработчиков

### Установка и запуск

#### Установка зависимостей

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

#### Запуск сервера разработки

Запустите сервер разработки на `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

#### Сборка для продакшена

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

#### Предварительный просмотр продакшен-сборки

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

### Технологии

- **Nuxt 4** - фреймворк для Vue.js
- **Nuxt Content** - система управления контентом
- **Nuxt UI** - библиотека компонентов
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - CSS-фреймворк

### Документация

Подробнее о Nuxt 4 читайте в [официальной документации](https://nuxt.com/docs/getting-started/introduction).

Информацию о развертывании смотрите в [документации по деплою](https://nuxt.com/docs/getting-started/deployment).
