# Case: Wavemap - an interactive 3D atlas of music (formerly Hip-hop Atlas)

Public link: https://hip-hop-atlas-inklands.lovable.app
Wavemap was formerly called Hip-hop Atlas (Hip Hop Atlas).
Status: live interactive web project.

## Problem

Music history is usually explored through lists, search boxes and articles. Wavemap explores how a map can invite discovery instead: an interactive 3D world map where cities, artists, places and eras appear over time, so geography and context become a way into the music. It began as Hip-hop Atlas (hip hop history from the Bronx in 1973 to today). The Wavemap front page now opens maps for hip hop, rock and electronic music.

## Mattias' role

Product owner and builder. Mattias shapes the product concept, exploration experience, content rules and visual direction, and builds and iterates on the map, artist information and generated assets with AI-assisted development (Lovable and AI coding agents).

## How AI is used

AI is part of the building and design workflow (Lovable, AI coding agents) and of asset production: 3D models and sound effects are generated with AI services. Historical content is sourced, not generated: every claim carries its sources and contested claims are labelled.

## Product decisions

- Let location be part of the interface: connecting artists to places and eras turns navigation into discovery.
- Content is data: a new city, artist, place or era is added as typed data, never by rebuilding the map code.
- Music plays only when the visitor explicitly chooses a track; the map never controls the music.
- Respect real events: tragedies are represented respectfully, and stronger event sounds are opt-in.

## Technical detail

- Stack: TanStack Start (React with server rendering and file-based routes) in TypeScript, MapLibre GL for the map, three.js and React Three Fiber for 3D, Tailwind and Radix UI. Built with Lovable and synced from GitHub; tested with Vitest.
- Map and world: Natural Earth shaded relief and NOAA ETOPO elevation, processed by a Python build script into bundled terrain, borders and labels, so there are no third-party map tiles. The 3D cities, artist figures and event props are drawn in a MapLibre custom layer with three.js; each city's look is generated from its skyline data. Night and day modes.
- Content model: typed data for scenes, about 150 artist cards (unlocked at their breakout year), places, eras and sounds, organised in genre packs (hip hop, rock, electronic).
- Generated assets: 3D landmarks, props and figures from Meshy's text-to-3D API, optimised with glTF-Transform (Meshopt compression, WebP textures). Sound effects from the ElevenLabs sound-effects API, loudness-normalised with ffmpeg; anything missing falls back to synthesised Web Audio. Only original generated or synthesised sounds are used, never samples.
- Music: 30-second previews are looked up at runtime from Apple's public iTunes Search API; nothing is stored.
- Accessibility: all motion respects the reduced-motion preference.

## Outcome and learning

A rich visual world needs clear interactions. The challenge is balancing atmosphere, readable information and navigation that makes sense, while keeping historical claims sourced and fair.
