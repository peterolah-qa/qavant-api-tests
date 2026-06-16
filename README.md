# qavant-api-tests
[![API Tests](https://github.com/peterolah-qa/qavant-api-tests/actions/workflows/api-tests.yml/badge.svg)](https://github.com/peterolah-qa/qavant-api-tests/actions/workflows/api-tests.yml)
📊 **[Live API report →](https://peterolah-qa.github.io/qavant-api-tests/)**

REST API test suite (**Postman** collection, runnable headless with **Newman**) by Peter — Qavant.

Two layers in one collection:

1. **Functional REST testing** (folders 1–4) against
   [restful-booker](https://restful-booker.herokuapp.com) — a public practice API with
   authentication, full CRUD, and *deliberate bugs*. The collection exercises the whole
   lifecycle and **documents the API's quirks** instead of hiding them.
2. **Production contract** (folder 5) against the live **[qavant.dev](https://qavant.dev)** —
   status codes, security headers and cache policy. This is the HTTP layer beneath the
   [Playwright UI suite](https://github.com/peterolah-qa/qavant-tests).

## What it checks

| Folder | Coverage |
|--------|----------|
| 1 · Health | `GET /ping` is up, responds under 2s. |
| 2 · Auth | `POST /auth` returns a token; token is stored and reused downstream. |
| 3 · CRUD (chained) | Create → Read → Update (PUT) → Patch → Delete → verify 404. Status codes, **JSON-schema validation**, response-time and data-echo assertions. Variables chain the booking id between requests. |
| 4 · Negative & known issues | Unauthenticated delete is rejected; missing ids return 404. |
| 5 · Production contract | `qavant.dev` returns 200 + HTML, **HSTS / X-Frame-Options / nosniff** headers present, unknown paths 404, fonts served with a long-lived cache header. |

### Documented quirks (a feature, not an oversight)

restful-booker is intentionally buggy. Rather than assert "wrong" behaviour silently, the
tests pin the *actual* behaviour and flag the conventional expectation in an inline `// NOTE`:

- create returns **200** (201 would be conventional);
- delete returns **201** (200/204 would be conventional);
- auth is accepted only via the **`Cookie`** header, not `Authorization`.

Surfacing these is the job — a QA engineer reports the gap between *is* and *should be*.

## Run it

**In Postman:** import `qavant-api-tests.postman_collection.json` and
`restful-booker.postman_environment.json`, then Run the collection.

**Headless (Newman):**

```bash
npm install -g newman newman-reporter-htmlextra
npm test            # CLI output
npm run test:report # also writes newman-report.html
```

## CI

`.github/workflows/api-tests.yml` runs the collection on every push/PR to `main` and on a
daily schedule, uploading the HTML report as an artifact — the API-layer quality gate.

## Stack

Postman Collection v2.1 · Newman · newman-reporter-htmlextra · GitHub Actions

---

Built and maintained by **Peter** · [qavant.dev](https://qavant.dev)
