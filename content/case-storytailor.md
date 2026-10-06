# Case: StoryTailor - AI-assisted personal children's books

## Problem
Parents tell unique stories that rarely become lasting keepsakes. Turning a recording into a coherent, illustrated and printable book normally requires writing, design and production skills that most families do not have.

## Mattias' role

Solo product builder. Mattias defined the customer journey, designed the service, built the web application and integrated the production flow end to end.

## How AI is used

The service turns a parent-recorded story into a book through a sequenced AI workflow: transcription, story and character extraction, page structure, illustration prompts and image generation. AI is an enabling component in a broader product flow, not the product on its own.

## Technical approach

- React/Vite frontend and Netlify serverless functions
- Supabase for authentication, data and file storage
- OpenAI for transcription and speech, Anthropic Claude for structured story work, and image models through Replicate
- React PDF rendering for print-ready files, with Stripe payments and Lulu print fulfilment
- Guardrails for character consistency, malformed structured output and print-layout constraints

## Outcome and learning

StoryTailor has a working end-to-end path from recorded story to print order, built as a sustained side project. It reinforced that multi-step AI experiences need careful orchestration, quality checks and recovery paths; a good prompt alone is not a product system.
