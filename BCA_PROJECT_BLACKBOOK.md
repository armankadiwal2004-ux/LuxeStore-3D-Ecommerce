# BCA Project Blackbook

## Project Title
LuxeStore: 3D Animated eCommerce Platform

## 1. Introduction
LuxeStore is a modern web-based eCommerce application designed to provide an engaging shopping experience with 3D visuals, smooth animations, and real-time data syncing. The project combines standard online shopping features with interactive graphics to improve user engagement and overall usability.

This project is suitable for BCA final year submission because it demonstrates practical implementation of frontend development, state management, cloud backend integration, authentication, and admin-level management features in a single full-stack style application.

## 2. Problem Statement
Traditional eCommerce websites often provide only static product browsing and basic cart functionality. Users now expect a richer and more interactive shopping experience. There is a need for a platform that offers:

- Interactive product visualization
- Real-time data updates
- Secure authentication and order handling
- Role-based admin controls for store management

## 3. Project Objectives
- Build a responsive eCommerce platform using modern web technologies.
- Integrate 3D elements for better visual interaction.
- Implement user authentication and profile-based access.
- Provide cart, wishlist, checkout, and order tracking modules.
- Create a dedicated admin panel for products, categories, orders, users, and analytics.
- Maintain clean architecture and scalable code structure.

## 4. Scope of the Project
### In Scope
- Customer-side shopping flow
- Admin panel operations
- Real-time data sync using Firebase
- 3D hero and product viewing components
- State management for app-wide data

### Out of Scope
- Native mobile app
- Advanced payment settlement and invoice accounting
- AI recommendation engine

## 5. Technology Stack Used
### Frontend
- React 19
- Vite 8
- React Router DOM 7
- Tailwind CSS 4
- Framer Motion
- React Icons
- React Hot Toast

### 3D and Animation
- Three.js
- @react-three/fiber
- @react-three/drei

### State Management and Utilities
- Zustand
- Lodash

### Backend Services
- Firebase Realtime Database
- Firebase Authentication

### Payment Integration
- Razorpay (integration-ready package)

### Development and Quality Tools
- ESLint
- Vite Plugin React

## 6. Key Features
### 6.1 Customer Features
- Home page with animated 3D hero scene
- Product listing with filters and sorting
- Product detail page with rich visual display
- Cart management with quantity updates
- Wishlist add/remove functionality
- Checkout and order placement workflow
- Order history and status tracking
- Login and registration using Firebase Auth
- Debounced product search for better performance
- Theme-friendly modern UI with responsive layout

### 6.2 Admin Features
- Admin dashboard overview
- Product management
- Category management
- Order management
- User management
- Analytics and settings sections

## 7. Major Modules
1. Authentication Module
- Handles registration, login, and auth state persistence.

2. Product Module
- Loads products and categories from database and displays them on product pages.

3. Cart Module
- Supports add to cart, remove, quantity update, and user-based persistence.

4. Wishlist Module
- Allows users to save favorite products.

5. Checkout and Order Module
- Places orders and stores order information with user linkage.

6. Admin Module
- Provides restricted routes and management interfaces for operational control.

7. 3D Experience Module
- Includes hero scene, loading visuals, and product viewer interactions.

## 8. Routing and Navigation Structure
### User Routes
- /
- /products
- /product/:id
- /cart
- /wishlist
- /checkout
- /orders
- /login
- /register

### Admin Routes
- /admin
- /admin/products
- /admin/categories
- /admin/orders
- /admin/users
- /admin/analytics
- /admin/settings

## 9. Project Folder Structure (Summary)
- src/pages: user-facing pages
- src/admin: admin panel pages
- src/components: reusable UI and 3D components
- src/firebase: configuration and seed/data helpers
- src/hooks: custom hooks and Zustand store logic

## 10. Functional Requirements
- User can create account and login.
- User can browse products and view details.
- User can manage cart and wishlist.
- User can place orders and view order history.
- Admin can manage products, categories, users, and orders.
- Data should update in real time for active sessions.

## 11. Non-Functional Requirements
- Responsive design for mobile, tablet, and desktop.
- Fast loading using code splitting and lazy loading.
- Reliable user session handling.
- Scalable module-based code structure.
- Usable and visually appealing interface.

## 12. Software and Hardware Requirements
### Software Requirements
- Node.js (18 or above recommended)
- npm
- Firebase project setup
- Modern web browser (Chrome/Edge/Firefox)
- Code editor (VS Code)

### Hardware Requirements
- Processor: Dual-core or above
- RAM: 4 GB minimum (8 GB recommended)
- Storage: 1 GB free space
- Internet connection for Firebase services

## 13. Working Principle
1. User opens the application and views product catalog.
2. Product and category data are fetched from Firebase.
3. User authentication determines access to personal modules.
4. Cart, wishlist, and orders are synced with user ID.
5. Admin accesses protected admin routes for management operations.
6. Zustand stores maintain global state for smooth UI updates.

## 14. Security Considerations
- Firebase Authentication for user identity.
- Role-based access model for admin actions.
- Database rules can restrict read/write paths by user role and UID.
- Sensitive keys should be placed in environment variables.

## 15. Testing Strategy (Suggested)
- Unit testing for store functions and utility logic.
- UI testing for key pages (products, cart, checkout).
- Authentication flow validation.
- Route protection testing for admin modules.
- Responsive testing across device breakpoints.

## 16. Future Enhancements
- Full payment workflow with verified backend order signature.
- Inventory alerts and stock forecasting.
- Product recommendations based on behavior.
- Coupon and offer engine.
- Email/SMS notifications for order lifecycle.
- PWA support for app-like experience.

## 17. Conclusion
LuxeStore successfully demonstrates how modern web technologies can be combined to build an interactive and scalable eCommerce platform. The project includes real-world modules such as authentication, product management, cart, checkout, order tracking, and admin operations, while also introducing 3D visuals for an enhanced user experience. This makes it a strong and practical BCA project suitable for blackbook documentation and academic presentation.

## 18. Quick Commands
- Install dependencies: npm install
- Run development server: npm run dev
- Build production bundle: npm run build
- Run lint: npm run lint

## 19. Declaration (Editable)
This project report is submitted as part of the BCA curriculum. The work presented in this blackbook is developed and documented for academic purposes.

---
Prepared for BCA Blackbook Submission
