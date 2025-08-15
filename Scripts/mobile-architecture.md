# Mobile App Architecture (Mermaid Syntax)

This file contains a Mermaid.js diagram illustrating the high-level architecture of the `newnails-fe` mobile application.

## Component & Navigation Flow

This diagram shows the relationship between screens, global components, core libraries, and the backend API.

```mermaid
graph TD
    subgraph "User Interaction"
        User(User)
    end

    subgraph "React Navigation"
        StackNavigator["Native Stack Navigator"]
    end

    subgraph "Screens"
        Welcome["WelcomeScreen"]
        Login["LoginScreen"]
        DesignForm["DesignFormScreen"]
        Loading["LoadingScreen"]
        Results["ResultsScreen"]
        MyDesigns["MyDesignsScreen"]
    end

    subgraph "Global Components"
        Header["MainHeader"]
        Footer["Footer"]
    end

    subgraph "Core Libraries"
        Firebase["lib/firebase.ts (Auth)"]
        API["lib/api.ts (Backend Communication)"]
        Paper["React Native Paper (UI)"]
    end
    
    subgraph "Backend"
        BackendAPI["Backend API"]
    end

    %% Connections
    User --> StackNavigator

    StackNavigator -- initial route --> Welcome
    StackNavigator --> Login
    StackNavigator --> DesignForm
    StackNavigator --> Loading
    StackNavigator --> Results
    StackNavigator --> MyDesigns

    Welcome -- "Sign In" --> Login
    Login -- "Auth Logic" --> Firebase
    Firebase -- "User State" --> Welcome
    
    Welcome -- "Is Signed In" --> DesignForm
    DesignForm --> Loading
    Loading -- "Fetches Fun Facts" --> API
    DesignForm -- "Generate" --> API
    API --> BackendAPI
    
    API -- "Gets Results" --> Results
    Results -- "Save Design" --> API
    
    Header -- "Menu" --> MyDesigns
    MyDesigns -- "Fetch/Delete/Favorite" --> API

    %% Global Component Usage
    DesignForm -- uses --> Header
    DesignForm -- uses --> Footer
    Results -- uses --> Header
    Results -- uses --> Footer
    MyDesigns -- uses --> Header
    MyDesigns -- uses --> Footer

    %% Library Usage
    Screens -- "use UI components from" --> Paper
    
```
