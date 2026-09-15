# Navigation contract — M-T440-V1

**Changed:** 2026-09-12

- `/` is the landing route; `/explainer/` is the how-it-works route.
- Both routes accept `?lang=en|nl&market=NL|BE|DE|DK`.
- On a language change, retain the current valid `market` query value.
- On a market change, retain the current valid `lang` query value.
- Invalid or missing values may default to `en` and `NL` respectively, but defaults must be written back consistently.
- The route link between landing and explainer must carry both values.

This is a contract for implementation and readback; it is not evidence that the current JavaScript satisfies it.
