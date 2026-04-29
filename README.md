# 🍳 CookSense - Smart Recipe Discovery App

CookSense is a premium, production-ready recipe discovery application built with React Native. It features a context-aware UI that adapts to the time of day, providing personalized recipe recommendations and a seamless offline-first experience.

## ✨ Key Features

- **🕒 Context-Aware UI**: Dynamic greetings and recipe categories based on meal times (Breakfast, Lunch, Dinner).
- **📶 Offline-First Architecture**: Persistent caching of recipes, search history, and favorites using Redux-Persist & MMKV.
- **🔍 Advanced Search**: Intelligent search engine with recent history persistence and "Popular Categories" discovery.
- **🔔 Proactive Notifications**: Scheduled daily meal reminders and foreground notification handling via Notifee.
- **🎨 Premium UI/UX**: 
  - Custom Lottie-animated splash screen.
  - Smooth transitions using React Native Reanimated.
  - Optimized images with skeleton placeholders.
  - Centralized SVG icon system.
- **📍 Location-Based Content**: Region-specific recipe suggestions based on the user's current location.

## 🛠 Tech Stack

- **Core**: React Native (0.85.2)
- **State Management**: Redux Toolkit (RTK Query)
- **Persistence**: Redux Persist + MMKV (Nitro Storage)
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **Animations**: Lottie, Reanimated 4, Reanimated Layout Animations
- **Notifications**: Notifee
- **Icons & UI**: React Native SVG, Shimmer Placeholders, Linear Gradient
- **Connectivity**: NetInfo (with global offline banner)

## 📁 Project Structure

```text
src/
├── assets/          # Lottie animations, Centralized Icons, Images
├── components/      # Reusable UI components (AppText, RecipeCard, etc.)
├── constant/        # Theme, Colors, and Global Constants
├── context/         # TimeContext & other React Contexts
├── hooks/           # Custom hooks (useTimeContext, useTheme)
├── navigation/      # Stack & Tab Navigators
├── redux/           # Store config, API Slices, and State Slices
├── screens/         # Main screens (Home, Explore, Search, Details)
├── services/        # MMKV Storage, Location, and Notifications
└── utils/           # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 22.11.0)
- React Native CLI
- Android Studio / Xcode

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Metro Bundler:
   ```bash
   npm start -- --reset-cache
   ```
4. Run on Android:
   ```bash
   npx react-native run-android
   ```

## 📦 Build
To generate a production release APK:
```bash
cd android
./gradlew assembleRelease
```

---
Made with ❤️ by the CookSense Team.
