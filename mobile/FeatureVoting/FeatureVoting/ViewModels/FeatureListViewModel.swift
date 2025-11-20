import Foundation
import SwiftUI

@MainActor
class FeatureListViewModel: ObservableObject {
    @Published var features: [Feature] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var voteStatuses: [String: Bool] = [:]
    
    private let networkService = NetworkService.shared
    
    func loadFeatures() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let fetchedFeatures = try await networkService.fetchFeatures()
            features = fetchedFeatures
            
            // Load vote statuses for all features
            await loadVoteStatuses()
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
    
    private func loadVoteStatuses() async {
        for feature in features {
            do {
                let hasVoted = try await networkService.checkVoteStatus(featureId: feature.id)
                voteStatuses[feature.id] = hasVoted
            } catch {
                // Silently fail for vote status checks
                voteStatuses[feature.id] = false
            }
        }
    }
    
    func toggleVote(for feature: Feature) async {
        do {
            try await networkService.toggleVote(featureId: feature.id)
            
            // Update local vote status
            let currentStatus = voteStatuses[feature.id] ?? false
            voteStatuses[feature.id] = !currentStatus
            
            // Reload features to get updated vote counts
            await loadFeatures()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func hasVoted(for featureId: String) -> Bool {
        return voteStatuses[featureId] ?? false
    }
}

