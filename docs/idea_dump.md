# Fitness Tracker App - Structured Product Overview

## Project Overview
A cross-platform fitness tracking application built with React Native and Expo for iOS and Android, featuring AI-powered workout generation, comprehensive progress tracking, and customizable workout routines.[1][2]

## Tech Stack
- **Framework:** React Native with Expo
- **Platforms:** iOS and Android
- **AI Integration:** Local model for exercise recommendation

## Feature Set

### 1. Authentication & User Management
- User login system
- User preferences configuration
- Profile customization

### 2. Home Tab
**Calendar View:**
- Visual display of past workout activity
- Current streak counter
- Longest streak (historical) display

### 3. Workout Tab

**Routine Structure:**
- Multiple workout routines per user
- Each routine contains 7 day-specific cards (Monday-Sunday)
- Each day card contains a list of exercises

- For each day we give a list of muscles to train - user can select as many as he wants --> those days will be stored as tags for that day in that routine- kind of for a {routine, day} pair

**Exercise LIST Management:**

- **Manual Entry Option:**
  - Exercise name input
  - Weight tracking
  - Repetition count
  - Set count

- **AI-Powered Option:**
  - Automatically generates 5 relevant exercises
  - Uses local AI model with inputs:
    - Day-specific tags (e.g., "Back and Biceps")
    - Currently added exercises with full details (name, weight, reps)
  - Smart recommendations based on workout context

**Workout Execution:**
- "Start Workout" button initiates session
- Real-time workout timer (tracks start and end time)
- Current exercise tracking mechanism
- Progress updates trigger current exercise advancement

**Progress Tracking During Workout:**
- Check off completed exercises
- Update set completion count (e.g., 3 sets of 10 reps)
- Two update methods:
  - Increment set counter
  - Toggle exercise completion checkbox
- "End Workout" button finalizes session

### 4. Statistics Tab

**Activity Calendar:**
- Visual representation of workout days
- Streak tracking (current and historical longest)

**Performance Metrics:**
- Per-workout data collection:
  - Total repetitions
  - Weight lifted per exercise
  - Sets completed
  - Total workout duration
  
**Strength Score Calculation:**
- Computed from aggregated workout data
- Visualized on line graph
- Shows progress over time

### 5. Widgets
- Calendar widget displaying past activity history
- Quick-glance workout streak information

## User Workflow

### Initial Setup
1. User logs in
2. Configures preferences
3. Arrives at homepage with calendar view

### Creating Workouts
1. Navigate to Workout tab
2. Select or create routine
3. Choose day card (Monday-Sunday)
4. Add exercises via:
   - Manual entry (name, weight, reps), OR
   - AI generation (5 auto-suggested exercises)
5. Finalize exercise list

### Executing Workouts
1. Tap "Start Workout" on prepared day
2. System begins tracking total time
3. Complete exercises by:
   - Checking off finished exercises
   - Updating set completion counts
4. Current exercise auto-advances on progress update
5. Tap "End Workout" to complete session
6. Data saves to statistics

### Viewing Progress
1. Navigate to Statistics tab
2. Review activity calendar with workout days highlighted
3. Check current and longest streaks
4. Analyze strength score trends on line graph[3][4]

## Technical Considerations

### State Management
- Track current exercise during active workout
- Persist and store workout routines and historical data
- Real-time timer management
- Calendar state synchronization

### Data Models

<TO BE DECIDED>


### AI Model Requirements

<DONT DECIDE NOW>

## Future Enhancement Opportunities
Based on industry best practices, consider adding:
- Social features and community challenges
- Video exercise library with proper form guidance
- Third-party integrations (Apple Health, Google Fit)
- Nutrition tracking module
- Rest timer between sets
- Personal records (PR) tracking
- Export workout data functionality