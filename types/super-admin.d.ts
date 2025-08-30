// /types/super-admin.d.ts

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'Content Manager' | 'Financial Analyst' | 'User Moderator';
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
  lastLogin: string;
  avatar: string;
  permissions: {
    canManageCMS: boolean;
    canManageFinances: boolean;
    canManageUsers: boolean;
  };
}

export interface PlatformStat {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
}