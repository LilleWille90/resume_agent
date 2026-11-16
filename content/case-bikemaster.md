# Case: BikerBrain - local-first cycling intelligence for iPhone

BikerBrain is the current name; BikeMaster (Bikemaster) is the earlier project name.
Status: active beta (version 1.2) for iPhone, with Live Activity support; an earlier version also had a working Apple Watch companion. A project walkthrough is available on request. A clickable design prototype also exists.

## Problem

Cycling apps record a lot of data but give limited help turning rides into understandable feedback, and estimates such as power are often presented as more precise than they are. BikerBrain explores how GPS, barometer and motion data, Bluetooth sensors, weather and route intelligence can become trustworthy ride insights, including estimated power, without requiring a power meter, an account or a subscription.

## Mattias' role

Founder and product builder. Mattias leads the product concept, interaction model, technical direction and validation approach, and builds the app hands-on with AI coding agents: sensor integration, diagnostics, ride analysis and comparison with recordings from other cycling systems.

## How AI is used

AI is how the product gets built: AI coding agents support implementation, debugging, testing and documentation, and independent AI reviews are used to challenge findings. The app's core calculations are deliberately not AI: power and ride calculations are deterministic and testable. Any future AI explanation layer would receive minimal, curated facts rather than raw telemetry.

## Product decisions

- Keep the measurement core understandable and testable, and separate calculated signals from explanatory features.
- Local first: "Ride locally. Learn locally. Sync what is valuable. Upload only what is necessary." Recording, sensors and analysis work without a network connection.
- Power is presented as an estimate. Heart rate never influences the power estimate, and a real power meter is used only as an independent reference to validate the model.

## Technical detail

- Platform: native iPhone app in Swift and SwiftUI, with Combine, Swift Charts, MapKit and ActivityKit (Live Activity on the Lock Screen). Layered architecture: SwiftUI features, platform services, and a pure deterministic domain layer with no UI, Bluetooth, storage or network dependencies.
- Sensors: Core Bluetooth with standard Bluetooth LE profiles: speed and cadence (Cycling Speed and Cadence, service 0x1816), heart rate (0x180D) and a rear radar light that detects vehicles approaching from behind. Heart rate can also come from AirPods Pro 3 through HealthKit. A Cycling Power meter (0x1818) is read only as an independent reference and never feeds the estimate. Core Location provides GPS and Core Motion provides barometric altitude and motion data. Guided onboarding helps riders mount, pair and verify speed and cadence sensors.
- Real sensors, many brands: BikerBrain has been field-tested with sensors from several manufacturers, not only in the simulator. Speed and cadence sensors from four different brands have been tested and all work. CYCPLUS hardware has been tested across the board: the CYCPLUS L7 radar light, the CYCPLUS H1 heart-rate strap and CYCPLUS speed and cadence sensors.
- Live Activity and Apple Watch: a Live Activity (ActivityKit) keeps the current ride on the iPhone Lock Screen while the phone is locked. An earlier version had a working Apple Watch companion that ran the workout and mirrored live heart rate to the phone; beta 1.2 focuses on the iPhone app.
- Power model: a deterministic physics model of gravity (climbing), rolling resistance, aerodynamic drag and acceleration, using rider and bike mass from versioned bike profiles. The model is under a "model freeze": changes require evidence from replayed real rides and regression tests.
- Weather and routes: Apple WeatherKit, with MET Norway's Locationforecast API as an alternative provider, supplies temperature and pressure for air density; wind is evaluated separately. GPX import, on-device route recognition, learned route segments and same-route comparisons; optional elevation data from MapTiler.
- Data and export: a versioned CSV export contract with JSONL diagnostic sidecars, and a native FIT file encoder. Ride data stays on the phone by default, using iOS Data Protection, with credentials in the Keychain. Prepared but not switched on: Strava upload through a server-side OAuth gateway (tokens never stored on the phone), and a Supabase account layer with Sign in with Apple as a future sync boundary.
- Quality: about 600 automated tests (Swift Testing and XCTest) and 48 architecture decision records (ADRs). Power estimates are compared with power-meter recordings through reproducible ride replays and agreement reports.


## Go-to-market prototype

Sales page prototype: https://bikemaster.lovable.app/store

Mattias built a sales page prototype in Lovable to test how BikerBrain could be positioned and sold. It presents BikerBrain as "power training without a power meter": estimated power that always shows its confidence, route intelligence that learns recurring red lights, climbs and weather, and a comparison with buying a dedicated power meter. It sketches a free GPS-only tier and a Plus subscription (about $5 per month) for full route intelligence, and recommends ride-tested CYCPLUS speed, cadence, heart-rate and radar sensors. It is a prototype for exploring positioning and pricing; the app itself is in beta and not yet on sale. The CYCPLUS partnership and the BIKERBRAIN20 discount code shown on that page are hypothetical, part of the go-to-market exploration; there is no agreement with CYCPLUS. The CYCPLUS sensors themselves have genuinely been ride-tested with the app.

## Outcome and learning

BikerBrain is an active beta project and an example of what a solo product builder can do with AI-assisted development. The key learning: getting a feature to run is only the beginning. Physical sensors, noisy data and real rides expose assumptions that a convincing prototype can hide, so rapid experimentation must be paired with reliable, testable foundations.
