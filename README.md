# AI Terms

Dutch glossary of AI terms for the TopBot desk. `/` and `/begrippen` are the same overview. There is no separate marketing home.

## Routes

- `/` and `/begrippen` — search, A–Z, topics, cards, pagination
- `/begrippen/letter/<a-z|hash>` — same layout, filtered by first letter (`hash` is `#`)
- `/begrippen/onderwerp/<category-slug>` — same layout, filtered by topic
- `/begrippen/<slug>` — term detail

## API

The server reads `AI_TERMS_PUBLIC_API_BASE` (default `https://dashboard.ai-cloudy.org`) and calls:

- `GET /api/public/ai-terms?page=&limit=`
- `GET /api/public/ai-terms/:slug`
- `GET /api/public/ai-terms/:uuid`

Only `published === true` terms are shown. Dutch fields are preferred. A joined source (`name`, `url`, `publisher`) is shown when the payload includes one. Letter, topic and search filters run on the fetched list when the API does not expose those query parameters.

No ingest secrets are used in the browser.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3003.
