import SwiftUI

struct CreateFeatureView: View {
    @StateObject private var viewModel = CreateFeatureViewModel()
    @Environment(\.dismiss) private var dismiss
    let onFeatureCreated: () -> Void
    
    var body: some View {
        Form {
            Section(header: Text("Feature Details")) {
                VStack(alignment: .leading, spacing: 4) {
                    TextField("Title (required)", text: $viewModel.title)
                        .textInputAutocapitalization(.sentences)
                    
                    HStack {
                        Spacer()
                        Text("\(viewModel.titleCharacterCount)/255")
                            .font(.caption)
                            .foregroundColor(viewModel.title.count > 255 ? .red : .secondary)
                    }
                }
                
                TextEditor(text: $viewModel.description)
                    .frame(minHeight: 120)
                    .overlay(
                        Group {
                            if viewModel.description.isEmpty {
                                Text("Description (required)")
                                    .foregroundColor(.secondary)
                                    .padding(.leading, 4)
                                    .padding(.top, 8)
                                    .allowsHitTesting(false)
                            }
                        },
                        alignment: .topLeading
                    )
                
                TextField("Author name (optional)", text: $viewModel.authorName)
                    .textInputAutocapitalization(.words)
            }
            
            Section {
                Button(action: {
                    Task {
                        let success = await viewModel.submitFeature()
                        if success {
                            onFeatureCreated()
                            dismiss()
                        }
                    }
                }) {
                    HStack {
                        if viewModel.isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        }
                        Text(viewModel.isLoading ? "Submitting..." : "Submit Feature")
                    }
                    .frame(maxWidth: .infinity)
                }
                .disabled(!viewModel.canSubmit)
            }
        }
        .navigationTitle("New Feature")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Cancel") {
                    dismiss()
                }
            }
        }
        .alert("Success", isPresented: $viewModel.showSuccessAlert) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("Feature created successfully!")
        }
        .alert("Error", isPresented: Binding(
            get: { viewModel.errorMessage != nil },
            set: { if !$0 { viewModel.errorMessage = nil } }
        )) {
            Button("OK") {
                viewModel.errorMessage = nil
            }
        } message: {
            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
            }
        }
    }
}

#Preview {
    NavigationView {
        CreateFeatureView(onFeatureCreated: {})
    }
}

