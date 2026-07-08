# LuxeStore — 3D Animated eCommerce Platform

A modern, visually stunning eCommerce website built with React, Three.js, and Firebase featuring 3D animations, glassmorphism design, and real-time data syncing.

![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Three.js](https://img.shields.io/badge/Three.js-3D-black) ![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-orange) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-cyan)

## ✨ Features

### 🛍️ Customer Features
- **3D Animated Hero Section** — Interactive Three.js scene with floating spheres, rings, and particles
- **Product Catalog** — Full filtering by category, price range, and sorting options
- **3D Product Viewer** — Rotate, zoom, and interact with 3D product models
- **Shopping Cart** — Real-time synced with Firebase, persistent across sessions
- **Wishlist** — Save favorite products with one click
- **Checkout Flow** — Complete order flow with mock payment integration
- **Order History** — Track all past orders with status updates
- **User Authentication** — Login/signup with Firebase Auth
- **Search** — Debounced search across all products
- **Dark/Light Mode** — Toggle between themes

### 🛠️ Admin Panel
- **Dashboard** — Analytics overview with revenue, products, orders stats
- **Product Management** — CRUD operations for products
- **Order Management** — Update order statuses (pending → shipped → delivered)
- **User Management** — View all registered users

### 🎨 Design
- **Glassmorphism UI** — Translucent cards with backdrop blur effects
- **Smooth Animations** — Framer Motion page transitions and micro-interactions
- **Interactive Cursor** — Glow effect that follows mouse movement
- **3D Loading Screen** — Animated morphing sphere while loading
- **Responsive** — Fully adaptive for mobile, tablet, and desktop

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| React 19 + Vite 6 | Frontend framework & build tool |
| Tailwind CSS 4 | Utility-first styling |
| Three.js / React Three Fiber | 3D graphics & animations |
| Framer Motion | Page transitions & micro-interactions |
| Firebase Realtime Database | Backend data storage |
| Firebase Auth | User authentication |
| Zustand | State management |
| React Router 7 | Client-side routing |
| React Hot Toast | Toast notifications |

## 📁 Project Structure

```
src/
├── admin/              # Admin panel pages
│   ├── Dashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AdminOrders.jsx
│   └── AdminUsers.jsx
├── components/         # Reusable UI components
│   ├── CursorGlow.jsx
│   ├── Footer.jsx
│   ├── HeroScene.jsx   # Three.js hero animation
│   ├── Layout.jsx
│   ├── LoadingScreen.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ProductViewer.jsx  # 3D product viewer
├── firebase/           # Firebase configuration
│   ├── config.js       # Firebase init & helpers
│   └── seedData.js     # Sample product data
├── hooks/              # Custom React hooks
│   ├── useCustomHooks.js
│   └── useStore.js     # Zustand stores
├── pages/              # Page components
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Orders.jsx
│   ├── ProductDetail.jsx
│   ├── Products.jsx
│   ├── Register.jsx
│   └── Wishlist.jsx
├── App.jsx             # Root component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles & Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Firebase project with Realtime Database enabled

### 1. Clone & Install

```bash
cd "3D ecomm"
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Realtime Database**
4. Copy your config values
5. Create a `.env` file from the template:

```bash
cp .env.example .env
```

6. Fill in your Firebase credentials in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Database Rules

Set these rules in Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "carts": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "wishlists": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 4. Set Up Admin User

After registering your first user, go to Firebase Console → Realtime Database and change the user's `role` field to `"admin"` to access the admin panel.

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 6. Build for Production

```bash
npm run build
```

## ⚡ Performance Optimizations

- **Lazy Loading** — All page components are lazy-loaded with `React.lazy()`
- **Code Splitting** — Vite automatically splits bundles per route
- **Optimized Images** — Lazy loading via `loading="lazy"` on all images
- **Efficient State** — Zustand for minimal re-renders
- **Real-time Sync** — Firebase listeners for live data updates

## 🎮 3D Features

- **Hero Scene** — Animated floating spheres with distortion materials, particle field, and stars
- **Product Viewer** — Interactive 3D model viewer with orbit controls (zoom, rotate, pan)
- **Loading Screen** — 3D morphing sphere animation

## 📱 Responsive Design

Fully responsive across all breakpoints:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Wide: 1280px+

## 📄 License

MIT
VITE_RAZORPAY_KEY_ID=rzp_test_SeXgahXI6ejmd2