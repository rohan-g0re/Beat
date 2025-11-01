/**
 * WidgetViews - SwiftUI widget views (streak, activity)
 */

import SwiftUI
import WidgetKit

struct FitTrackerWidgetEntryView: View {
    var entry: WidgetTimelineProvider.Entry
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// MARK: - Small Widget (Streak Counter)
struct SmallWidgetView: View {
    var entry: WidgetTimelineProvider.Entry
    
    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Image(systemName: "flame.fill")
                    .foregroundColor(.orange)
                    .font(.title2)
                Spacer()
            }
            
            Spacer()
            
            VStack(alignment: .leading, spacing: 4) {
                Text("\(entry.currentStreak)")
                    .font(.system(size: 48, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("day streak")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            if let lastWorkout = entry.lastWorkout {
                Text(lastWorkoutText(lastWorkout))
                    .font(.caption2)
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding()
        .background(Color.black)
    }
    
    private func lastWorkoutText(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return "Last: \(formatter.localizedString(for: date, relativeTo: Date()))"
    }
}

// MARK: - Medium Widget (Streak + Stats)
struct MediumWidgetView: View {
    var entry: WidgetTimelineProvider.Entry
    
    var body: some View {
        HStack(spacing: 16) {
            // Left: Current Streak
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "flame.fill")
                        .foregroundColor(.orange)
                        .font(.title3)
                    Text("Current")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Text("\(entry.currentStreak)")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("days")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            Divider()
                .background(Color.gray.opacity(0.3))
            
            // Right: Longest Streak
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "trophy.fill")
                        .foregroundColor(.yellow)
                        .font(.title3)
                    Text("Record")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Text("\(entry.longestStreak)")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("days")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding()
        .background(Color.black)
    }
}

// MARK: - Preview
struct FitTrackerWidget_Previews: PreviewProvider {
    static var previews: some View {
        let entry = SimpleEntry(
            date: Date(),
            currentStreak: 7,
            longestStreak: 14,
            lastWorkout: Calendar.current.date(byAdding: .hour, value: -3, to: Date())
        )
        
        Group {
            FitTrackerWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small Widget")
            
            FitTrackerWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemMedium))
                .previewDisplayName("Medium Widget")
        }
    }
}

