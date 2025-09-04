export interface Nurse {
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
  availability: string;
  nextAvailable: string;
  bio: string;
  education: string[];
  workHistory: string[];
  certifications: string[];
  services: string[];
  verified: boolean;
  emergencyAvailable: boolean;
  phone: string;
  age: number;
  patientComments: string[];
}

export const nursesData: Nurse[] = [
  {
    id: "NUR001",
    firstName: "Maria",
    lastName: "Thompson",
    email: "maria.thompson@homecare.mu",
    password: "CareGiver123!",
    profileImage: "/images/nurses/6.jpg",
    type: "Registered Nurse",
    specialization: ["Elderly Care", "Dementia Care", "Palliative Care"],
    rating: 4.9,
    reviews: 342,
    experience: "12 years",
    location: "Port Louis",
    address: "Central Healthcare Services, Port Louis",
    languages: ["English", "French", "Creole"],
    hourlyRate: 45,
    availability: "24/7 Available",
    nextAvailable: "Available Now",
    bio: "Compassionate registered nurse specialized in geriatric care with extensive experience in managing chronic conditions and providing end-of-life care.",
    education: ["BSN - University of Mauritius", "Geriatric Nursing Certificate - Royal College of Nursing", "Palliative Care Specialization - Hospice Foundation"],
    workHistory: ["Senior Nurse at Central Healthcare (2018-present)", "ICU Nurse at Victoria Hospital (2012-2018)", "Staff Nurse at SSR Hospital (2010-2012)"],
    certifications: ["Critical Care Registered Nurse", "Geriatric Nursing Certification", "BLS & ACLS Certified"],
    services: ["Home Care", "Hospital Care", "Night Shift Available", "Medication Management"],
    verified: true,
    emergencyAvailable: true,
    phone: "+230 5789 0123",
    age: 38,
    patientComments: [
      "Maria took excellent care of my elderly mother, very professional.",
      "Compassionate and skilled, made difficult times bearable for our family.",
      "Highly recommend for elderly care, goes above and beyond."
    ]
  },
  {
    id: "NUR002",
    firstName: "Jean-Pierre",
    lastName: "Laurent",
    email: "jp.laurent@recovery.mu",
    password: "Healing456#",
    profileImage: "/images/nurses/7.jpg",
    type: "Licensed Practical Nurse",
    specialization: ["Post-Surgery Care", "Wound Care", "Physical Therapy Support"],
    rating: 4.7,
    reviews: 256,
    experience: "8 years",
    location: "Curepipe",
    address: "MediCare Plus, Curepipe",
    languages: ["French", "English", "Creole"],
    hourlyRate: 40,
    availability: "Mon-Sat, 8:00 AM - 8:00 PM",
    nextAvailable: "Today, 3:00 PM",
    bio: "Experienced LPN specializing in post-operative care and wound management, helping patients recover safely and comfortably at home.",
    education: ["LPN Diploma - Mauritius Institute of Health", "Wound Care Certification - International Association of Healthcare", "Physical Therapy Assistant Course - Allied Health Institute"],
    workHistory: ["Home Care Nurse at MediCare Plus (2019-present)", "Hospital LPN at Apollo Bramwell (2016-2019)", "Clinic Nurse at Family Health Center (2014-2016)"],
    certifications: ["Licensed Practical Nurse", "Wound Care Certified", "Basic Life Support"],
    services: ["Home Care", "Day Care", "Rehabilitation Support", "Wound Dressing"],
    verified: true,
    emergencyAvailable: false,
    phone: "+230 5789 0124",
    age: 34,
    patientComments: [
      "Jean-Pierre helped me recover perfectly after my surgery.",
      "Professional wound care, healed faster than expected.",
      "Excellent rehabilitation support, very patient and encouraging."
    ]
  },
  {
    id: "NUR003",
    firstName: "Priya",
    lastName: "Devi",
    email: "priya.devi@childcare.mu",
    password: "KidsNurse789$",
    profileImage: "/images/nurses/8.jpg",
    type: "Pediatric Nurse",
    specialization: ["Child Care", "Infant Care", "Pediatric Emergency"],
    rating: 4.8,
    reviews: 198,
    experience: "6 years",
    location: "Phoenix",
    address: "Children&apos;s Healthcare Center, Phoenix",
    languages: ["English", "Hindi", "French", "Creole"],
    hourlyRate: 42,
    availability: "Mon-Fri, 7:00 AM - 7:00 PM",
    nextAvailable: "Tomorrow, 8:00 AM",
    bio: "Specialized pediatric nurse with expertise in infant care, childhood illnesses, and emergency pediatric situations.",
    education: ["BSN with Pediatric Specialization - University of Technology Mauritius", "Pediatric Advanced Life Support - American Heart Association", "Neonatal Care Certificate - International Childbirth Education"],
    workHistory: ["Pediatric Nurse at Children&apos;s Healthcare Center (2020-present)", "NICU Nurse at Victoria Hospital (2018-2020)", "Pediatric Ward Nurse at SSR Hospital (2016-2018)"],
    certifications: ["Pediatric Advanced Life Support", "Neonatal Resuscitation", "Child Protection Certified"],
    services: ["Child Home Care", "Newborn Care", "Sick Child Care", "Post-vaccination monitoring"],
    verified: true,
    emergencyAvailable: true,
    phone: "+230 5789 0125",
    age: 29,
    patientComments: [
      "Priya is amazing with children, my kids love her.",
      "Very knowledgeable about child health, provided excellent care.",
      "Professional and caring, handled emergency situation perfectly."
    ]
  },
  {
    id: "NUR004",
    firstName: "Robert",
    lastName: "Singh",
    email: "robert.singh@criticalcare.mu",
    password: "ICUNurse321!",
    profileImage: "/images/nurses/9.jpg",
    type: "Critical Care Nurse",
    specialization: ["ICU Care", "Ventilator Management", "Cardiac Care"],
    rating: 4.9,
    reviews: 167,
    experience: "14 years",
    location: "Ebene",
    address: "Advanced Medical Center, Ebene",
    languages: ["English", "Hindi", "French"],
    hourlyRate: 55,
    availability: "24/7 Available for Critical Cases",
    nextAvailable: "On Call",
    bio: "Highly experienced critical care nurse specializing in ICU patient management, ventilator care, and cardiac monitoring.",
    education: ["BSN - University of Mauritius", "Critical Care Nursing Specialization - Johns Hopkins Online", "Cardiac Life Support Instructor - American Heart Association"],
    workHistory: ["ICU Charge Nurse at Advanced Medical Center (2016-present)", "Critical Care Nurse at Apollo Bramwell (2010-2016)", "Cardiac Unit Nurse at Wellkin Hospital (2008-2010)"],
    certifications: ["Critical Care Registered Nurse", "Advanced Cardiovascular Life Support Instructor", "Mechanical Ventilation Certified"],
    services: ["ICU Home Care", "Ventilator Care", "Cardiac Monitoring", "Critical Patient Transport"],
    verified: true,
    emergencyAvailable: true,
    phone: "+230 5789 0126",
    age: 41,
    patientComments: [
      "Robert&apos;s expertise saved my husband&apos;s life during critical illness.",
      "Exceptional ICU nurse, very skilled with complex medical equipment.",
      "Professional and calm under pressure, excellent critical care."
    ]
  },
  {
    id: "NUR005",
    firstName: "Lisa",
    lastName: "Wong",
    email: "lisa.wong@mentalhealth.mu",
    password: "MindCare654#",
    profileImage: "/images/nurses/10.jpg",
    type: "Mental Health Nurse",
    specialization: ["Mental Health", "Psychiatric Care", "Addiction Recovery"],
    rating: 4.6,
    reviews: 134,
    experience: "9 years",
    location: "Quatre Bornes",
    address: "Mental Wellness Center, Quatre Bornes",
    languages: ["English", "Mandarin", "French"],
    hourlyRate: 48,
    availability: "Mon-Fri, 9:00 AM - 6:00 PM",
    nextAvailable: "Thursday, 10:00 AM",
    bio: "Specialized mental health nurse providing compassionate care for individuals with psychiatric conditions and addiction recovery support.",
    education: ["BSN with Mental Health Specialization - University of Technology", "Psychiatric Mental Health Nursing Certificate - International Board of Nursing", "Addiction Counseling Certificate - National Association of Addiction"],
    workHistory: ["Mental Health Nurse at Mental Wellness Center (2018-present)", "Psychiatric Ward Nurse at Brown Sequard Hospital (2015-2018)", "Community Mental Health Nurse (2013-2015)"],
    certifications: ["Psychiatric Mental Health Nurse", "Addiction Recovery Specialist", "Crisis Intervention Certified"],
    services: ["Mental Health Support", "Medication Monitoring", "Crisis Intervention", "Addiction Recovery Support"],
    verified: true,
    emergencyAvailable: true,
    phone: "+230 5789 0127",
    age: 36,
    patientComments: [
      "Lisa provided excellent support during my depression recovery.",
      "Very understanding and professional mental health care.",
      "Helped our family navigate mental health challenges with compassion."
    ]
  },
  {
    id: "NUR006",
    firstName: "Jennifer",
    lastName: "Clarke",
    email: "jennifer.clarke@oncology.mu",
    password: "CancerCare123!",
    profileImage: "/images/nurses/21.jpg",
    type: "Oncology Nurse",
    specialization: ["Cancer Care", "Chemotherapy", "Palliative Support"],
    rating: 4.8,
    reviews: 167,
    experience: "11 years",
    location: "Port Louis",
    address: "Cancer Care Center, Port Louis",
    languages: ["English", "French", "Creole"],
    hourlyRate: 50,
    availability: "Mon-Fri, 8:00 AM - 6:00 PM",
    nextAvailable: "Thursday, 9:00 AM",
    bio: "Specialized oncology nurse with extensive experience in cancer care, chemotherapy administration, and providing emotional support to patients and families.",
    education: ["BSN - University of Mauritius", "Oncology Nursing Certification - Oncology Nursing Society", "Palliative Care Specialization"],
    workHistory: ["Senior Oncology Nurse at Cancer Care Center (2018-present)", "Chemotherapy Nurse at Apollo Bramwell (2014-2018)", "Medical-Surgical Nurse at Victoria Hospital (2012-2014)"],
    certifications: ["Certified Oncology Nurse", "Chemotherapy Provider", "Palliative Care Certified"],
    services: ["Cancer Care", "Chemotherapy Support", "Pain Management", "Emotional Support"],
    verified: true,
    emergencyAvailable: false,
    phone: "+230 5012 3456",
    age: 37,
    patientComments: [
      "Jennifer provided incredible support during my cancer treatment.",
      "Compassionate and skilled, made chemotherapy bearable.",
      "Professional oncology care, very knowledgeable and caring."
    ]
  },
  {
    id: "NUR007",
    firstName: "Michael",
    lastName: "Torres",
    email: "michael.torres@cardiac.mu",
    password: "HeartNurse456#",
    profileImage: "/images/nurses/22.jpg",
    type: "Cardiac Nurse",
    specialization: ["Cardiac Care", "Heart Surgery Recovery", "Cardiac Rehabilitation"],
    rating: 4.7,
    reviews: 143,
    experience: "9 years",
    location: "Ebene",
    address: "Cardiac Excellence Center, Ebene",
    languages: ["English", "Spanish", "French"],
    hourlyRate: 48,
    availability: "24/7 Available",
    nextAvailable: "Available Now",
    bio: "Dedicated cardiac nurse specializing in heart surgery recovery, cardiac monitoring, and rehabilitation programs for heart patients.",
    education: ["BSN with Cardiac Specialization - University of Technology", "Cardiac Life Support Instructor - American Heart Association", "Cardiac Rehabilitation Certificate"],
    workHistory: ["Cardiac Nurse at Cardiac Excellence Center (2019-present)", "ICU Cardiac Nurse at Wellkin Hospital (2015-2019)", "Telemetry Nurse at SSR Hospital (2013-2015)"],
    certifications: ["Cardiac Life Support Instructor", "Cardiac Rehabilitation Specialist", "Telemetry Certified"],
    services: ["Post-Cardiac Surgery Care", "Heart Monitoring", "Cardiac Rehabilitation", "Emergency Cardiac Care"],
    verified: true,
    emergencyAvailable: true,
    phone: "+230 5123 4567",
    age: 33,
    patientComments: [
      "Michael helped me recover perfectly after heart surgery.",
      "Excellent cardiac nurse, very skilled with heart monitors.",
      "Professional and caring during cardiac rehabilitation."
    ]
  },
  {
    id: "NUR008",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@maternal.mu",
    password: "MaternalCare789$",
    profileImage: "/images/nurses/23.jpg",
    type: "Maternity Nurse",
    specialization: ["Labor & Delivery", "Postpartum Care", "Lactation Support"],
    rating: 4.9,
    reviews: 201,
    experience: "13 years",
    location: "Curepipe",
    address: "Maternal Health Center, Curepipe",
    languages: ["English", "French", "Creole"],
    hourlyRate: 45,
    availability: "24/7 On-Call for Deliveries",
    nextAvailable: "On Call",
    bio: "Experienced maternity nurse specializing in labor and delivery support, postpartum care, and helping new mothers with breastfeeding.",
    education: ["BSN with Maternal Health Specialization - University of Mauritius", "Certified Lactation Consultant", "Neonatal Resuscitation Program"],
    workHistory: ["Senior Maternity Nurse at Maternal Health Center (2017-present)", "Labor & Delivery Nurse at Victoria Hospital (2011-2017)", "Postpartum Nurse at SSR Hospital (2009-2011)"],
    certifications: ["Certified Lactation Consultant", "Neonatal Resuscitation Provider", "Maternal-Child Health Nurse"],
    services: ["Labor Support", "Delivery Assistance", "Postpartum Care", "Breastfeeding Support"],
    verified: true,
    emergencyAvailable: true,
    phone: "+230 5234 5678",
    age: 39,
    patientComments: [
      "Sarah was amazing during my delivery, very supportive.",
      "Excellent postpartum care and breastfeeding help.",
      "Professional and caring, made birth experience wonderful."
    ]
  }
];