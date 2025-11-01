/**
 * FitTrackerWidget - Widget Entry Point
 * 
 * NOTE: This file is a placeholder. Widget extension requires:
 * 1. Run `npx expo prebuild` to generate iOS project
 * 2. Add Widget Extension target in Xcode
 * 3. Configure App Group entitlements
 * 4. Install config plugin for automatic setup
 */

import WidgetKit
import SwiftUI

@main
struct FitTrackerWidget: Widget {
    let kind: String = "FitTrackerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            FitTrackerWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("FitTracker")
        .description("View your workout streak and recent activity")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), currentStreak: 0, longestStreak: 0, lastWorkout: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        // Load from shared App Group
        let data = SharedDataManager.shared.loadWidgetData()
        let entry = SimpleEntry(
            date: Date(),
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            lastWorkout: data.lastWorkoutDate
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let data = SharedDataManager.shared.loadWidgetData()
        let entry = SimpleEntry(
            date: Date(),
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            lastWorkout: data.lastWorkoutDate
        )
        
        // Update every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let currentStreak: Int
    let longestStreak: Int
    let lastWorkout: Date?
}

