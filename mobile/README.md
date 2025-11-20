# Feature Voting iOS App

A native iOS application built with Swift and SwiftUI for the Feature Voting System. This app allows users to post feature requests and upvote others.

## Tech Stack

### Why Native Swift over React Native?

- **Performance**: Native Swift apps have better performance with no JavaScript bridge overhead
- **Native iOS Patterns**: Direct access to iOS APIs and design patterns
- **Better UX**: Native feel and responsiveness
- **No Dependencies**: Uses only Apple's native frameworks (SwiftUI, URLSession, Combine)
- **Type Safety**: Swift's strong type system ensures compile-time safety

## Architecture

The app follows **MVVM (Model-View-ViewModel)** architecture:

- **Models**: Data structures (`Feature`, `CreateFeatureRequest`, `VoteStatus`, `APIError`)
- **Views**: SwiftUI views (`FeatureListView`, `CreateFeatureView`)
- **ViewModels**: Observable objects that manage state (`FeatureListViewModel`, `CreateFeatureViewModel`)
- **Services**: Network layer (`NetworkService`)

## Project Structure

```
FeatureVoting/
├── FeatureVoting/
│   ├── FeatureVotingApp.swift      # App entry point
│   ├── Config.swift                # API configuration
│   ├── Views/
│   │   ├── FeatureListView.swift   # Main feature list
│   │   └── CreateFeatureView.swift # Create feature form
│   ├── ViewModels/
│   │   ├── FeatureListViewModel.swift
│   │   └── CreateFeatureViewModel.swift
│   ├── Models/
│   │   ├── Feature.swift
│   │   ├── CreateFeatureRequest.swift
│   │   ├── VoteStatus.swift
│   │   └── APIError.swift
│   └── Services/
│       └── NetworkService.swift    # API client
```

## Features

### ✅ Core Functionality

- [x] View all features sorted by vote count
- [x] Create new feature requests
- [x] Upvote/downvote features (toggle)
- [x] Real-time vote status tracking
- [x] Pull to refresh
- [x] Empty state handling

### ✅ User Experience

- [x] Loading states for all async operations
- [x] Error handling with user-friendly alerts
- [x] Form validation (title max 255 chars, required fields)
- [x] Character counter for title field
- [x] Success/error alerts

### ✅ Technical Features

- [x] Async/await for network calls
- [x] Proper error handling and propagation
- [x] MVVM architecture
- [x] SwiftUI Previews for development
- [x] No external dependencies

## Setup Instructions

### Prerequisites

- Xcode 15.0 or later
- iOS 17.0+ deployment target
- Backend API running (see main README.md)

### Configuration

1. **Update API Base URL**

   Open `FeatureVoting/Config.swift` and update the `apiBaseURL`:

   ```swift
   // For iOS Simulator (localhost)
   static let apiBaseURL = "http://localhost:5173"

   // For physical device (use your computer's IP)
   static let apiBaseURL = "http://192.168.x.x:5173"
   ```

2. **Find Your Computer's IP Address** (for physical device testing)

   ```bash
   # macOS
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Or use System Preferences > Network
   ```

3. **Configure Info.plist**

   The app already has `NSAppTransportSecurity` configured to allow HTTP connections for development. For production, use HTTPS.

### Running the App

1. Open `FeatureVoting.xcodeproj` in Xcode
2. Select a simulator or connected device
3. Press `Cmd + R` to build and run

### Testing on Physical Device

1. Connect your iPhone/iPad via USB
2. Select your device in Xcode
3. Update `Config.swift` with your computer's IP address
4. Ensure your device and computer are on the same network
5. Build and run

## API Integration

The app communicates with the backend REST API:

### Endpoints Used

- `GET /api/features` - Fetch all features
- `POST /api/features` - Create a new feature
- `POST /api/votes` - Create a vote
- `DELETE /api/votes/:featureId` - Remove a vote
- `GET /api/votes/:featureId/check` - Check vote status

### Request/Response Examples

**Create Feature:**

```swift
POST /api/features
{
  "title": "Dark mode support",
  "description": "Add dark mode theme",
  "author_name": "John Doe" // optional
}
```

**Toggle Vote:**

```swift
// Check status first
GET /api/votes/:featureId/check
→ { "has_voted": false }

// Then create or delete
POST /api/votes { "featureId": "..." }
DELETE /api/votes/:featureId
```

## Error Handling

The app handles various error scenarios:

- **Network Errors**: Shows alert with retry option
- **Validation Errors**: Real-time validation with character limits
- **API Errors**: Displays server error messages
- **Empty States**: Shows helpful empty state UI

## Development

### SwiftUI Previews

The app includes SwiftUI Previews for rapid development:

```swift
#Preview {
    FeatureListView()
}
```

### Testing

To test the app:

1. Ensure backend is running
2. Update `Config.swift` with correct API URL
3. Run in simulator or device
4. Test all flows:
   - Create feature
   - Vote/unvote
   - Pull to refresh
   - Error scenarios

## Troubleshooting

### Can't Connect to Backend

- **Simulator**: Use `http://localhost:5173`
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:5173`)
- Ensure backend is running and accessible
- Check firewall settings

### Build Errors

- Ensure Xcode 15.0+ is installed
- Clean build folder: `Cmd + Shift + K`
- Restart Xcode if needed

### Network Errors

- Check `Info.plist` has `NSAppTransportSecurity` configured
- Verify API URL in `Config.swift`
- Ensure backend CORS is enabled

## Future Enhancements

- [ ] Offline support with Core Data
- [ ] Push notifications for new features
- [ ] Search and filter features
- [ ] User authentication
- [ ] Feature comments
- [ ] Image attachments

## License

Same as main project.
