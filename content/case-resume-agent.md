# Case: Resume Agent - a transparent conversational portfolio

## Problem

A conventional CV is difficult to explore. Recruiters often need context on scope, trade-offs, working style and relevant projects, but should not have to search across a long document or receive claims that cannot be supported.

## Mattias' role

Product owner and builder. Mattias reframed an existing CV chatbot as a focused portfolio: clear positioning, a downloadable CV, selected case studies and a recruiter-friendly Q&A experience.

## How AI is used

The assistant uses retrieval over a maintained, version-controlled knowledge base of CV and case material. It is instructed to answer only from supplied context, acknowledge missing information and identify the sources used for each answer.

## Technical approach

- Static Netlify site with a Netlify serverless chat function
- Markdown knowledge base kept alongside the site and included in the function bundle
- Lightweight retrieval that selects relevant source excerpts for each question
- Anthropic API for concise, language-matched answers with structured response handling
- Explicit source labels and conservative system instructions to reduce unsupported claims

## Outcome and learning

Resume Agent is live as a portfolio experiment and a practical example of AI-enabled communication. The central learning is that a narrow, well-governed knowledge base is more credible and useful than a broad chatbot that guesses.
