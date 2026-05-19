# Shope - Frontend Store

A modern, responsive e-commerce frontend built with vanilla HTML, CSS, and JavaScript, integrated with Firebase for real-time product and user management.

## Project Structure

```
shope/
├── index.html                 (Main landing & product listing page)
├── assets/
│   └── logo.jpg               (Site logo)
├── auth/
│   ├── login.html             (User/seller login)
│   └── register.html          (User/seller signup)
├── css/
│   └── style.css              (Centralized styles for all pages)
├── js/
│   ├── firebase-config.js     (Firebase initialization - local only, ignored by Git)
│   ├── auth.js                (Authentication logic)
│   └── main.js                (Cart, search, and UI management)
└── seller/
    ├── seller.html            (Seller dashboard)
    ├── complete-seller-profile.html (Seller onboarding form)
    └── add-product.html       (Add product to inventory)
```

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shope
```

### 2. Configure Firebase Credentials

The real Firebase configuration is kept local for security.

#### Option A: Use the local config file

```bash
# Linux / macOS
cp js/firebase-config.example.js js/firebase-config.js

# Windows PowerShell
Copy-Item js/firebase-config.example.js js/firebase-config.js
```

Open `js/firebase-config.js` and replace the placeholder values with your Firebase project values:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

#### Option B: Use a `.env`-style reference file

Create a local `.env` file from `.env.example` and fill in your Firebase values.
This file is only a reference for your secrets; the current frontend uses `js/firebase-config.js`.

```bash
cp .env.example .env
```

Then copy the values from `.env` into `js/firebase-config.js`.

⚠️ **Important:** `js/firebase-config.js` is listed in `.gitignore` and should never be committed to Git.

### 3. Run a Local Server

Use Python's built-in HTTP server to serve the frontend:

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

Then open your browser to:

- **Shop**: `http://localhost:8000`
- **Login**: `http://localhost:8000/auth/login.html`
- **Register**: `http://localhost:8000/auth/register.html`
- **Seller Dashboard**: `http://localhost:8000/seller/seller.html`

### Alternative: Use VS Code Live Server Extension

Install the **Live Server** extension in VS Code and right-click `index.html` → "Open with Live Server".

## Key Features

- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Real-time Data**: Firebase Firestore for products and users
- ✅ **Shopping Cart**: Persistent cart using localStorage
- ✅ **Seller Dashboard**: Sellers can add and manage products
- ✅ **Authentication**: Firebase Auth for user login/signup
- ✅ **Multi-language Support**: Arabic, English, Dutch (via Google Translate)
- ✅ **Centralized Styling**: Single `css/style.css` for consistent design
- ✅ **Security**: API keys protected by `.gitignore`

## Development Workflow

### Working on a Feature

1. **Create a branch** from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally on `http://localhost:8000`.

3. **Commit your work**:

   ```bash
   git add .
   git commit -m "Feature: brief description of changes"
   ```

4. **Push to remote**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub targeting `main` for code review.

### Current Branch: `refactor/project-structure`

This branch contains the project restructuring:

- Organized files into logical folders (`auth/`, `css/`, `js/`, `seller/`, `assets/`)
- Centralized CSS (removed all inline styles)
- Centralized Firebase config
- Added `.gitignore` and example config for security

When ready, this branch will be merged to `main` after review.

## Testing

### Smoke Test Checklist

Before committing changes, verify these pages load without errors:

- [ ] `http://localhost:8000` - Main shop page loads products
- [ ] `http://localhost:8000/auth/login.html` - Login form displays correctly
- [ ] `http://localhost:8000/auth/register.html` - Signup form displays correctly
- [ ] `http://localhost:8000/seller/seller.html` - Seller dashboard loads (requires login)
- [ ] `http://localhost:8000/seller/complete-seller-profile.html` - Seller profile form loads
- [ ] Check browser console (F12 → Console) for JavaScript errors
- [ ] Test cart functionality on the main page

### Debugging

1. Open Developer Tools: `F12` or `Right-click → Inspect`
2. Check the **Console** tab for errors
3. Check the **Network** tab to see if Firebase requests are successful
4. Check the **Application/Storage** tab to verify localStorage for cart data

## Firebase Setup

To connect your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database** (in test mode for development)
4. Enable **Authentication** (Email/Password, and optionally Google)
5. Copy your project config from Firebase Console
6. Paste it into `js/firebase-config.js`

### Firestore Collections

The app expects these collections:

- **users** - User profiles with fields: `email`, `role` ("seller" or "customer"), `profileCompleted`, `shopName`
- **products** - Product listings with fields: `title`, `description`, `category`, `price`, `imageUrl`, `sellerId`, `createdAt`

## Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase (Firestore + Authentication)
- **Styling**: Centralized CSS with utility classes
- **RTL Support**: Built-in Arabic language support
- **Icons**: Font Awesome 6
- **Alerts**: SweetAlert2
- **Translation**: Google Translate Widget

## Contributing

1. Follow the development workflow (branches, commits, PRs)
2. Test your changes locally before pushing
3. Keep the code clean and well-commented
4. Use semantic commit messages (e.g., "Fix: ...", "Feature: ...", "Refactor: ...")

## License

Private project. Do not distribute.

## Support

For questions or issues, contact the team or check the issue tracker on GitHub.
