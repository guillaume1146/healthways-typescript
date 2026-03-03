// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// User profile response (from GET /api/users/[id])
export interface UserProfileResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  profileImage: string | null
  userType: string
  dateOfBirth: string | null
  gender: string | null
  address: string | null
  verified: boolean
  accountStatus: string
  createdAt: string
  profile: Record<string, unknown> | null
}

// Auth login response
export interface LoginResponse {
  success: boolean
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    profileImage: string | null
    userType: string
  }
  message: string
}

// Appointment response
export interface AppointmentResponse {
  id: string
  scheduledAt: string
  status: string
  type?: string
  reason?: string
  roomId?: string
  patient?: { user: { firstName: string; lastName: string } }
  doctor?: { user: { firstName: string; lastName: string } }
}

// Booking response
export interface BookingResponse {
  id: string
  status: string
  scheduledDate: string
  scheduledTime: string
  reason?: string
  notes?: string
}
