import Foundation

struct Feature: Codable, Identifiable {
    let id: String
    let title: String
    let description: String
    let authorName: String?
    let votesCount: Int
    let status: String
    let createdAt: String
    let updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case description
        case authorName = "author_name"
        case votesCount = "votes_count"
        case status
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
    
    var formattedDate: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        
        if let date = formatter.date(from: createdAt) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .medium
            displayFormatter.timeStyle = .short
            return displayFormatter.string(from: date)
        }
        
        return createdAt
    }
}

