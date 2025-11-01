/**
 * WidgetTimelineProvider - Timeline refresh logic
 */

import WidgetKit
import SwiftUI

struct WidgetTimelineProvider: TimelineProvider {
    typealias Entry = SimpleEntry
    
    // MARK: - Placeholder
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(
            date: Date(),
            currentStreak: 0,
            longestStreak: 0,
            lastWorkout: nil
        )
    }
    
    // MARK: - Snapshot (for widget gallery)
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let data = SharedDataManager.shared.loadWidgetData()
        let entry = createEntry(from: data)
        completion(entry)
    }
    
    // MARK: - Timeline
    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        // Load data from App Group
        let data = SharedDataManager.shared.loadWidgetData()
        let entry = createEntry(from: data)
        
        // Refresh policy: update every hour or when app writes new data
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        
        completion(timeline)
    }
    
    // MARK: - Helper
    private func createEntry(from data: WidgetData) -> SimpleEntry {
        return SimpleEntry(
            date: Date(),
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            lastWorkout: data.lastWorkoutDate
        )
    }
}

// MARK: - Timeline Entry
struct SimpleEntry: TimelineEntry {
    let date: Date
    let currentStreak: Int
    let longestStreak: Int
    let lastWorkout: Date?
}

