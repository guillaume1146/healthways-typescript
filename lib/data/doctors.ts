export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  category: string;
  specialty: string[];
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  address: string;
  languages: string[];
  consultationFee: number;
  videoConsultationFee: number;
  availability: string;
  nextAvailable: string;
  bio: string;
  education: string[];
  workHistory: string[];
  certifications: string[];
  consultationTypes: string[];
  emergencyAvailable: boolean;
  phone: string;
  age: number;
  verified: boolean;
  patientComments: string[];
}

export const doctorsData: Doctor[] = [
  {
    id: "DOC001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@healthwyz.mu",
    password: "SecurePass123!",
    profileImage: "/images/doctors/1.jpg",
    category: "Specialist",
    specialty: ["Cardiology", "Interventional Cardiology"],
    rating: 4.8,
    reviews: 342,
    experience: "15 years",
    location: "Port Louis",
    address: "Apollo Bramwell Hospital, Port Louis",
    languages: ["English", "French", "Creole"],
    consultationFee: 2500,
    videoConsultationFee: 2000,
    availability: "Mon-Fri, 8:00 AM - 6:00 PM",
    nextAvailable: "Tomorrow, 10:00 AM",
    bio: "Experienced cardiologist with over 15 years of practice, specializing in interventional procedures and heart disease prevention.",
    education: ["MBBS - University of Mauritius", "MD Cardiology - King&apos;s College London", "Fellowship in Interventional Cardiology - Harvard Medical School"],
    workHistory: ["Senior Cardiologist at Apollo Bramwell (2015-present)", "Consultant at SSR Hospital (2010-2015)", "Resident at Victoria Hospital (2008-2010)"],
    certifications: ["FESC", "FACC", "Board Certified Cardiologist"],
    consultationTypes: ["In-Person", "Video Consultation", "Emergency"],
    emergencyAvailable: true,
    phone: "+230 5123 4567",
    age: 42,
    verified: true,
    patientComments: [
      "Dr. Johnson saved my life with her quick diagnosis and treatment.",
      "Very professional and caring doctor, explains everything clearly.",
      "Excellent bedside manner, highly recommend for heart issues."
    ]
  },
  {
    id: "DOC002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@medcare.mu",
    password: "MedSecure456#",
    profileImage: "/images/doctors/2.jpg",
    category: "Specialist",
    specialty: ["Neurology", "Epilepsy"],
    rating: 4.9,
    reviews: 278,
    experience: "12 years",
    location: "Curepipe",
    address: "Clinique du Nord, Curepipe",
    languages: ["English", "Mandarin", "French"],
    consultationFee: 2800,
    videoConsultationFee: 2200,
    availability: "Mon-Sat, 9:00 AM - 5:00 PM",
    nextAvailable: "Today, 2:00 PM",
    bio: "Specialized neurologist with expertise in treating epilepsy, migraines, and neurological disorders using latest treatment protocols.",
    education: ["MBBS - University of Sydney", "MD Neurology - Johns Hopkins", "Fellowship in Epilepsy - Mayo Clinic"],
    workHistory: ["Lead Neurologist at Clinique du Nord (2018-present)", "Neurologist at Wellkin Hospital (2012-2018)", "Neurology Resident at Sydney Hospital (2010-2012)"],
    certifications: ["Board Certified Neurologist", "Epilepsy Specialist", "EEG Certified"],
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: true,
    phone: "+230 5234 5678",
    age: 38,
    verified: true,
    patientComments: [
      "Dr. Chen helped control my epilepsy completely, life-changing treatment.",
      "Very knowledgeable and patient, takes time to explain conditions.",
      "Best neurologist in Mauritius, highly skilled and compassionate."
    ]
  },
  {
    id: "DOC003",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@pediatrics.mu",
    password: "KidsHealth789$",
    profileImage: "/images/doctors/3.jpg",
    category: "Specialist",
    specialty: ["Pediatrics", "Child Development"],
    rating: 4.7,
    reviews: 445,
    experience: "10 years",
    location: "Phoenix",
    address: "Children&apos;s Medical Center, Phoenix",
    languages: ["English", "Hindi", "French", "Creole"],
    consultationFee: 2200,
    videoConsultationFee: 1800,
    availability: "Mon-Fri, 8:00 AM - 7:00 PM, Sat 9:00 AM - 1:00 PM",
    nextAvailable: "Tomorrow, 9:00 AM",
    bio: "Dedicated pediatrician focused on comprehensive child healthcare, vaccinations, and developmental assessments.",
    education: ["MBBS - AIIMS Delhi", "MD Pediatrics - Christian Medical College", "Child Development Certificate - Boston Children&apos;s Hospital"],
    workHistory: ["Senior Pediatrician at Children&apos;s Medical Center (2019-present)", "Pediatrician at Fortis Hospital (2014-2019)", "Pediatric Resident at AIIMS (2012-2014)"],
    certifications: ["Board Certified Pediatrician", "Child Development Specialist", "Vaccination Expert"],
    consultationTypes: ["In-Person", "Video Consultation", "Home Visit"],
    emergencyAvailable: false,
    phone: "+230 5345 6789",
    age: 35,
    verified: true,
    patientComments: [
      "My children love Dr. Sharma, she&apos;s so gentle and caring.",
      "Excellent with kids, very thorough examinations and explanations.",
      "Trusted our family pediatrician for 5 years, highly recommend."
    ]
  },
  {
    id: "DOC004",
    firstName: "David",
    lastName: "Williams",
    email: "david.williams@orthopedics.mu",
    password: "BoneDoc321!",
    profileImage: "/images/doctors/4.jpg",
    category: "Surgeon",
    specialty: ["Orthopedic Surgery", "Sports Medicine"],
    rating: 4.6,
    reviews: 189,
    experience: "18 years",
    location: "Quatre Bornes",
    address: "Orthopedic Specialists Clinic, Quatre Bornes",
    languages: ["English", "French"],
    consultationFee: 3000,
    videoConsultationFee: 0,
    availability: "Mon, Wed, Fri: 2:00 PM - 8:00 PM",
    nextAvailable: "Friday, 3:00 PM",
    bio: "Experienced orthopedic surgeon specializing in joint replacement, sports injuries, and minimally invasive procedures.",
    education: ["MBBS - University of Cape Town", "MS Orthopedics - Oxford University", "Fellowship in Sports Medicine - University of Pittsburgh"],
    workHistory: ["Senior Orthopedic Surgeon at Orthopedic Specialists (2015-present)", "Consultant Surgeon at Wellkin Hospital (2010-2015)", "Orthopedic Resident at Groote Schuur Hospital (2006-2010)"],
    certifications: ["Fellow of Royal College of Surgeons", "Sports Medicine Specialist", "Joint Replacement Certified"],
    consultationTypes: ["In-Person"],
    emergencyAvailable: true,
    phone: "+230 5456 7890",
    age: 45,
    verified: true,
    patientComments: [
      "Dr. Williams performed my knee surgery perfectly, walking pain-free now.",
      "Professional surgeon, excellent post-op care and follow-up.",
      "Highly skilled in sports injuries, got me back to playing tennis."
    ]
  },
  {
    id: "DOC005",
    firstName: "Aisha",
    lastName: "Patel",
    email: "aisha.patel@dermatology.mu",
    password: "SkinCare654#",
    profileImage: "/images/doctors/5.jpg",
    category: "Specialist",
    specialty: ["Dermatology", "Cosmetic Dermatology"],
    rating: 4.8,
    reviews: 267,
    experience: "8 years",
    location: "Rose Hill",
    address: "Skin Health Clinic, Rose Hill",
    languages: ["English", "Gujarati", "Hindi", "French"],
    consultationFee: 2400,
    videoConsultationFee: 2000,
    availability: "Tue-Sat, 10:00 AM - 6:00 PM",
    nextAvailable: "Thursday, 11:00 AM",
    bio: "Dermatologist with expertise in medical and cosmetic dermatology, acne treatment, and anti-aging procedures.",
    education: ["MBBS - Grant Medical College Mumbai", "MD Dermatology - KEM Hospital", "Cosmetic Dermatology Fellowship - American Academy of Dermatology"],
    workHistory: ["Consultant Dermatologist at Skin Health Clinic (2020-present)", "Dermatologist at Apollo Spectra (2016-2020)", "Dermatology Resident at KEM Hospital (2014-2016)"],
    certifications: ["Board Certified Dermatologist", "Cosmetic Procedures Certified", "Laser Treatment Specialist"],
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: false,
    phone: "+230 5567 8901",
    age: 33,
    verified: true,
    patientComments: [
      "Dr. Patel cleared my acne completely, amazing results!",
      "Very knowledgeable about skin conditions, professional service.",
      "Great cosmetic treatments, natural-looking results."
    ]
  },
  {
    id: "DOC006",
    firstName: "James",
    lastName: "Rodriguez",
    email: "james.rodriguez@emergency.mu",
    password: "EmergencyDoc987!",
    profileImage: "/images/doctors/16.jpg",
    category: "Emergency",
    specialty: ["Emergency Medicine", "Trauma Care"],
    rating: 4.7,
    reviews: 189,
    experience: "11 years",
    location: "Port Louis",
    address: "Victoria Hospital Emergency Department",
    languages: ["English", "Spanish", "French"],
    consultationFee: 0,
    videoConsultationFee: 0,
    availability: "24/7 Emergency",
    nextAvailable: "Always Available",
    bio: "Emergency physician with extensive trauma experience, specialized in critical care and life-saving interventions.",
    education: ["MD - University of Barcelona", "Emergency Medicine Residency - Johns Hopkins", "Trauma Surgery Fellowship - Massachusetts General"],
    workHistory: ["Emergency Department Director at Victoria Hospital (2020-present)", "Senior Emergency Physician at Apollo Bramwell (2015-2020)", "Emergency Medicine Resident (2012-2015)"],
    certifications: ["Board Certified Emergency Medicine", "ATLS Instructor", "ACLS Provider"],
    consultationTypes: ["Emergency Only"],
    emergencyAvailable: true,
    phone: "999",
    age: 39,
    verified: true,
    patientComments: [
      "Dr. Rodriguez saved my life after my car accident, incredible skill.",
      "Professional and calm during emergency, excellent trauma care.",
      "Quick thinking and expert care in critical situation."
    ]
  },
  {
    id: "DOC007",
    firstName: "Fatima",
    lastName: "Al-Zahra",
    email: "fatima.alzahra@ophthalmology.mu",
    password: "EyeDoc456@",
    profileImage: "/images/doctors/17.jpg",
    category: "Specialist",
    specialty: ["Ophthalmology", "Retinal Surgery"],
    rating: 4.8,
    reviews: 234,
    experience: "13 years",
    location: "Ebene",
    address: "Eye Care Excellence Center, Ebene",
    languages: ["English", "Arabic", "French"],
    consultationFee: 2600,
    videoConsultationFee: 2100,
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    nextAvailable: "Next Tuesday, 10:00 AM",
    bio: "Renowned ophthalmologist specializing in retinal diseases, cataract surgery, and advanced eye care procedures.",
    education: ["MBBS - Damascus University", "Ophthalmology Residency - Moorfields Eye Hospital", "Retinal Fellowship - Bascom Palmer Eye Institute"],
    workHistory: ["Senior Ophthalmologist at Eye Care Excellence (2018-present)", "Consultant Ophthalmologist at Apollo Spectra (2012-2018)", "Ophthalmology Fellow at Moorfields (2010-2012)"],
    certifications: ["Fellow of Royal College of Ophthalmologists", "Retinal Surgery Specialist", "Laser Treatment Certified"],
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: true,
    phone: "+230 5678 9012",
    age: 41,
    verified: true,
    patientComments: [
      "Dr. Al-Zahra performed perfect cataract surgery, vision is crystal clear.",
      "Excellent eye specialist, very thorough examinations.",
      "Professional and skilled, restored my vision completely."
    ]
  },
  {
    id: "DOC008",
    firstName: "Kevin",
    lastName: "Lim",
    email: "kevin.lim@dentistry.mu",
    password: "DentalCare789#",
    profileImage: "/images/doctors/18.jpg",
    category: "Dentist",
    specialty: ["General Dentistry", "Cosmetic Dentistry"],
    rating: 4.6,
    reviews: 312,
    experience: "9 years",
    location: "Curepipe",
    address: "Perfect Smile Dental Clinic, Curepipe",
    languages: ["English", "Mandarin", "French"],
    consultationFee: 1800,
    videoConsultationFee: 0,
    availability: "Mon-Sat, 8:00 AM - 6:00 PM",
    nextAvailable: "Tomorrow, 2:00 PM",
    bio: "General and cosmetic dentist focused on comprehensive dental care, smile makeovers, and preventive dentistry.",
    education: ["DDS - National University of Singapore", "Cosmetic Dentistry Certificate - New York University", "Implantology Course - Nobel Biocare"],
    workHistory: ["Senior Dentist at Perfect Smile Dental (2019-present)", "Associate Dentist at Dental Care Plus (2015-2019)", "Dental Resident at Singapore General Hospital (2013-2015)"],
    certifications: ["Licensed Dentist", "Cosmetic Dentistry Specialist", "Dental Implant Certified"],
    consultationTypes: ["In-Person"],
    emergencyAvailable: true,
    phone: "+230 5789 0123",
    age: 34,
    verified: true,
    patientComments: [
      "Dr. Lim gave me the perfect smile makeover, amazing results.",
      "Gentle dentist, excellent with anxious patients.",
      "Professional dental care, very modern techniques."
    ]
  },
  {
    id: "DOC009",
    firstName: "Isabella",
    lastName: "Costa",
    email: "isabella.costa@psychiatry.mu",
    password: "MindHealth123$",
    profileImage: "/images/doctors/19.jpg",
    category: "Mental Health",
    specialty: ["Psychiatry", "Anxiety Disorders", "Depression"],
    rating: 4.9,
    reviews: 156,
    experience: "14 years",
    location: "Rose Hill",
    address: "Mental Health Wellness Center, Rose Hill",
    languages: ["English", "Portuguese", "French", "Spanish"],
    consultationFee: 3000,
    videoConsultationFee: 2500,
    availability: "Mon-Fri, 10:00 AM - 6:00 PM",
    nextAvailable: "Friday, 11:00 AM",
    bio: "Compassionate psychiatrist specializing in anxiety, depression, and mood disorders with both therapy and medication management.",
    education: ["MD Psychiatry - University of São Paulo", "Cognitive Behavioral Therapy Training - Beck Institute", "EMDR Therapy Certification"],
    workHistory: ["Lead Psychiatrist at Mental Health Wellness Center (2017-present)", "Consultant Psychiatrist at Brown Sequard Hospital (2012-2017)", "Psychiatric Resident at Hospital das Clínicas (2009-2012)"],
    certifications: ["Board Certified Psychiatrist", "CBT Therapist", "EMDR Certified"],
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: true,
    phone: "+230 5890 1234",
    age: 43,
    verified: true,
    patientComments: [
      "Dr. Costa helped me overcome severe anxiety, life-changing treatment.",
      "Very understanding and professional, excellent therapy sessions.",
      "Compassionate psychiatrist, great combination of therapy and medication."
    ]
  },
  {
    id: "DOC010",
    firstName: "Raj",
    lastName: "Patel",
    email: "raj.patel@gastroenterology.mu",
    password: "DigestiveHealth456!",
    profileImage: "/images/doctors/20.jpg",
    category: "Specialist",
    specialty: ["Gastroenterology", "Endoscopy"],
    rating: 4.7,
    reviews: 198,
    experience: "12 years",
    location: "Phoenix",
    address: "Digestive Health Specialists, Phoenix",
    languages: ["English", "Gujarati", "Hindi", "French"],
    consultationFee: 2700,
    videoConsultationFee: 2200,
    availability: "Mon-Thu, 9:00 AM - 5:00 PM",
    nextAvailable: "Monday, 3:00 PM",
    bio: "Gastroenterologist with expertise in digestive disorders, endoscopic procedures, and inflammatory bowel disease management.",
    education: ["MBBS - BJ Medical College", "MD Gastroenterology - All India Institute", "Advanced Endoscopy Fellowship - Mayo Clinic"],
    workHistory: ["Senior Gastroenterologist at Digestive Health Specialists (2018-present)", "Consultant at Fortis Hospital (2013-2018)", "Gastroenterology Fellow at AIIMS (2011-2013)"],
    certifications: ["Board Certified Gastroenterologist", "Advanced Endoscopy", "IBD Specialist"],
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: false,
    phone: "+230 5901 2345",
    age: 40,
    verified: true,
    patientComments: [
      "Dr. Patel diagnosed my condition accurately, excellent endoscopy.",
      "Very knowledgeable about digestive issues, professional care.",
      "Helped manage my IBD effectively, great follow-up care."
    ]
  }
];