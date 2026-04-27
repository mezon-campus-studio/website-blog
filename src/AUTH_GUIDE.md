# Authentication & Authorization Guide

This project implements a complete front-end authentication and authorization system linked to the `blog-be` backend.

## Architecture

- **State Management**: Managed via `AuthContext` and `useAuth` hook.
- **Persistence**: JWT tokens and basic user info are stored in `localStorage`.
- **API Client**: `apiClient` (Axios) handles base URL, request headers, and token injection.
- **Role-Based Access Control (RBAC)**:
    - `ProtectedRoute`: Wraps pages to restrict access to authenticated users and specific roles.
    - `RoleGate`: Conditionally renders components based on the user's role (`USER`, `ADMIN`).

## Key Components

### `useAuth()` Hook
Provides access to:
- `user`: Current user object.
- `isAuthenticated`: Boolean status.
- `isLoading`: Loading state (during rehydration).
- `login(token, user)`: Sets the auth state.
- `logout()`: Clears the auth state.

### `ProtectedRoute`
Usage in page components:
```tsx
<ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
  <AdminDashboard />
</ProtectedRoute>
```

### `RoleGate`
Usage for conditional UI:
```tsx
<RoleGate allowedRoles={[UserRole.ADMIN]}>
  <button>Delete User</button>
</RoleGate>
```

## Backend Integration

The system is configured to talk to `http://localhost:5000/api`. Ensure the backend is running at this address.

### Supported Features
- [x] Login
- [x] Signup
- [x] Logout
- [x] Update Profile (Name, Bio)
- [x] Upload Avatar
- [x] Change Password
- [x] Admin User Management (Role toggle, Lock/Unlock)

### Mocked Features
- [ ] Forgot Password (UI only)
- [ ] Reset Password (UI only)
