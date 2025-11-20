import Foundation

struct CreateFeatureRequest: Codable {
    let title: String
    let description: String
    let authorName: String?
    
    enum CodingKeys: String, CodingKey {
        case title
        case description
        case authorName = "author_name"
    }
}

