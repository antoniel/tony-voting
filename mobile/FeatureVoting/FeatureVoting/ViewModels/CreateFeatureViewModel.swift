import Foundation
import SwiftUI

@MainActor
class CreateFeatureViewModel: ObservableObject {
    @Published var title = ""
    @Published var description = ""
    @Published var authorName = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var showSuccessAlert = false
    
    private let networkService = NetworkService.shared
    
    var isFormValid: Bool {
        !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !description.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        title.count <= 255
    }
    
    var titleCharacterCount: Int {
        title.count
    }
    
    var canSubmit: Bool {
        isFormValid && !isLoading
    }
    
    func submitFeature() async -> Bool {
        guard isFormValid else {
            errorMessage = "Title and description are required. Title must be 255 characters or less."
            return false
        }
        
        isLoading = true
        errorMessage = nil
        
        let request = CreateFeatureRequest(
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            description: description.trimmingCharacters(in: .whitespacesAndNewlines),
            authorName: authorName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : authorName.trimmingCharacters(in: .whitespacesAndNewlines)
        )
        
        do {
            _ = try await networkService.createFeature(request)
            isLoading = false
            showSuccessAlert = true
            resetForm()
            return true
        } catch {
            isLoading = false
            errorMessage = error.localizedDescription
            return false
        }
    }
    
    func resetForm() {
        title = ""
        description = ""
        authorName = ""
        errorMessage = nil
    }
}

