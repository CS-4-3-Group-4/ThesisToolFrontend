# Thesis Tool Frontend

This repository contains the **frontend interface** for the **Emergency Personnel Allocation system**, developed for our thesis project.
It connects to the backend API to visualize and manage simulations of the **Firefly Algorithm (FA)** and **Extended Firefly Algorithm (EFA)**.

The frontend provides a clean, interactive dashboard for running simulations, viewing convergence curves, analyzing metrics, and exporting results.

> **Note:** This project focuses on visualization and interaction — all computations are handled by the backend.

---

## ✨ Features

- **Interactive Dashboard** – Run and monitor FA and EFA simulations.
- **Convergence Curve Visualization** – Displays fitness improvement over iterations.
- **Performance Metrics** – Shows execution time, best/worst/average fitness, and standard deviation.
- **CSV Export** – Download simulation results directly from the browser.
- **API Integration** – Communicates with the backend running on port **8080**.
- **Responsive UI** – Clean layout built with React, TypeScript, and modern styling.

---

## 👥 Group Members

- Abainza, Rendel
- de Dios, Wendel
- Osana, Lester
- Viado, John Paul

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed:

- **Node.js** (version 18 or higher) → [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** → [Download Git](https://git-scm.com/downloads)

---

### 2. Clone the Repository

```bash
git clone https://github.com/CS-4-3-Group-4/ThesisToolFrontend.git
cd ThesisToolFrontend
```

---

### 3. Create Environment File

Before running the project, set up your environment variables:

```bash
cp .env.example .env
```

Then open the newly created `.env` file and make sure it contains the correct backend API URL:

```env
VITE_BACKEND_URL="http://localhost:8080"
```

If your backend runs on a different host or port, update the value accordingly.

---

### 4. Install Dependencies

```bash
npm install
```

---

### 5. Run the Application

Start the frontend development server:

```bash
npm run dev
```

Then open your browser and visit:

```
http://localhost:5173
```

> ⚠️ Make sure your **backend** is running before testing any API features.

---

### 6. Build for Production

To create an optimized production build:

```bash
npm run build
```

You can preview the built app using:

```bash
npm run preview
```
