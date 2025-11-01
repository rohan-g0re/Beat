/**
 * WidgetData - Shared data models
 * 
 * Data structure shared between React Native app and iOS Widget
 */

import Foundation

struct WidgetData: Codable {
    let currentStreak: Int
    let longestStreak: Int
    let lastWorkoutDate: Date?
    let totalWorkouts: Int
    let updatedAt: Date
    
    static var empty: WidgetData {
        return WidgetData(
            currentStreak: 0,
            longestStreak: 0,
            lastWorkoutDate: nil,
            totalWorkouts: 0,
            updatedAt: Date()
        )
    }
}

// MARK: - JavaScript Bridge Model
// This is what the React Native app will send

struct WidgetDataInput: Codable {
    let currentStreak: Int
    let longestStreak: Int
    let lastWorkoutDate: String? // ISO 8601 string
    let totalWorkouts: Int
    
    func toWidgetData() -> WidgetData {
        let lastWorkout: Date?
        if let dateString = lastWorkoutDate {
            let formatter = ISO8601DateFormatter()
            lastWorkout = formatter.date(from: dateString)
        } else {
            lastWorkout = nil
        }
        
        return WidgetData(
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            lastWorkoutDate: lastWorkout,
            totalWorkouts: totalWorkouts,
            updatedAt: Date()
        )
    }
}

