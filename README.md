
# Test Automation Playground

A full-stack website to practice UI, API, auth, file-upload, waits/flakiness, iFrame, Shadow DOM, and accessibility automation.

## Tech Stack
- **Server**: Node.js (Express)
- **Client**: React + Vite

## Quick Start
Prerequisites: Node.js **18+** and npm.

### 1) Start the API server
```bash
cd server
npm install
npm run dev
```
Server runs at: **http://localhost:3001**

### 2) Start the client (in a second terminal)
```bash
cd client
npm install
npm run dev
```
Client runs at: **http://localhost:5173**


### 3) Run tests in playwright-kt folder
```bash
cd playwright-kt
npm install 
npx playwright install
npx playwright test
```

## Pages & Scenarios
- **Home**: Navigation and quick links.
- **Forms**: Complex form validation; posts to `/api/users`.
- **Waits & Flaky**: Elements appear/disappear after random delays; disabled/enabled button; spinner with slow API (`/api/delay`).
- **API Explorer**: Hit endpoints (delay, random error, rate-limit, stream/SSE, users CRUD).
- **Upload**: Multi-file upload with size/extension checks.
- **Auth**: Fake login sets an HTTP-only cookie; protected profile fetch.
- **Table**: Sort/paginate/filter table data from `/api/users`.
- **iFrame**: Interact with embedded iframe content.
- **Shadow DOM**: Custom element rendered with Shadow Root.
- **Accessibility (A11y)**: One broken and one fixed section to test checks.

## Suggested Automation Exercises
- **Web UI** (Playwright/Cypress/Selenium):
  - Wait for button enabling; assert spinner disappears; handle modals & alerts; interact with iframe and shadow DOM; drag & drop; file uploads.
- **API** (Postman/REST Assured):
  - Retry logic on `429` with `Retry-After`; handle random `500`; stream processing via SSE; auth cookie handling.
- **Auth**: Login, store cookie, call `/api/auth/profile`.
- **Accessibility**: Run axe or Lighthouse and fix issues.

---
Happy testing!
