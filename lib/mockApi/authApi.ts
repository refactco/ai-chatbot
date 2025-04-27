/**
 * Mock Authentication API
 *
 * This file provides mock authentication API endpoints
 * simulating backend authentication functionality.
 */

import type { User, CreateUserRequest, AuthResponse } from './models';
import { mockUsers } from './data';
import type { MockResponse } from './utils';
import { mockSuccess, mockError, mockStorage, generateId } from './utils';

// Helper to find user by email
export const findUserByEmail = (email: string): User | undefined => {
  const users = mockStorage.getItem<User[]>('users') || mockUsers;
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

// Helper to find user by ID
export const findUserById = (id: string): User | undefined => {
  const users = mockStorage.getItem<User[]>('users') || mockUsers;
  return users.find((user) => user.id === id);
};

// Helper to create a JWT-like token
const createToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    iat: Math.floor(Date.now() / 1000),
  };
  return btoa(JSON.stringify(payload));
};

// Register a new user
export const register = async (
  userData: CreateUserRequest,
): Promise<MockResponse<AuthResponse>> => {
  // Validate required fields
  if (!userData.email || !userData.password || !userData.name) {
    return mockError('Email, password, and name are required', 400);
  }

  // Check if user already exists
  const existingUser = findUserByEmail(userData.email);
  if (existingUser) {
    return mockError('User with this email already exists', 409);
  }

  // Create new user
  const newUser: User = {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    image:
      userData.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`,
    emailVerified: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store user in mock storage
  const users = mockStorage.getItem<User[]>('users') || mockUsers;
  mockStorage.setItem('users', [...users, newUser]);

  // Create token
  const token = createToken(newUser.id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return mockSuccess({
    user: newUser,
    token,
    expiresAt,
  });
};

// Login a user
export const login = async (
  email: string,
  password: string,
): Promise<MockResponse<AuthResponse>> => {
  // Validate required fields
  if (!email || !password) {
    return mockError('Email and password are required', 400);
  }

  // Find user
  const user = findUserByEmail(email);
  if (!user) {
    return mockError('Invalid email or password', 401);
  }

  // In a real app, we would verify the password hash here
  // For mock purposes, we'll accept any password for the mock users

  // For demo user, always allow login
  if (user.email === 'demo@example.com') {
    const token = createToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return mockSuccess({
      user,
      token,
      expiresAt,
    });
  }

  // Simulate password check for other users
  // In a real app, we would compare password hashes
  // This is just for demonstration
  if (password !== 'password') {
    return mockError('Invalid email or password', 401);
  }

  // Create token
  const token = createToken(user.id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return mockSuccess({
    user,
    token,
    expiresAt,
  });
};

// Get user by token
export const getUserByToken = async (
  token: string,
): Promise<MockResponse<User>> => {
  try {
    // Decode token
    const payload = JSON.parse(atob(token));

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return mockError('Token has expired', 401);
    }

    // Get user from payload
    const userId = payload.userId;
    const user = findUserById(userId);

    if (!user) {
      return mockError('User not found', 404);
    }

    return mockSuccess(user);
  } catch (error) {
    return mockError('Invalid token', 401);
  }
};

// Logout (in a real app, this might invalidate the token)
export const logout = async (): Promise<MockResponse<{ success: boolean }>> => {
  // In a real app, we would invalidate the token
  // For mock purposes, we just return success
  return mockSuccess({ success: true });
};

// Update user profile
export const updateProfile = async (
  userId: string,
  userData: Partial<User>,
): Promise<MockResponse<User>> => {
  // Find user
  const user = findUserById(userId);
  if (!user) {
    return mockError('User not found', 404);
  }

  // Update user
  const updatedUser: User = {
    ...user,
    ...userData,
    updatedAt: new Date(),
  };

  // Store updated user
  const users = mockStorage.getItem<User[]>('users') || mockUsers;
  const updatedUsers = users.map((u) => (u.id === userId ? updatedUser : u));
  mockStorage.setItem('users', updatedUsers);

  return mockSuccess(updatedUser);
};
