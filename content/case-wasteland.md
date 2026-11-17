# Case: Wasteland Racer (desktop game)

Wasteland Racer is Mattias' first computer game: a single-player 3D driving game for the desktop, built in Godot. It is a personal hobby project, not a commercial product. A playable build can be shown on request; a short video of one run is on the portfolio.

## The game
The player drives a heavy oil tanker on a 3.7 km point-to-point convoy route through a red desert wasteland: along a canyon rim road, across a bridge and on to the delivery point. Rocket turrets and raiders attack along the way. The goal is to get the oil through. At the end a results screen shows the run time, the tanker's remaining health and the "worst moment" (the lowest health during the run). In the recorded run the delivery took 2 minutes 19 seconds.

Design choices:
- Inspired by the late-90s racer Ignition (high chase camera, small arcade vehicles) and by 90s post-apocalyptic strategy games for the setting.
- Point-to-point journey instead of laps.
- Damage reduces the tanker's top speed but never stops it, so every run can be finished; the challenge is driving well.
- Rocket turrets aim ahead of the tanker (they lead the shot), and a ground marker shows where a rocket will land shortly before impact, so dodging is a skill rather than luck.
- Radio lines from the crew give the run a story without cutscenes.

Controls: keyboard driving; aim with the mouse and fire with the left mouse button or F; Q switches weapon, E looks back, R uses the radio and T toggles headlights.

## How it was built
- Mattias came up with the game, set the scope, decided how it should feel and playtested each version. He describes himself as a beginner coder; AI wrote the GDScript code from his descriptions and his feedback after each test drive, explained the engine and fixed bugs.
- Engine: Godot 4 (Standard edition, GDScript) with the Forward+ renderer and Jolt Physics, developed on macOS. Godot can export the same project to Windows and Linux.
- 3D models were generated with Meshy's text-to-3D tool and reduced to about 3,000 polygons each. Music and sound effects were prepared by Mattias.

## What he learned
Game feel only appears when you play: camera angle, a warning before a rocket lands and short radio lines matter more than adding features. Cutting scope early (one route, one vehicle, one faction) is what made a first game finishable.
