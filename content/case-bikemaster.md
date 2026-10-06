# Case: BikeMaster - AI-assisted connected cycling intelligence

## Problem

Cycling apps often record a lot of data but offer limited help turning repeated rides into understandable, actionable feedback. BikeMaster explores how GPS, IMU and sensor signals, weather and route intelligence can become a connected experience that helps riders understand their rides.

## Mattias' role

Founder and product builder. Mattias shapes the product concept, interaction model, technical direction and validation approach while rapidly building the iPhone and Apple Watch experience.

## How AI is used

AI is part of how the product gets built: AI coding agents and AI-assisted design, implementation, testing and documentation shorten the loop from product idea to working iOS/watchOS feature. BikeMaster also explores an optional explanation layer that can turn curated ride insights into useful, human-readable answers. The core power and ride calculations remain deterministic; the AI exploration is about explanation and insight, not misrepresenting the underlying model.

## Technical approach

- Native SwiftUI app with iPhone and Apple Watch components
- Local-first ride recording, GPS, IMU and sensor support, weather inputs, route recognition and derived insights
- Deterministic calculations and bounded data models for core ride behaviour, combined with exploration of AI-based explanations
- AI-assisted coding, design, testing and documentation as a product-development workflow
- Explicit consent, minimal data sharing and a separate AI boundary for any future online explanation feature
- Automated tests and documented architecture/decision records to protect reliability as the product evolves

## Outcome and learning

BikeMaster is an active beta project and an example of the leverage available to a solo product builder: modern APIs and AI-assisted workflows make it possible to create a sophisticated connected-product experience that would previously have been harder to take beyond an idea. The key learning is to pair rapid experimentation with reliable foundations: AI explanations are most useful when grounded in curated, comprehensible facts, with privacy boundaries kept appropriate to the product.
