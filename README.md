# HN Tech News (Angular)

HN Tech News is an Angular single-page application that democratizes access to tech information by displaying the latest stories from **Hacker News** using the official Hacker News Firebase API.

## Links

- **Live (Firebase Hosting):** https://hn-tech-news-treccaniandrea6.web.app
- **Repository (GitHub):** https://github.com/treccaniandrea6-prog/hn-tech-news

---

## Features (Project Requirements)

### 1) Main page – Latest news

- On startup, the app calls:
  - `https://hacker-news.firebaseio.com/v0/newstories.json`
- This endpoint returns ~500 story IDs.
- To avoid performance issues, the app loads **only the first 10 IDs** and fetches the details for each item.

### 2) Load more – Next 10 news

- Clicking **Load more** loads the next batch of **10** story IDs from the already-fetched list.
- For each ID, the app calls the item endpoint:
  - `https://hacker-news.firebaseio.com/v0/item/<ID>.json`
- The UI shows **title, link and date** for each news item.

### UX / Usability

- Loading state and skeleton UI
- Error handling with user-friendly messages
- The **Load more** button is disabled while loading and when there are no more items

---

## How the app was developed (High-level)

The app follows a feature-oriented structure and Angular best practices:

- API communication is isolated in a dedicated service
- Data models are typed (interfaces/models folder)
- UI logic is contained in a feature page component
- RxJS is used to handle multiple requests efficiently (batch loading)

### Data flow

1. Fetch story IDs (`newstories.json`)
2. Slice first 10 IDs (page size = 10)
3. Fetch details in parallel for the selected IDs
4. Map the API response to the app model and render the list
5. On **Load more**, repeat the same process with the next 10 IDs

---

## Tech Stack / External Libraries

- **Angular** (standalone components)
- **TypeScript**
- **RxJS** (`forkJoin`, `catchError`, `finalize`, `timeout`)
- **Angular HttpClient**
- **Firebase Hosting** (deployment)

No additional UI framework is required for the evaluation. The focus is on functionality and user experience.

---

## Project structure

A simplified overview:

- `src/app/core/services/`
  - `hacker-news.services.ts` → calls Hacker News API
- `src/app/features/news/news-page/`
  - `news-page.ts` / `news-page.html` / `news-page.scss` → main page UI + pagination logic
- `src/app/models/`
  - typed models (e.g. `hn-item.model.ts`, `news.model.ts`)

---

## Setup and Run locally (for reviewers)

### Prerequisites

- **Node.js** (recommended: LTS)
- **Angular CLI** (recommended)

### Clone repository

```bash
git clone https://github.com/treccaniandrea6-prog/hn-tech-news.git
cd hn-tech-news
```
