# Case: Resume Agent - a conversational portfolio

## Problem

A conventional CV is difficult to explore. Recruiters often need context on scope, product thinking, working style and relevant projects, but a static document makes that discovery slow and one-directional.

## Mattias' role

Product owner and builder. Mattias reframed an existing CV chatbot as a focused portfolio: clear positioning, a downloadable CV, selected case studies and a recruiter-friendly Q&A experience.

## How AI is used

Resume Agent is an experiment in making a traditional artifact interactive. Structured knowledge, retrieval and an LLM allow recruiters to ask natural questions and explore the relevant material in conversation, while source grounding keeps answers connected to the underlying CV and case notes.

## Technical approach

- Static Netlify site with a Netlify serverless chat function
- Markdown knowledge base kept alongside the site and included in the function bundle
- Lightweight retrieval that selects relevant source excerpts for each question
- Anthropic API for concise, language-matched answers with structured response handling
- Source labels and instructions that keep answers grounded in the maintained material

## Outcome and learning

Resume Agent is live as a portfolio experiment and a small, concrete example of workflow redesign with AI: an otherwise static CV becomes a recruiter-friendly product experience. The central learning is that human-curated, structured knowledge plus conversational AI can make familiar information far more discoverable, useful and engaging.
