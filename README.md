# Quran Agent | Kuran Ajanı

A bilingual (Turkish/English) web app for intra-Quranic tafsir — ask questions about Quranic verses and receive structured interpretations based on Arabic root concordance and verse connections.

> **Powered by [Açık Kuran API](https://acikkuran.com)** — all verse data, Arabic text, roots, and translations come directly from the API.

## Features

- Intra-Quranic Tafsir — Quran explains Quran (no opinion-based commentary)
- Arabic with Full Diacritics — proper Quranic typography using Amiri font
- Root Analysis — word-by-word Arabic root breakdown
- Connected Verses — find verses sharing the same root words
- Prose Companion — structured explanation: Anchor → Connections → Synthesis
- Bilingual — Turkish and English support
- Dark Mode — comfortable reading in any lighting

## Prerequisites

- Node.js 18+
- Docker Desktop (for the Açık Kuran API)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd quran-agent
npm install
```

### 2. Start the Açık Kuran API

```bash
docker compose up -d
```

Wait ~15 seconds for the API to start, then verify:

```bash
curl http://localhost:3112/
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000/tr](http://localhost:3000/tr) (Turkish) or [http://localhost:3000/en](http://localhost:3000/en) (English).

## Example Questions

- `Fatiha 1:7` — Analyze the last verse of Al-Fatiha
- `1:7` — Same as above (surah:verse format)
- `rahman` — Search for verses about mercy
- `iman` — Find verses about faith

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ACIKKURAN_URL` | `http://localhost:3112` | Açık Kuran API URL |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | `tr` | Default language (tr/en) |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **i18n**: next-intl (TR/EN)
- **Arabic Font**: Amiri (Google Fonts)
- **API**: [Açık Kuran API](https://github.com/ziegfiroyt/acikkuran-api)
- **Caching**: LRU Cache (in-memory)

## Attribution

All Quranic data provided by **[Açık Kuran](https://acikkuran.com)** — an open-source Quran platform.

- Default Turkish translation: Erhan Aktaş — Kerim Kur'an (Author ID: 105)
- Default English translation: Edip-Layth (Author ID: 103)

## License

MIT — see [LICENSE](LICENSE)

---

*Original Next.js scaffold info below:*

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
