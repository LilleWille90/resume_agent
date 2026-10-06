# Case: StoryTailor - AI-assisted personal children's books

## Problem
Parents tell unique stories that rarely become lasting keepsakes. Turning a recording into a coherent, illustrated and printable book normally requires writing, design and production skills that most families do not have.

## Mattias' role

Solo product builder. Mattias defined the customer journey, designed the service, built the web application and integrated the production flow end to end.

## How AI is used

The service turns a parent-recorded story into a book through a sequenced, multimodal AI workflow: voice recording, transcription, character and story analysis, page structure, prompt generation, image generation, layout/PDF creation, payment and Lulu print fulfilment. This is model orchestration in service of a complete customer experience: work that once called for several specialist roles becomes one guided flow.

## Technical approach

- React/Vite frontend and Netlify serverless functions
- Supabase for authentication, data and file storage
- OpenAI for transcription and speech, Anthropic Claude for structured story work, and image models through Replicate—using different model strengths at different points in the workflow
- React PDF rendering for print-ready files, with Stripe payments and Lulu print fulfilment
- Product learnings and recovery paths for character consistency, malformed structured output and print-layout constraints

## Outcome and learning

StoryTailor has a working end-to-end path from recorded story to print order, built as a sustained side project. It shows how multimodal generation and well-orchestrated services can unlock a new product category. The practical learning is that innovation comes from the whole system: model selection, workflow design, quality checks and recovery paths turn powerful capabilities into a dependable experience; a good prompt alone is not a product.
