# Mobile App Sequence Diagram (Mermaid Syntax)

This file contains a Mermaid.js sequence diagram detailing the primary user flow for generating a nail design in the `newnails-fe` mobile app.

## User Flow: From Login to Viewing Results

```mermaid
sequenceDiagram
    participant User
    participant App as "Mobile App (UI)"
    participant Nav as "React Navigation"
    participant Auth as "Firebase Auth"
    participant API as "lib/api.ts"
    participant Backend

    User->>+App: Opens App
    App->>+Nav: Navigate to WelcomeScreen
    Nav-->>-App: Shows WelcomeScreen
    App-->>-User: "Start" button is disabled

    User->>+App: Clicks "Login"
    App->>+Auth: Initiate Sign-In
    Auth-->>-App: User is signed in
    App-->>User: "Start" button is now enabled

    User->>+App: Clicks "Start"
    App->>+Nav: Navigate to DesignFormScreen
    Nav-->>-App: Shows DesignFormScreen
    
    User->>App: Fills out design form (selects length, shape, etc.)
    User->>+App: Clicks "Impress Me"

    App->>+Nav: Navigate to LoadingScreen
    Nav-->>-App: Shows LoadingScreen with animations
    
    App->>+API: generateDesigns(selections)
    API->>+Backend: POST /api/generate
    
    activate App
    App->>+API: getRandomFunFact()
    API->>+Backend: GET /api/fun-facts/random
    Backend-->>-API: Returns fun fact
    API-->>-App: Displays fun fact
    deactivate App
    
    Backend-->>-API: Returns generated image URLs
    API-->>-App: Receives image data
    
    App->>+Nav: Navigate to ResultsScreen (with images)
    Nav-->>-App: Shows ResultsScreen
    App-->>-User: Displays generated nail designs
    
```
