# 💅 Tipsy: The AI Nail Art Studio (Mobile App)

Welcome to the **Tipsy** mobile app! This is a cross-platform application built with Expo (React Native) that allows users to design, generate, and save unique AI-powered nail art.

---

### ✨ Core Technologies

-   **Framework**: ⚛️ Expo (React Native)
-   **Language**: 🔵 TypeScript
-   **UI Library**: 🎨 React Native Paper
-   **Navigation**: 🧭 React Navigation (Native Stack)
-   **Authentication**: 🔥 Firebase Authentication
-   **Animations**: ✨ Moti & Reanimated

---

### 🚀 Key Features

-   **Seamless Authentication**: Simple and secure login/signup flow powered by Firebase.
-   **Guided Design Form**: An intuitive, multi-step process for users to select nail length, shape, style, and color.
-   **Engaging Loading Experience**: While the AI generates designs, users see a beautiful loading screen with floating star animations and fun facts.
-   **Results Gallery**: Displays the generated images in a clean, card-based layout.
-   **Personal Collection**: A dedicated "My Designs" screen where users can view, favorite, and manage their saved creations.

---

### 📱 Screen Flow

The app uses a simple, linear navigation flow to guide the user:

1.  **Welcome Screen**: The entry point of the app.
2.  **Design Form**: A step-by-step form to create a design brief.
3.  **Loading Screen**: Appears while the backend generates images.
4.  **Results Screen**: Displays the AI-generated nail art.
5.  **My Designs**: Accessible from the header menu, this screen shows all user-saved designs.

---

### 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd newnails-fe
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    -   Create a `.env` file in the root directory.
    -   Add the following required variables:
        ```env
        # The public URL of your deployed backend API
        EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"

        # Your Firebase project's public web API key
        EXPO_PUBLIC_FIREBASE_API_KEY="..."
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
        EXPO_PUBLIC_FIREBASE_PROJECT_ID="..."
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
        EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
        EXPO_PUBLIC_FIREBASE_APP_ID="..."
        ```
4.  **Run the application:**
    ```bash
    npx expo start
    ```
    Scan the QR code with the Expo Go app on your iOS or Android device.

---

### 🖼️ Screenshots

*(Placeholders for screenshots of the app's UI)*

| Welcome Screen | Design Form | Results Screen |
| :------------: | :---------: | :------------: |
| `[----------]` | `[-------]` | `[----------]` |
| `[   IMG    ]` | `[  IMG  ]` | `[   IMG    ]` |
| `[----------]` | `[-------]` | `[----------]` |
