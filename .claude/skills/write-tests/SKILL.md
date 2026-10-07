---
name: write-tests
description: Write tests for this project - Jest unit tests, Supertest + Testcontainers Postgres integration tests, Playwright journeys (allocate, lock, release, bench).
---

# Write tests

- **Unit (Jest):** every validator rule and derived-status case; table-driven; pure functions where possible.
- **Integration (Supertest + Testcontainers Postgres):** real DB, migrations applied, seed minimal fixtures per test. Include a **concurrency test**: two simultaneous allocations that together exceed 100% -> exactly one succeeds.
- **Frontend:** Vitest + Testing Library for components; mock the API at the network layer.
- **E2E (Playwright):** allocate a person (warning needs acknowledgment, error blocks), place/promote/override a lock, release with knowledge transfer, bench -> allocate.
- Test names state behaviour. No snapshot tests for logic. Don't mock the DB in integration tests.
- Run the relevant suite and report real output; never claim passing without running.
