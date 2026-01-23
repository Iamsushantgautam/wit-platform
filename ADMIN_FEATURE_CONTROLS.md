# Admin Feature Control System - Implementation Guide

## Overview
This implementation adds comprehensive admin controls to hide/disable user features like User Tools and User Prompts sections. Admins can now control which features are available to all users platform-wide.

## Features Implemented

### 1. Backend Components

#### Settings Model (`backend/models/Settings.js`)
- Stores platform-wide feature flags
- Uses singleton pattern (only one settings document)
- Configurable features:
  - `userToolsEnabled` - AI Tools section
  - `userPromptsEnabled` - User Prompts section
  - `userOffersEnabled` - Offers & Banners section
  - `userLinksEnabled` - Important Links section
  - `userUpdatesEnabled` - Updates/News section
  - `userNavigationEnabled` - Navigation Menu customization
  - `userHeroButtonsEnabled` - Hero Buttons customization

#### Admin Controller (`backend/controllers/adminController.js`)
- `getSettings()` - Get platform settings (admin only)
- `updateSettings()` - Update feature flags (admin only)
- `getFeatureFlags()` - Public endpoint for frontend to check features

#### Admin Middleware (`backend/middleware/adminAuth.js`)
- Protects admin-only routes
- Verifies JWT token
- Checks for `master_admin` role

#### Admin Routes (`backend/routes/adminRoutes.js`)
- `GET /api/admin/features` - Public endpoint for feature flags
- `GET /api/admin/settings` - Get settings (admin only)
- `PUT /api/admin/settings` - Update settings (admin only)

### 2. Frontend Components

#### AdminPanel Component (`frontend/src/components/user/AdminPanel.jsx`)
- Beautiful UI for toggling features on/off
- Real-time save functionality
- Access control (master_admin only)
- Visual toggles for each feature
- Success/error message handling

#### Dashboard Updates (`frontend/src/pages/Dashboard.jsx`)
- Fetches feature flags on load
- Conditionally renders tabs based on flags
- Passes feature flags to sidebar

#### DashboardSidebar Updates (`frontend/src/components/user/DashboardSidebar.jsx`)
- Accepts `featureFlags` prop
- Conditionally renders navigation tabs
- Hides disabled features from all users

#### MasterAdminDashboard Updates (`frontend/src/pages/MasterAdminDashboard.jsx`)
- Added "Feature Controls" tab
- Integrated AdminPanel component
- Settings icon in sidebar navigation

### 3. Server Updates
- Registered admin routes in `server.js`

## How It Works

### Admin Workflow:
1. Admin logs into `/admin` dashboard
2. Navigates to "Feature Controls" tab
3. Toggles features on/off using switches
4. Clicks "Save Changes" to apply settings
5. Changes take effect immediately for all users

### User Experience:
1. When a feature is disabled:
   - Tab disappears from dashboard sidebar
   - Content section is not rendered
   - Feature becomes completely inaccessible
2. When a feature is re-enabled:
   - Tab reappears in sidebar
   - Users can access the feature again

### Feature Flag Flow:
```
1. Admin Panel → Updates Settings Model in MongoDB
2. Settings API → Provides feature flags to frontend
3. Dashboard → Fetches flags on mount
4. Sidebar + Content → Conditionally renders based on flags
```

## API Endpoints

### Public
- `GET /api/admin/features` - Get current feature flags

### Protected (Admin Only)
- `GET /api/admin/settings` - Get all platform settings
- `PUT /api/admin/settings` - Update platform settings

## Database Schema

### Settings Document
```javascript
{
  features: {
    userToolsEnabled: Boolean,
    userPromptsEnabled: Boolean,
    userOffersEnabled: Boolean,
    userLinksEnabled: Boolean,
    userUpdatesEnabled: Boolean,
    userNavigationEnabled: Boolean,
    userHeroButtonsEnabled: Boolean
  },
  singleton: 'settings', // Ensures only one document
  timestamps: true
}
```

## Usage Instructions

### For Admins:
1. Log in with a master_admin account
2. Go to **Admin Dashboard** (`/admin`)
3. Click **Feature Controls** in the sidebar
4. Toggle features using the ON/OFF switches
5. Click **Save Changes** to apply

### For Developers:
To add a new controllable feature:

1. **Backend** - Add to Settings model:
```javascript
features: {
  newFeatureEnabled: {
    type: Boolean,
    default: true
  }
}
```

2. **Frontend** - Add to AdminPanel features list:
```javascript
{ 
  key: 'newFeatureEnabled', 
  label: 'New Feature Name', 
  description: 'Description of the feature' 
}
```

3. **Frontend** - Add conditional rendering in Dashboard and Sidebar:
```javascript
{featureFlags.newFeatureEnabled && (
  <TabButton id="newfeature" label="New Feature" icon={Icon} />
)}
```

## Security Features
- Admin-only routes protected by JWT + role check
- Feature flags fetched from server (can't be manipulated client-side)
- Unauthorized users get "Access Denied" message
- All admin actions require `master_admin` role

## Benefits
✅ **Centralized Control** - Manage all features from one place
✅ **Instant Updates** - Changes apply immediately without restart
✅ **User-Friendly** - Clean UI with toggle switches
✅ **Secure** - Protected by authentication and authorization
✅ **Flexible** - Easy to add new controllable features
✅ **No Code Changes** - Enable/disable features without deployment

## Testing
1. **As Admin**: Toggle features and verify they disappear from user dashboards
2. **As User**: Verify disabled tabs don't appear in sidebar
3. **Direct Access**: Try accessing disabled features via URL (should not render)
4. **API**: Test feature flags endpoint returns correct values

## Notes
- Default state: All features are enabled
- Settings are created automatically on first access if they don't exist
- Changes require admin authentication via Bearer token
- Feature visibility updates on next dashboard load (users may need to refresh)

## Files Modified/Created

### Created:
- `backend/models/Settings.js`
- `backend/controllers/adminController.js`
- `backend/middleware/adminAuth.js`
- `backend/routes/adminRoutes.js`
- `frontend/src/components/user/AdminPanel.jsx`

### Modified:
- `backend/server.js`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/components/user/DashboardSidebar.jsx`
- `frontend/src/pages/MasterAdminDashboard.jsx`
