# Changelog

## Current branch: feat/refactor-separate-assets

This branch contains the frontend refactor that separates HTML, CSS, and JavaScript into clearly organized files and removes inline secrets.

### Summary of changes

- Refactored page structure to move inline JavaScript and inline CSS into dedicated files.
- Centralized visual styling into `css/style.css`.
- Added page-specific scripts:
  - `js/index.js`
  - `js/auth.js`
  - `js/seller.js`
  - `js/complete-seller-profile.js`
  - `js/main.js`
- Centralized Firebase initialization into `js/firebase-config.js` and added `js/firebase-config.example.js`.
- Added `.env.example` as a template for local secret storage.
- Updated `README.md` with secure local setup instructions and `js/firebase-config.js` guidance.
- Untracked local `js/firebase-config.js` to protect secret keys from being committed.

### Important notes

- `js/firebase-config.js` is intentionally ignored by Git and should be copied from `js/firebase-config.example.js`.
- Use `.env.example` as a reference only; the frontend currently depends on `js/firebase-config.js`.

### Recent commits

- `fix: untrack local firebase config and add env/template instructions`
- `refactor: separate HTML/CSS/JS, centralize styles, move firebase config, add seller CSS link`
- `readme file added`
- `Refactor: finalize project structure, centralize CSS, protect Firebase config, and add README`
- `refactor code and implement new file structure`
