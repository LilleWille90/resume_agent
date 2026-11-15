# Case: StoryTailor - AI-assisted personal children's books

Status: independent service project; a working end-to-end path from recorded story to print order. A project walkthrough is available on request.

## Problem

Parents tell unique bedtime stories that rarely become lasting keepsakes. Turning a recording into a coherent, illustrated and printable book normally requires writing, design and production skills that most families do not have.

## Mattias' role

Solo product builder. Mattias defined the customer journey, designed the service, built the web application and integrated the production flow end to end, across UX, engineering, model integrations, payments and print fulfilment.

## How AI is used

The service turns a parent-recorded story into a book through a sequenced, multimodal AI workflow: voice recording, transcription, character and story analysis, page structure, prompt generation, image generation, layout and PDF creation, payment and Lulu print fulfilment. Different models are used for their different strengths. This is model orchestration in service of a complete customer experience.

## Technical detail

- Stack: React 19 and Vite; Supabase for authentication, Postgres with row-level security, and storage for story audio, book images and PDFs; Netlify serverless functions, including a background function; @react-pdf/renderer for print-ready PDFs; Capacitor for an iOS build.
- Language models: OpenAI Whisper (whisper-1) transcribes Swedish and English recordings. Anthropic Claude Haiku 4.5 handles fast structured steps: character extraction, style guides and visual prompts. Claude Sonnet 4.6 splits stories into pages, suggests illustrations and analyses uploaded style reference images.
- Images and audio: Black Forest Labs FLUX 1.1 Pro via Replicate creates character reference images; FLUX Kontext Pro uses those references to keep characters consistent from page to page. OpenAI text-to-speech (tts-1) reads stories aloud.
- Payments and print: Stripe Checkout with a verified webhook, then the Lulu Print API (OAuth client credentials) for print-on-demand production and shipping.
- Engineering: all API keys stay server-side in functions; the browser only holds Supabase's public key. Image calls back off and retry when rate-limited, and the PDF layout includes bleed for Lulu's print specification.

## Outcome and learning

StoryTailor has a working end-to-end path from recorded story to print order, built as a sustained side project. The practical learning is that the value lies in orchestration: model selection, workflow design, quality checks and recovery paths (character consistency, malformed structured output, print-layout constraints) turn powerful capabilities into a dependable experience; a good prompt alone is not a product.
