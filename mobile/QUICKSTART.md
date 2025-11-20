# Quick Start Guide - iOS App

## Prerequisites

1. **Xcode 15.0+** installed
2. **Backend API** running (see main README.md)
3. **iOS Simulator** or physical device

## Setup Steps

### 1. Open Project

```bash
cd mobile/FeatureVoting
open FeatureVoting.xcodeproj
```

### 2. Configure API URL

Edit `FeatureVoting/Config.swift`:

**For iOS Simulator:**
```swift
static let apiBaseURL = "http://localhost:5173"
```

**For Physical Device:**
```swift
// Replace with your computer's IP address
static let apiBaseURL = "http://192.168.1.100:5173"
```

To find your IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 3. Build and Run

1. Select a simulator or device in Xcode
2. Press `Cmd + R` to build and run
3. The app should launch and connect to your backend

## Testing

### Test Feature Creation

1. Tap the `+` button in the top right
2. Enter a title (max 255 characters)
3. Enter a description
4. Optionally add author name
5. Tap "Submit Feature"
6. You should see a success alert and return to the list

### Test Voting

1. Tap the heart icon next to any feature
2. The vote count should increase
3. Tap again to remove your vote
4. Pull down to refresh and see updated counts

### Test Error Handling

1. Stop your backend server
2. Try to load features - you should see an error alert with retry option
3. Try to create a feature - you should see an error message

## Troubleshooting

### "Could not connect to server"

- ✅ Check backend is running: `curl http://localhost:5173/api/features`
- ✅ Verify API URL in `Config.swift`
- ✅ For physical device, ensure same WiFi network
- ✅ Check firewall settings

### Build Errors

- ✅ Clean build: `Cmd + Shift + K`
- ✅ Restart Xcode
- ✅ Ensure Xcode 15.0+ is installed

### App Crashes

- ✅ Check Xcode console for error messages
- ✅ Verify backend is accessible
- ✅ Check `Info.plist` has `NSAppTransportSecurity` configured

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the code structure
- Customize the UI to your preferences
- Add features like search, filters, or offline support

