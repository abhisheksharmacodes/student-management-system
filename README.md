# Student Management System

A modern, customizable web platform for student management, built with React, TypeScript, Material UI, Firebase, and Vite. Features a responsive dashboard, student records management, analytics, authentication, product/course catalog, and more—ideal for schools and educational institutions.

---

## 🚀 Features

- 🎓 **Student Management:** Add, view, and organize student records with detailed profiles.
- 🔐 **Authentication:** Secure sign-in for users (Firebase Auth).
- 🖥️ **Responsive, Customizable UI:** Built with Material UI and Vite for fast, flexible development.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Material UI, Vite
- **State & Forms:** React state, React Hook Form
- **Backend/Database:** Firebase (Firestore, Auth)
- **Charts:** ApexCharts, react-apexcharts
- **Styling:** Material UI, custom CSS
- **Deployment:** Vercel, Netlify, or any static host supporting Vite

---

## 📁 Folder Structure

```
/Madrocket
  /public           # Static assets (images, icons, illustrations)
  /src              # Main app (components, pages, sections, layouts, theme, utils)
    /components     # Reusable UI components
    /layouts        # App layout and navigation
    /pages          # Route-based pages (dashboard, students, products, blog, sign-in, etc.)
    /sections       # Feature sections (overview, user, product, blog, auth, error)
    /theme          # Theme, palette, and style utilities
    /utils          # Utility functions
    firebase-config.ts # Firebase setup
    app.tsx, main.tsx  # App entry points
  package.json      # Project dependencies
  README.md         # Project documentation
  ...
```

---

## 🏁 How to Run Locally

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/abhisheksharmacodes/student-management-system.git
cd Madrocket

# Install dependencies
yarn install # or npm install
```

### 2. Start the Development Server
```bash
yarn dev # or npm run dev
```

- App will be available at [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## 📦 Deployment

- Deploy to [Vercel](https://vercel.com), [Netlify](https://www.netlify.com/), or any platform supporting static Vite builds.
- Set any required environment variables (e.g., for Firebase config) in your deployment environment.

---

## 📝 Customization

- **Content:** Edit files in `/src/pages` and `/src/sections` for main content, features, and UI.
- **Images & Assets:** Place images and icons in `/public`.
- **Theme:** Adjust Material UI theme in `/src/theme`.
- **Firebase:** Update Firebase config in `src/firebase-config.ts` as needed.

---

## 🤝 Credits

> Built with [React](https://react.dev), [TypeScript](https://www.typescriptlang.org/), [Material UI](https://mui.com/), [Firebase](https://firebase.google.com/), [Vite](https://vitejs.dev/), and ❤️ for education.
