export interface Nanny {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  type: string;
  specialization: string[];
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  address: string;
  languages: string[];
  hourlyRate: number;
  monthlyRate: number;
  availability: string;
  nextAvailable: string;
  bio: string;
  ageGroups: string[];
  education: string[];
  workHistory: string[];
  certifications: string[];
  services: string[];
  activities: string[];
  verified: boolean;
  backgroundCheck: boolean;
  references: number;
  phone: string;
  age: number;
  transportAvailable: boolean;
  patientComments: string[];
}

export const nanniesData: Nanny[] = [
  {
    id: "NAN001",
    firstName: "Emma",
    lastName: "Williams",
    email: "emma.williams@childcare.mu",
    password: "NannyCare123!",
    profileImage: "/images/nannies/11.jpg",
    type: "Professional Nanny",
    specialization: ["Infant Care", "Toddler Development", "Educational Activities"],
    rating: 4.9,
    reviews: 156,
    experience: "8 years",
    location: "Port Louis",
    address: "Available for home visits",
    languages: ["English", "French", "Sign Language"],
    hourlyRate: 25,
    monthlyRate: 2800,
    availability: "Mon-Fri, 7:00 AM - 7:00 PM",
    nextAvailable: "Available Now",
    bio: "Passionate professional nanny with expertise in early childhood development, Montessori methods, and creating engaging educational activities for children.",
    ageGroups: ["0-1 year", "1-3 years", "3-5 years"],
    education: ["Early Childhood Education Degree - University of Mauritius", "Montessori Teaching Certificate", "Child Psychology Course - International Institute"],
    workHistory: ["Senior Nanny at Elite Childcare Services (2019-present)", "Daycare Teacher at Little Scholars (2016-2019)", "Nanny for Private Families (2014-2016)"],
    certifications: ["CPR & First Aid", "Early Childhood Education", "Food Safety", "Child Protection"],
    services: ["Full-time", "Part-time", "Live-out", "Overnight Care", "Weekend Care"],
    activities: ["Reading", "Arts & Crafts", "Music", "Outdoor Play", "Educational Games"],
    verified: true,
    backgroundCheck: true,
    references: 3,
    phone: "+230 5789 1001",
    age: 31,
    transportAvailable: true,
    patientComments: [
      "Emma is incredible with our twins, very professional and caring.",
      "Our children learned so much with Emma, highly educational approach.",
      "Trustworthy and reliable, became part of our family."
    ]
  },
  {
    id: "NAN002",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@aupair.mu",
    password: "AuPair456#",
    profileImage: "/images/nannies/12.jpg",
    type: "Au Pair",
    specialization: ["Live-in Childcare", "Language Teaching", "Cultural Exchange"],
    rating: 4.8,
    reviews: 89,
    experience: "5 years",
    location: "Curepipe",
    address: "Willing to relocate",
    languages: ["French", "English", "Spanish", "Creole"],
    hourlyRate: 20,
    monthlyRate: 2200,
    availability: "Live-in, Flexible Schedule",
    nextAvailable: "From next Monday",
    bio: "Experienced au pair who creates fun, safe, and educational environments for children while helping with light household tasks and cultural exchange.",
    ageGroups: ["3-5 years", "6-10 years", "11+ years"],
    education: ["Bachelor in Education - University of Lyon", "TEFL Certificate", "Au Pair Training Program - Cultural Care"],
    workHistory: ["Au Pair in France (2019-2021)", "Au Pair in Spain (2021-2023)", "Private Nanny in Mauritius (2023-present)"],
    certifications: ["Au Pair Certificate", "First Aid", "International Driver&apos;s License", "TEFL Certified"],
    services: ["Live-in Care", "Language Teaching", "Light Housekeeping", "Travel Care", "Homework Help"],
    activities: ["Language Learning", "Cultural Activities", "Sports", "Cooking", "Travel Games"],
    verified: true,
    backgroundCheck: true,
    references: 4,
    phone: "+230 5789 1002",
    age: 26,
    transportAvailable: true,
    patientComments: [
      "Sophie taught our children French beautifully, very cultured.",
      "Wonderful au pair, brought international perspective to our home.",
      "Great with teenagers, helped with homework and activities."
    ]
  },
  {
    id: "NAN003",
    firstName: "Ravi",
    lastName: "Ramesh",
    email: "ravi.ramesh@babysitter.mu",
    password: "BabySit789$",
    profileImage: "/images/nannies/13.jpg",
    type: "Babysitter",
    specialization: ["Evening Care", "Weekend Sitting", "Special Events"],
    rating: 4.7,
    reviews: 201,
    experience: "4 years",
    location: "Phoenix",
    address: "Available for home visits",
    languages: ["English", "Hindi", "Tamil", "Creole"],
    hourlyRate: 18,
    monthlyRate: 1800,
    availability: "Evenings, Weekends, and Holidays",
    nextAvailable: "This Saturday",
    bio: "Reliable and energetic babysitter specializing in evening and weekend childcare, perfect for date nights and special events.",
    ageGroups: ["2-5 years", "6-10 years", "11+ years"],
    education: ["Child Development Course - Mauritius Institute of Education", "Recreation Leadership Certificate", "Youth Work Diploma"],
    workHistory: ["Freelance Babysitter (2020-present)", "After-school Program Assistant (2018-2020)", "Summer Camp Counselor (2017-2018)"],
    certifications: ["First Aid & CPR", "Child Safety", "Recreation Leadership"],
    services: ["Evening Care", "Weekend Sitting", "Special Events", "Date Night Care"],
    activities: ["Games", "Movies", "Outdoor Activities", "Homework Help", "Bedtime Routines"],
    verified: true,
    backgroundCheck: true,
    references: 5,
    phone: "+230 5789 1003",
    age: 24,
    transportAvailable: false,
    patientComments: [
      "Ravi is perfect for date nights, kids always ask for him back.",
      "Very responsible babysitter, great with active children.",
      "Reliable and punctual, children have so much fun with him."
    ]
  },
  {
    id: "NAN004",
    firstName: "Claire",
    lastName: "Dubois",
    email: "claire.dubois@specialneeds.mu",
    password: "SpecialCare321!",
    profileImage: "/images/nannies/14.jpg",
    type: "Special Needs Caregiver",
    specialization: ["Autism Care", "Developmental Delays", "Behavioral Support"],
    rating: 4.9,
    reviews: 76,
    experience: "7 years",
    location: "Rose Hill",
    address: "Available for home and therapy center visits",
    languages: ["English", "French", "Basic Sign Language"],
    hourlyRate: 35,
    monthlyRate: 3500,
    availability: "Mon-Fri, 8:00 AM - 6:00 PM",
    nextAvailable: "Next Wednesday",
    bio: "Specialized caregiver with extensive training in supporting children with special needs, autism, and developmental challenges.",
    ageGroups: ["2-5 years", "6-10 years", "11+ years"],
    education: ["Special Education Degree - University of Mauritius", "Applied Behavior Analysis Certificate", "Autism Spectrum Disorders Specialization"],
    workHistory: ["Special Needs Caregiver at Rainbow Center (2018-present)", "ABA Therapist Assistant (2016-2018)", "Special Education Teacher Aide (2014-2016)"],
    certifications: ["Special Education Certificate", "ABA Therapy", "Crisis Prevention", "First Aid & CPR"],
    services: ["Special Needs Care", "ABA Therapy Support", "Behavioral Intervention", "Life Skills Training"],
    activities: ["Sensory Play", "Structured Learning", "Communication Exercises", "Life Skills Practice"],
    verified: true,
    backgroundCheck: true,
    references: 4,
    phone: "+230 5789 1004",
    age: 33,
    transportAvailable: true,
    patientComments: [
      "Claire transformed our autistic son&apos;s daily routine, incredible progress.",
      "Very patient and skilled with special needs children.",
      "Professional and understanding, made huge difference in our child&apos;s development."
    ]
  },
  {
    id: "NAN005",
    firstName: "Amanda",
    lastName: "Johnson",
    email: "amanda.johnson@newborn.mu",
    password: "NewbornCare654#",
    profileImage: "/images/nannies/15.jpg",
    type: "Newborn Specialist",
    specialization: ["Newborn Care", "Sleep Training", "Breastfeeding Support"],
    rating: 4.8,
    reviews: 112,
    experience: "6 years",
    location: "Quatre Bornes",
    address: "Available for home visits",
    languages: ["English", "French"],
    hourlyRate: 30,
    monthlyRate: 3200,
    availability: "Mon-Fri, 6:00 AM - 6:00 PM",
    nextAvailable: "Next Monday",
    bio: "Experienced newborn specialist providing expert care for infants, including sleep training, feeding support, and parental guidance.",
    ageGroups: ["0-1 year"],
    education: ["Neonatal Care Certification - International Board of Lactation Consultant Examiners", "Infant Sleep Specialist Course", "Postnatal Care Training"],
    workHistory: ["Newborn Specialist at Baby Bliss (2018-present)", "Lactation Consultant Assistant (2016-2018)", "Postnatal Care Nurse (2014-2016)"],
    certifications: ["Neonatal Care", "Lactation Consultant", "Infant CPR", "Sleep Training Specialist"],
    services: ["Newborn Care", "Sleep Training", "Breastfeeding Support", "Parental Guidance"],
    activities: ["Feeding Support", "Sleep Routines", "Soothing Techniques", "Parental Education"],
    verified: true,
    backgroundCheck: true,
    references: 3,
    phone: "+230 5789 1005",
    age: 29,
    transportAvailable: true,
    patientComments: [
        "Amanda&apos;s newborn care advice was invaluable, our baby sleeps through the night now.",
        "Excellent with newborns, very gentle and knowledgeable.",
        "Helped me with breastfeeding challenges, so supportive and understanding."
        ]
    },
    {
    id: "NAN006",
    firstName: "Marcus",
    lastName: "Thompson",
    email: "marcus.thompson@governess.mu",
    password: "Tutor123!",
    profileImage: "/images/nannies/24.jpg",
    type: "Governess/Tutor",
    specialization: ["Academic Tutoring", "Homework Supervision", "Educational Planning"],
    rating: 4.8,
    reviews: 134,
    experience: "7 years",
    location: "Ebene",
    address: "Available for home visits",
    languages: ["English", "French", "German"],
    hourlyRate: 28,
    monthlyRate: 3000,
    availability: "Mon-Fri, 3:00 PM - 8:00 PM, Weekends available",
    nextAvailable: "This Monday",
    bio: "Professional governess and tutor specializing in academic support, homework supervision, and educational development for school-age children.",
    ageGroups: ["6-10 years", "11+ years"],
    education: ["Master&apos;s in Education - Oxford University", "Teaching Certificate", "Child Psychology Diploma"],
    workHistory: ["Private Governess for Executive Families (2018-present)", "Primary School Teacher at International School (2015-2018)", "Private Tutor (2013-2015)"],
    certifications: ["Licensed Teacher", "Child Protection", "First Aid & CPR", "Educational Psychology"],
    services: ["Academic Tutoring", "Homework Supervision", "Educational Planning", "School Preparation"],
    activities: ["Educational Games", "Science Experiments", "Reading Comprehension", "Math Practice"],
    verified: true,
    backgroundCheck: true,
    references: 4,
    phone: "+230 5345 6789",
    age: 32,
    transportAvailable: true,
    patientComments: [
      "Marcus improved our son&apos;s grades significantly, excellent tutor.",
      "Professional governess, great educational support.",
      "Very knowledgeable and patient with academic challenges."
    ]
  },
  {
    id: "NAN007",
    firstName: "Lily",
    lastName: "Chen",
    email: "lily.chen@multilingual.mu",
    password: "Languages456#",
    profileImage: "/images/nannies/25.jpg",
    type: "Multilingual Nanny",
    specialization: ["Language Teaching", "Cultural Education", "Bilingual Development"],
    rating: 4.9,
    reviews: 98,
    experience: "6 years",
    location: "Port Louis",
    address: "Available for home visits",
    languages: ["English", "Mandarin", "Cantonese", "French"],
    hourlyRate: 26,
    monthlyRate: 2900,
    availability: "Mon-Fri, 7:00 AM - 6:00 PM",
    nextAvailable: "Available Now",
    bio: "Multilingual nanny specializing in language immersion, cultural education, and helping children develop bilingual or multilingual skills.",
    ageGroups: ["2-5 years", "6-10 years", "11+ years"],
    education: ["Bachelor in Applied Linguistics - Beijing University", "Early Childhood Education Certificate", "TEFL Certification"],
    workHistory: ["Multilingual Nanny for International Families (2019-present)", "Language Teacher at International Preschool (2017-2019)", "Private Language Tutor (2016-2017)"],
    certifications: ["TEFL Certified", "Early Childhood Education", "First Aid & CPR", "Cultural Education Specialist"],
    services: ["Language Immersion", "Cultural Education", "Academic Support", "Travel Care"],
    activities: ["Language Games", "Cultural Activities", "Educational Apps", "Storytelling"],
    verified: true,
    backgroundCheck: true,
    references: 5,
    phone: "+230 5456 7890",
    age: 28,
    transportAvailable: true,
    patientComments: [
      "Lily taught our children Mandarin beautifully, very engaging.",
      "Excellent multilingual care, children learned so much culturally.",
      "Professional and caring, great with language development."
    ]
  }
];