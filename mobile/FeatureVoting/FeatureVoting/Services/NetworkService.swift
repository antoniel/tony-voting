import Foundation

class NetworkService {
    static let shared = NetworkService()
    
    private let baseURL: String
    private let session: URLSession
    
    init(baseURL: String? = nil) {
        // Use Config for default, can be overridden for testing
        self.baseURL = baseURL ?? Config.apiBaseURL
        self.session = URLSession.shared
    }
    
    // MARK: - Features
    
    func fetchFeatures() async throws -> [Feature] {
        guard let url = URL(string: "\(baseURL)/api/features") else {
            throw APIError.invalidURL
        }
        
        do {
            let (data, response) = try await session.data(from: url)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)["message"] ?? "Unknown error"
                throw APIError.httpError(statusCode: httpResponse.statusCode, message: errorMessage ?? "Unknown error")
            }
            
            do {
                let features = try JSONDecoder().decode([Feature].self, from: data)
                return features
            } catch {
                throw APIError.decodingError(error)
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    func createFeature(_ request: CreateFeatureRequest) async throws -> Feature {
        guard let url = URL(string: "\(baseURL)/api/features") else {
            throw APIError.invalidURL
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            urlRequest.httpBody = try JSONEncoder().encode(request)
        } catch {
            throw APIError.decodingError(error)
        }
        
        do {
            let (data, response) = try await session.data(for: urlRequest)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)["message"] ?? "Unknown error"
                throw APIError.httpError(statusCode: httpResponse.statusCode, message: errorMessage ?? "Unknown error")
            }
            
            do {
                let feature = try JSONDecoder().decode(Feature.self, from: data)
                return feature
            } catch {
                throw APIError.decodingError(error)
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    // MARK: - Votes
    
    func toggleVote(featureId: String) async throws {
        // First check if user has voted
        let hasVoted = try await checkVoteStatus(featureId: featureId)
        
        if hasVoted {
            // Remove vote
            try await deleteVote(featureId: featureId)
        } else {
            // Add vote
            try await createVote(featureId: featureId)
        }
    }
    
    func checkVoteStatus(featureId: String) async throws -> Bool {
        guard let url = URL(string: "\(baseURL)/api/votes/\(featureId)/check") else {
            throw APIError.invalidURL
        }
        
        do {
            let (data, response) = try await session.data(from: url)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)["message"] ?? "Unknown error"
                throw APIError.httpError(statusCode: httpResponse.statusCode, message: errorMessage ?? "Unknown error")
            }
            
            do {
                let voteStatus = try JSONDecoder().decode(VoteStatus.self, from: data)
                return voteStatus.hasVoted
            } catch {
                throw APIError.decodingError(error)
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    private func createVote(featureId: String) async throws {
        guard let url = URL(string: "\(baseURL)/api/votes") else {
            throw APIError.invalidURL
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["featureId": featureId]
        do {
            urlRequest.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            throw APIError.decodingError(error)
        }
        
        do {
            let (data, response) = try await session.data(for: urlRequest)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)["message"] ?? "Unknown error"
                throw APIError.httpError(statusCode: httpResponse.statusCode, message: errorMessage ?? "Unknown error")
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    private func deleteVote(featureId: String) async throws {
        guard let url = URL(string: "\(baseURL)/api/votes/\(featureId)") else {
            throw APIError.invalidURL
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "DELETE"
        
        do {
            let (_, response) = try await session.data(for: urlRequest)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                throw APIError.httpError(statusCode: httpResponse.statusCode, message: "Failed to delete vote")
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
}

