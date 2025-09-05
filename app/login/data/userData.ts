import { doctorsData } from '@/lib/data/doctors';
import { nursesData } from '@/lib/data/nurses';
import { nanniesData } from '@/lib/data/nannies';
import { patientsData } from '@/lib/data/patients';
import { BaseAuthenticatedUser, DemoUser } from '../types/auth';

export const createAuthData = (): Record<string, BaseAuthenticatedUser> => {
  const authUsers: Record<string, BaseAuthenticatedUser> = {};

  // Add doctors
  doctorsData.forEach(doctor => {
    authUsers[doctor.email.toLowerCase()] = {
      ...doctor,
      userType: 'doctor'
    } as BaseAuthenticatedUser;
  });

  // Add nurses  
  nursesData.forEach(nurse => {
    authUsers[nurse.email.toLowerCase()] = {
      ...nurse,
      userType: 'nurse'
    } as BaseAuthenticatedUser;
  });

  // Add nannies
  nanniesData.forEach(nanny => {
    authUsers[nanny.email.toLowerCase()] = {
      ...nanny,
      userType: 'child-care-nurse'
    } as BaseAuthenticatedUser;
  });

  // Add patients
  patientsData.forEach(patient => {
    authUsers[patient.email.toLowerCase()] = {
      ...patient,
      userType: 'patient'
    } as BaseAuthenticatedUser;
  });

  // Add demo users for other types
  const demoUsers: DemoUser[] = [
    {
      id: 'PHARM001',
      firstName: 'John',
      lastName: 'Pharmacist',
      email: 'pharmacy@healthwyz.mu',
      password: 'PharmacyPass123!',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.pharmacy.token',
      userType: 'pharmacy',
      profileImage: '/images/pharmacy/1.jpg'
    },
    {
      id: 'LAB001', 
      firstName: 'Sarah',
      lastName: 'Lab Tech',
      email: 'lab@healthwyz.mu',
      password: 'LabPass123!',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.lab.token',
      userType: 'lab',
      profileImage: '/images/lab/1.jpg'
    },
    {
      id: 'AMB001',
      firstName: 'Mike',
      lastName: 'Emergency',
      email: 'ambulance@healthwyz.mu', 
      password: 'AmbulancePass123!',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ambulance.token',
      userType: 'ambulance',
      profileImage: '/images/ambulance/1.jpg'
    },
    {
      id: 'ADM001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@healthwyz.mu',
      password: 'AdminPass123!', 
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.token',
      userType: 'admin',
      profileImage: '/images/admin/1.jpg'
    },
    {
      id: 'CORP001',
      firstName: 'Corporate',
      lastName: 'Admin',
      email: 'corporate@healthwyz.mu',
      password: 'CorporatePass123!',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.corporate.token', 
      userType: 'corporate',
      profileImage: '/images/corporate/1.jpg'
    },
    {
      id: 'INS001',
      firstName: 'Insurance',
      lastName: 'Rep',
      email: 'insurance@healthwyz.mu',
      password: 'InsurancePass123!',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.insurance.token',
      userType: 'insurance', 
      profileImage: '/images/insurance/1.jpg'
    },
    {
      id: 'REF001',
      firstName: 'Partner',
      lastName: 'Referral',
      email: 'partner@healthwyz.mu',
      password: 'PartnerPass123!',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.partner.token',
      userType: 'referral-partner',
      profileImage: '/images/referral/1.jpg'
    }
  ];

  demoUsers.forEach(user => {
    authUsers[user.email.toLowerCase()] = user as BaseAuthenticatedUser;
  });

  return authUsers;
};