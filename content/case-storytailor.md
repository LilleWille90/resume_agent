# Case: StoryTailor — AI-powered children's book creator

## What it is
StoryTailor is a solo-built, production web app that turns a parent's voice recording into a fully illustrated, print-ready children's picture book. The user records themselves telling a bedtime story; the app handles everything else — transcription, character extraction, illustration, layout, and physical print fulfillment.

Built entirely by Mattias during evenings and weekends using Claude Code as an AI coding assistant.

## Problem
Parents tell their children unique, personalised stories all the time — but those stories disappear. There's no easy way to turn them into something tangible, beautiful, and permanent without design or technical skills.

Existing tools are either too manual (design apps like Canva) or too generic (stock children's book generators with no personalisation).

## Approach
Built the full product solo as a learning exercise in AI integration and full-stack development:

**AI pipeline (orchestrated end-to-end):**
- Voice recording → OpenAI Whisper transcription
- Claude (Haiku) extracts characters with visual descriptions from the transcript
- Claude (Sonnet) splits the story into 10–14 picture-book pages
- Claude converts page text → precise image prompts (with character consistency logic)
- FLUX 1.1 Pro / FLUX Kontext generates illustrations per page
- React PDF renderer produces Lulu-spec print files (0.125" bleed, safe zones, 3 format sizes)

**Key technical challenges solved:**
- Character consistency in AI images: character names trigger training-data associations (e.g. "Elsa" → Disney). Fixed by replacing names with visual descriptions before sending to image model
- Robust JSON parsing: Claude sometimes mis-escapes dialogue quotes in JSON output — built multi-pass parser with regex fallback
- Professional print specs: implemented Lulu's exact bleed/safe-zone requirements in code for three book formats (square, portrait, landscape)
- Audio chunking: OpenAI TTS has a 4096-char limit — built sentence-boundary splitter to handle long pages cleanly
- Stripe → Lulu webhook coordination: PDF must exist before print job is submitted — sequenced this with Stripe Checkout metadata

**Stack:**
React 19 + Vite / Netlify serverless functions (14) / Supabase (auth, Postgres, object storage) / Stripe / Lulu Print API v2 / Anthropic Claude / OpenAI Whisper + TTS / Replicate FLUX

## Result
- Shipped to production with working end-to-end flow (record → illustrate → pay → print)
- Pay-per-print monetisation (Stripe + Lulu, ~$5 margin per book)
- Multi-language support (English and Swedish, with language-detected narration)
- iOS support prepared via Capacitor
- 100+ commits over sustained development period

## What it demonstrates
- **AI product thinking**: not just calling APIs, but designing prompts, handling model quirks, and chaining multiple models into a coherent user experience
- **Full-stack execution**: solo ownership across frontend, backend, database, payments, and third-party fulfillment
- **Monetisation design**: chose a pay-per-print model that aligns cost with value and requires no subscription overhead
- **Shipping discipline**: built iteratively, solved real integration problems, deployed to production

## Learnings
- Prompt engineering for consistency across a multi-step AI pipeline is significantly harder than single-turn prompting — each step can introduce drift
- Print fulfillment APIs (Lulu) are complex; testing end-to-end ordering requires real payments — built a cost safety check early to avoid accidental zero-cost orders
- React PDF generation is powerful but layout debugging is slow; worth investing in a live-preview loop early
