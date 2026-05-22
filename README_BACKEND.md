# Aura Picnic Backend

This backend stores booking orders in a simple JSON file and serves the static website from the same directory.

## How to run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the website:

```text
http://localhost:3000
```

## What it does

- Serves `index.html`, `style.css`, and `script.js` as static files.
- Accepts booking submissions at `POST /api/bookings`.
- Saves bookings to `orders.json`.
- Returns saved bookings from `GET /api/bookings`.
