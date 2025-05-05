# User Tour Implementation

## Overview

The User Tour is an interactive onboarding feature that guides new users through the Multinex platform. It uses React Joyride to create a step-by-step tour that highlights key features and functionality.

## Architecture

The tour implementation follows these key principles:

1. **Single Instance**: The tour is rendered once in the DefaultLayout component to prevent duplicate instances.
2. **State Management**: Tour state is managed through the `useTour` hook, which provides functions for starting, stopping, and navigating through the tour.
3. **Persistence**: Tour progress is saved to localStorage to allow users to resume where they left off.
4. **Automatic Navigation**: The tour automatically navigates between different pages as needed.
5. **Error Recovery**: If a target element isn't found, the tour includes logic to retry or gracefully recover.

## Components

### UserTour Component

Located at `/app/src/client/components/UserTour.tsx`, this is the main component that renders the tour. It:

- Verifies that target elements exist before showing steps
- Handles navigation between pages
- Manages tour callback events
- Updates the user's tour completion status

### useTour Hook

Located at `/app/src/client/hooks/useTour.ts`, this custom hook:

- Manages tour state (running, current step)
- Provides functions to control the tour (start, stop, reset)
- Automatically starts the tour for new users
- Persists tour state in localStorage

### Tour Steps

Tour steps are defined in `/app/src/shared/constants/tour.tsx`. Each step includes:

- A target element selector
- Content to display
- Placement options
- Interaction settings (clickable, etc.)

## User Flow

1. When a new user logs in, the tour automatically starts
2. The tour guides the user through:
   - The home page / learning portal
   - Course structure
   - Course sections
   - Exercises
3. Users can navigate forward/backward, or skip the tour
4. When completed, the user's profile is updated to mark the tour as complete

## Tour Steps

| Step | Target | Description | Page |
|------|--------|-------------|------|
| 1 | `body` | Welcome message | Any page |
| 2 | `.tour-step-1` | Introduction to courses | Portal page |
| 3 | `.tour-step-2` | Course sections explanation | Course page |
| 4 | `.tour-step-3` | Section content overview | Course page |
| 5 | `.tour-exercise-card` | Exercise introduction | Course page |

## CSS Classes

The following CSS classes are used to target elements in the tour:

- `.tour-step-1`: Applied to the courses tab in the portal
- `.tour-step-2`: Applied to the "Add New Section" button on the course page
- `.tour-step-3`: Applied to the first section in a course
- `.tour-exercise-card`: Applied to the first exercise card in a section

## Styling

Tour styles are defined in the `JOYRIDE_STYLES` object in the tour constants file. The styles adapt to the user's color mode preference (light/dark). 