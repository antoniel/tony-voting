import Foundation

struct VoteStatus: Codable {
    let hasVoted: Bool
    
    enum CodingKeys: String, CodingKey {
        case hasVoted = "has_voted"
    }
}

