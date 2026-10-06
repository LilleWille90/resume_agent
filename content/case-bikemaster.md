# Case: BikeMaster - privacy-conscious cycling intelligence

## Problem

Cycling apps often record a lot of data but offer limited help turning repeated rides into understandable, actionable feedback. A useful experience also has to work reliably during a ride and respect the sensitivity of route, health and sensor data.

## Mattias' role

Founder and product builder. Mattias shapes the product concept, interaction model, technical direction and validation approach while building the iPhone and Apple Watch experience.

## How AI is used

AI is used as a development partner for exploration, implementation and documentation. The product also explores an optional, explanation-focused Ask BikeMaster experience: it is designed to answer from a small, structured fact pack rather than sending raw GPS traces, telemetry or route names by default.

## Technical approach

- Native SwiftUI app with iPhone and Apple Watch components
- Local-first ride recording, sensor support, route recognition and derived insights
- Deterministic calculations and bounded data models for core ride behaviour
- Explicit consent, minimal data sharing and a separate AI boundary for any future online explanation feature
- Automated tests and documented architecture/decision records to protect reliability as the product evolves

## Outcome and learning

BikeMaster is an active beta project. The work demonstrates how product ambition can coexist with reliability, privacy and governance from the start. The key learning is that AI explanations are most useful when grounded in curated, comprehensible facts - not when a model is given unrestricted access to personal data.
