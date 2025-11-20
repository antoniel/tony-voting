import SwiftUI

struct FeatureListView: View {
    @StateObject private var viewModel = FeatureListViewModel()
    
    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading && viewModel.features.isEmpty {
                    ProgressView("Loading features...")
                } else if viewModel.features.isEmpty {
                    EmptyStateView()
                } else {
                    featureList
                }
            }
            .navigationTitle("Features")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    NavigationLink(destination: CreateFeatureView(onFeatureCreated: {
                        Task {
                            await viewModel.loadFeatures()
                        }
                    })) {
                        Image(systemName: "plus")
                    }
                }
            }
            .refreshable {
                await viewModel.loadFeatures()
            }
            .alert("Error", isPresented: Binding(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } }
            )) {
                Button("OK") {
                    viewModel.errorMessage = nil
                }
                Button("Retry") {
                    Task {
                        await viewModel.loadFeatures()
                    }
                }
            } message: {
                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                }
            }
            .task {
                await viewModel.loadFeatures()
            }
        }
    }
    
    private var featureList: some View {
        List(viewModel.features) { feature in
            FeatureRowView(feature: feature, hasVoted: viewModel.hasVoted(for: feature.id)) {
                Task {
                    await viewModel.toggleVote(for: feature)
                }
            }
        }
        .listStyle(.plain)
    }
}

struct FeatureRowView: View {
    let feature: Feature
    let hasVoted: Bool
    let onVoteTapped: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(feature.title)
                        .font(.headline)
                        .lineLimit(2)
                    
                    if let authorName = feature.authorName, !authorName.isEmpty {
                        Text("By \(authorName)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                VoteButton(hasVoted: hasVoted, voteCount: feature.votesCount) {
                    onVoteTapped()
                }
            }
            
            Text(feature.description)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .lineLimit(3)
            
            Text(feature.formattedDate)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct VoteButton: View {
    let hasVoted: Bool
    let voteCount: Int
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: hasVoted ? "heart.fill" : "heart")
                    .foregroundColor(hasVoted ? .red : .gray)
                Text("\(voteCount)")
                    .font(.caption)
                    .foregroundColor(.primary)
            }
            .frame(width: 50)
        }
        .buttonStyle(.plain)
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "lightbulb")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            Text("No features yet")
                .font(.title2)
                .foregroundColor(.secondary)
            Text("Be the first to suggest a feature!")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
}

#Preview {
    FeatureListView()
}

#Preview("Feature Row") {
    FeatureRowView(
        feature: Feature(
            id: "1",
            title: "Sample Feature",
            description: "This is a sample feature description",
            authorName: "John Doe",
            votesCount: 5,
            status: "open",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        ),
        hasVoted: false,
        onVoteTapped: {}
    )
    .padding()
}

