# Case: SongAtlas - explore the world's music by country

Public link: https://songatlas.net/atlas
Status: live, free and non-commercial web service.

## Problem

What are people listening to around the world? Streaming charts exist per country and per service, but they are scattered, hard to compare and rarely invite exploration. SongAtlas turns that question into a country-by-country discovery experience: an interactive globe with each country's top 10, rising tracks, genres, 30-second previews and a personal collection of liked tracks to take to a music service.

## Mattias' role

Product owner and builder. Mattias took the idea from a personal question to a published service: he shaped the discovery experience, chose the data sources and their rules, and built and iterated on the service with AI-assisted development.

## How AI is used

AI supported implementation and iteration (AI coding agents). The music experience itself is built on licensed chart data and catalogue integrations; it is not an AI-generated ranking, and nothing in the charts is guessed or invented.

## Product decisions

- Make sources and limits visible: the About page explains how charts are combined, and missing metadata is shown as unknown rather than as zero results or a guess.
- Exact matching over fuzzy matching: a track without an exact catalogue match gets a placeholder cover and no preview.
- Respect the user's data: no account, no cookies, no tracking; liked tracks stay in the browser.
- Different export paths for different music services, depending on what each service allows.

## Technical detail

- Hosting and front end: a Cloudflare-hosted web app in React and TypeScript, built on Vinext (a Vite-based implementation of the Next.js API). The globe is an orthographic D3 projection with a small WebGL renderer for the landscape view; Natural Earth relief textures are bundled (under 1 MB), so there are no map-vendor keys or per-view map API calls.
- Chart data: the Soundcharts API is the single ranking source. Most countries use the Spotify and Apple Music national daily charts; where a local service leads the market its chart is added with equal weight (QQ Music for China, Melon for South Korea, JioSaavn for India). Charts are combined with equal weight using shared Soundcharts recording identifiers (UUIDs); a country with only one chart is shown without aggregation. More than 100 countries are covered each week. Genres are Soundcharts root genres.
- Media matching: covers and 30-second previews come from the Apple Music catalogue, matched by exact ISRC in the right storefront, with no fuzzy title search. Previews stream from Apple; no audio is stored.
- Playlist export: Apple Music export uses MusicKit JS with a short-lived developer token signed on the server, so the private key never reaches the browser; playlists are created private, de-duplicated and only ever added to. Spotify and YouTube Music export use links resolved through Soundcharts and need no sign-in.
- Storage and caching: Cloudflare D1 (SQLite) with Drizzle ORM. A shared weekly cache refreshes on the first visit after Friday 18:00 Stockholm time; saved chart snapshots power "biggest climber" and rising tracks; ISRC matches are cached for 30 days. Liked tracks (up to 100) are kept in the browser's local storage.
- Privacy and cost control: no cookies or tracking; usage is counted as anonymous daily totals per country (from Cloudflare). Calls to the data provider run under a hard request budget, and metadata is fetched in small batches only for the tracks being shown. Earlier experiments (direct Apple charts, Deezer, Spotify scraping) were retired and are switched off at the API.

## Outcome and learning

SongAtlas is live. A playful starting point led to real product questions: data freshness, matching recordings across services, API budgets and licensing, and what to show when a source is unavailable.

## On the phone
SongAtlas also works as a mobile web app in the phone browser: the same globe, country top 10s and previews, liked tracks saved in the browser, and export of liked tracks to a "Song Atlas discoveries" playlist in Apple Music, or to Spotify and YouTube Music. A phone recording of this is on the portfolio.
