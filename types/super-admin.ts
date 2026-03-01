export interface Admin {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'pending' | 'suspended'
  joinDate: string
  lastLogin: string
  avatar: string
  permissions: {
    canManageCMS: boolean
    canManageFinances: boolean
    canManageUsers: boolean
  }
}
