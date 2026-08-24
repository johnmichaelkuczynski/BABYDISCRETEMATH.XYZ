---
name: Public access with no login
description: The course intentionally has no authentication while retaining all course, diagnostic, administrative, and visitor analytics functionality.
---

# Authentication is intentionally absent

Do not add, restore, or assume a login gate. Every page, API route, diagnostic, grading flow, administrative tool, and analytics view must remain usable by any visitor without a session.

**Why:** The user explicitly removed the current login system so a different system can be created later, and required that removing login must not reduce or alter any other functionality.

**How to apply:** Keep anonymous visitor recording and database-backed visit counts, graphs, and logs operational. Treat any future authentication system as a separate, explicitly requested project-wide change.
