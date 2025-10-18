# Helping Hand - Hand Gesture Recognition App

## Overview
This is a React application that recognizes ASL (American Sign Language) hand gestures using MediaPipe's hand tracking technology. The app detects specific ASL letters (A, I, L, V, Y) and can communicate with an Arduino robot via the Web Serial API.

**Project Type:** Create React App (React 19.2.0)  
**Last Updated:** October 18, 2025  
**Current State:** Freshly imported from GitHub, configured for Replit environment

## Project Architecture

### Tech Stack
- **Frontend Framework:** React 19.2.0 with Create React App
- **Hand Tracking:** MediaPipe Hands library
- **Hardware Communication:** Web Serial API for Arduino communication
- **Build Tool:** react-scripts (Create React App)

### Project Structure
```
src/
  ├── components/     # UI components (VideoCanvas, ControlPanel, StatusDisplay, etc.)
  ├── hooks/          # Custom React hooks (useHandTracking, useWebSerial)
  ├── utils/          # Utility functions (geometry, handClassifier)
  └── App.js          # Main application component
public/               # Static assets
```

### Key Features
- Real-time hand gesture recognition using camera
- ASL letter detection (A, I, L, V, Y)
- Visual feedback with confirmation counter
- Arduino robot control via USB serial connection
- Debug metrics panel for development

## Development Setup

### Running the App
The app runs on port 5000 and is configured to work with Replit's proxy environment.

**Start Command:** `npm start` (configured in workflow)

### Environment Configuration
- **Port:** 5000 (required for Replit)
- **Host:** 0.0.0.0 (binds to all interfaces)
- **Host Check:** Disabled for Replit proxy compatibility

### Dependencies
All dependencies are managed via npm and listed in package.json. Key dependencies include:
- @mediapipe/hands and @mediapipe/camera_utils for hand tracking
- React 19.2.0 for the UI framework
- react-scripts 5.0.1 for build tooling

## User Preferences
None documented yet.

## Recent Changes
- **Oct 18, 2025:** Initial import from GitHub and Replit environment setup
  - Configured dev server for port 5000 and host 0.0.0.0
  - Set up workflow for frontend development server
  - Configured deployment settings for production
