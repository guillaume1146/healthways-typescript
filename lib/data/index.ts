// Export all data types and arrays
export { doctorsData, type Doctor } from './doctors';
export { nursesData, type Nurse } from './nurses';
export { nanniesData, type Nanny } from './nannies';

import { doctorsData, type Doctor } from './doctors';
import { nursesData, type Nurse } from './nurses';
import { nanniesData, type Nanny } from './nannies';

// Combined profile type for unified operations
export type HealthcareProfile = (Doctor | Nurse | Nanny) & {
  category: 'doctor' | 'nurse' | 'nanny';
};

// Search filters interface
export interface SearchFilters {
  category?: 'doctor' | 'nurse' | 'nanny' | 'all';
  specialty?: string;
  location?: string;
  rating?: number;
  experience?: string;
  availability?: 'available' | 'busy' | 'all';
  priceRange?: {
    min: number;
    max: number;
  };
  languages?: string[];
  verified?: boolean;
  emergencyAvailable?: boolean;
}

// Search result interface
export interface SearchResult {
  profiles: HealthcareProfile[];
  totalCount: number;
  categories: {
    doctors: number;
    nurses: number;
    nannies: number;
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get all profiles with category labels
 */
export const getAllProfiles = (): HealthcareProfile[] => {
  return [
    ...doctorsData.map(d => ({ ...d, category: 'doctor' as const })),
    ...nursesData.map(n => ({ ...n, category: 'nurse' as const })),
    ...nanniesData.map(n => ({ ...n, category: 'nanny' as const }))
  ];
};

/**
 * Get profiles by category
 */
export const getProfilesByCategory = (category: 'doctor' | 'nurse' | 'nanny'): HealthcareProfile[] => {
  switch (category) {
    case 'doctor': 
      return doctorsData.map(d => ({ ...d, category: 'doctor' as const }));
    case 'nurse': 
      return nursesData.map(n => ({ ...n, category: 'nurse' as const }));
    case 'nanny': 
      return nanniesData.map(n => ({ ...n, category: 'nanny' as const }));
    default: 
      return [];
  }
};

/**
 * Get profile by ID across all categories
 */
export const getProfileById = (id: string): HealthcareProfile | null => {
  const allProfiles = getAllProfiles();
  return allProfiles.find(profile => profile.id === id) || null;
};

/**
 * Advanced search function with multiple filters
 */
export const searchProfiles = (
  filters: SearchFilters = {}
): SearchResult => {
  let profiles = getAllProfiles();

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    profiles = profiles.filter(profile => profile.category === filters.category);
  }



  // Filter by location
  if (filters.location) {
    const locationQuery = filters.location.toLowerCase();
    profiles = profiles.filter(profile => 
      profile.location.toLowerCase().includes(locationQuery)
    );
  }

  // Filter by minimum rating
  if (filters.rating && filters.rating > 0) {
    profiles = profiles.filter(profile => profile.rating >= filters.rating!);
  }

  // Filter by experience (extract years from experience string)
  if (filters.experience) {
    const experienceYears = parseInt(filters.experience);
    if (!isNaN(experienceYears)) {
      profiles = profiles.filter(profile => {
        const profileYears = parseInt(profile.experience);
        return !isNaN(profileYears) && profileYears >= experienceYears;
      });
    }
  }

  // Filter by price range
  if (filters.priceRange) {
    profiles = profiles.filter(profile => {
      let price = 0;
      if ('consultationFee' in profile) {
        price = profile.consultationFee;
      } else if ('hourlyRate' in profile) {
        price = profile.hourlyRate;
      }
      
      return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
    });
  }

  // Filter by languages
  if (filters.languages && filters.languages.length > 0) {
    profiles = profiles.filter(profile => 
      filters.languages!.some(lang => 
        profile.languages.some(pLang => 
          pLang.toLowerCase().includes(lang.toLowerCase())
        )
      )
    );
  }

  // Filter by verified status
  if (filters.verified !== undefined) {
    profiles = profiles.filter(profile => profile.verified === filters.verified);
  }

  // Filter by emergency availability
  if (filters.emergencyAvailable !== undefined) {
    profiles = profiles.filter(profile => {
      if ('emergencyAvailable' in profile) {
        return profile.emergencyAvailable === filters.emergencyAvailable;
      }
      return false;
    });
  }

  // Calculate category counts
  const categories = {
    doctors: profiles.filter(p => p.category === 'doctor').length,
    nurses: profiles.filter(p => p.category === 'nurse').length,
    nannies: profiles.filter(p => p.category === 'nanny').length,
  };

  return {
    profiles,
    totalCount: profiles.length,
    categories
  };
};

/**
 * Get top-rated profiles by category
 */
export const getTopRatedProfiles = (
  category: 'doctor' | 'nurse' | 'nanny' | 'all' = 'all', 
  limit: number = 5
): HealthcareProfile[] => {
  const profiles = category === 'all'
    ? getAllProfiles()
    : getProfilesByCategory(category);

  return profiles
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

/**
 * Get available profiles (those with immediate or today availability)
 */
export const getAvailableProfiles = (category?: 'doctor' | 'nurse' | 'nanny'): HealthcareProfile[] => {
  const profiles = category ? getProfilesByCategory(category) : getAllProfiles();
  
  return profiles.filter(profile => {
    const availability = profile.nextAvailable?.toLowerCase() || '';
    return (
      availability.includes('available now') ||
      availability.includes('today') ||
      availability.includes('immediately') ||
      availability.includes('on call')
    );
  });
};

/**
 * Get profiles by location
 */
export const getProfilesByLocation = (
  location: string, 
  category?: 'doctor' | 'nurse' | 'nanny'
): HealthcareProfile[] => {
  const profiles = category ? getProfilesByCategory(category) : getAllProfiles();
  const locationQuery = location.toLowerCase();
  
  return profiles.filter(profile => 
    profile.location.toLowerCase().includes(locationQuery)
  );
};



/**
 * Get unique locations across all profiles
 */
export const getAllLocations = (): string[] => {
  const allProfiles = getAllProfiles();
  const locations = new Set<string>();
  
  allProfiles.forEach(profile => {
    locations.add(profile.location);
  });
  
  return Array.from(locations).sort();
};

/**
 * Get unique languages across all profiles
 */
export const getAllLanguages = (): string[] => {
  const allProfiles = getAllProfiles();
  const languages = new Set<string>();
  
  allProfiles.forEach(profile => {
    profile.languages.forEach(lang => languages.add(lang));
  });
  
  return Array.from(languages).sort();
};

/**
 * Get statistics about the data
 */
export const getDataStatistics = () => {
  const allProfiles = getAllProfiles();
  
  const totalProfiles = allProfiles.length;
  const verifiedProfiles = allProfiles.filter(p => p.verified).length;
  const emergencyAvailableCount = allProfiles.filter(p => 
    'emergencyAvailable' in p && p.emergencyAvailable
  ).length;
  
  const averageRating = allProfiles.reduce((sum, profile) => sum + profile.rating, 0) / totalProfiles;
  
  const categories = {
    doctors: doctorsData.length,
    nurses: nursesData.length,
    nannies: nanniesData.length,
  };
  
  const locations = getAllLocations();
  const languages = getAllLanguages();
  
  return {
    totalProfiles,
    categories,
    verifiedProfiles,
    verificationRate: Math.round((verifiedProfiles / totalProfiles) * 100),
    emergencyAvailableCount,
    averageRating: Math.round(averageRating * 10) / 10,
    uniqueLocations: locations.length,
    supportedLanguages: languages.length,
    locations,
    languages
  };
};

/**
 * Sort profiles by different criteria
 */
export const sortProfiles = (
  profiles: HealthcareProfile[], 
  sortBy: 'rating' | 'experience' | 'price' | 'name' | 'reviews',
  order: 'asc' | 'desc' = 'desc'
): HealthcareProfile[] => {
  return [...profiles].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;
    
    switch (sortBy) {
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'reviews':
        aValue = a.reviews;
        bValue = b.reviews;
        break;
      case 'experience':
        aValue = parseInt(a.experience) || 0;
        bValue = parseInt(b.experience) || 0;
        break;
      case 'price':
        aValue = 'consultationFee' in a ? a.consultationFee : 
                'hourlyRate' in a ? a.hourlyRate : 0;
        bValue = 'consultationFee' in b ? b.consultationFee : 
                'hourlyRate' in b ? b.hourlyRate : 0;
        break;
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
};

/**
 * Get random profiles for featured/recommended sections
 */
export const getRandomProfiles = (
  count: number = 3, 
  category?: 'doctor' | 'nurse' | 'nanny'
): HealthcareProfile[] => {
  const profiles = category ? getProfilesByCategory(category) : getAllProfiles();
  const shuffled = [...profiles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Validate profile data structure
 */
export const validateProfileData = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const allProfiles = getAllProfiles();
  
  allProfiles.forEach((profile, index) => {
    // Check required fields
    const requiredFields = ['id', 'firstName', 'lastName', 'email', 'profileImage', 'rating', 'bio'];
    requiredFields.forEach(field => {
      if (!profile[field as keyof HealthcareProfile]) {
        errors.push(`Profile ${index + 1}: Missing ${field}`);
      }
    });
    
    // Check rating range
    if (profile.rating < 0 || profile.rating > 5) {
      errors.push(`Profile ${index + 1}: Rating must be between 0 and 5`);
    }
    
    // Check image path
    if (!profile.profileImage.startsWith('/images/')) {
      errors.push(`Profile ${index + 1}: Invalid image path`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};


const dataUtils = {
  getAllProfiles,
  getProfilesByCategory,
  getProfileById,
  searchProfiles,
  getTopRatedProfiles,
  getAvailableProfiles,
  getProfilesByLocation,
  getAllLocations,
  getAllLanguages,
  getDataStatistics,
  sortProfiles,
  getRandomProfiles,
  validateProfileData
};

export default dataUtils;