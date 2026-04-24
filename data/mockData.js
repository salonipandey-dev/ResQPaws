export const IMAGES = {
  hero: 'https://images.pexels.com/photos/4697573/pexels-photo-4697573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  volunteer: 'https://images.pexels.com/photos/35231857/pexels-photo-35231857.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  shelter: 'https://images.pexels.com/photos/4697570/pexels-photo-4697570.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  fence: 'https://images.pexels.com/photos/16465597/pexels-photo-16465597.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  happyDog: 'https://images.pexels.com/photos/29453815/pexels-photo-29453815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  bandana: 'https://images.pexels.com/photos/33834456/pexels-photo-33834456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
};

export const REPORTS = [
  {
    id: 'RP-1021',
    image: IMAGES.fence,
    animal: 'Dog',
    location: 'MG Road, Bengaluru',
    time: '12 min ago',
    description: 'Injured stray dog near the metro station. Appears to have a leg injury and needs urgent help.',
    severity: 'Critical',
    status: 'On the Way',
    reporter: 'Aarav S.'
  },
  {
    id: 'RP-1020',
    image: IMAGES.shelter,
    animal: 'Puppy',
    location: 'Koramangala 4th Block',
    time: '45 min ago',
    description: 'Two puppies abandoned in a cardboard box. Seem dehydrated and scared.',
    severity: 'Medium',
    status: 'NGO Accepted',
    reporter: 'Priya K.'
  },
  {
    id: 'RP-1019',
    image: IMAGES.happyDog,
    animal: 'Dog',
    location: 'HSR Layout Sector 2',
    time: '2 hrs ago',
    description: 'Stray dog with skin condition, friendly but needs medical attention soon.',
    severity: 'Low',
    status: 'Rescued',
    reporter: 'Rahul M.'
  },
  {
    id: 'RP-1018',
    image: IMAGES.bandana,
    animal: 'Dog',
    location: 'Indiranagar 100ft Road',
    time: '3 hrs ago',
    description: 'Limping dog seen near cafe, possible accident. Requires immediate vet checkup.',
    severity: 'Critical',
    status: 'Reported',
    reporter: 'Neha T.'
  },
  {
    id: 'RP-1017',
    image: IMAGES.volunteer,
    animal: 'Cat',
    location: 'Whitefield Main',
    time: '5 hrs ago',
    description: 'Kitten stuck under car, unable to move. Owner of car is waiting for rescue.',
    severity: 'Medium',
    status: 'Verified',
    reporter: 'Siddharth R.'
  },
  {
    id: 'RP-1016',
    image: IMAGES.shelter,
    animal: 'Dog',
    location: 'Jayanagar 7th Block',
    time: '8 hrs ago',
    description: 'Elderly dog found weak and not eating. Needs care and a shelter.',
    severity: 'Medium',
    status: 'Rescued',
    reporter: 'Ishita V.'
  }
];

export const NGOS = [
  { name: 'Paws & Hearts', city: 'Bengaluru', rescues: 420, rating: 4.9 },
  { name: 'Animal Aid India', city: 'Delhi', rescues: 380, rating: 4.8 },
  { name: 'Stray Angels', city: 'Mumbai', rescues: 512, rating: 4.9 },
  { name: 'Happy Tails', city: 'Chennai', rescues: 298, rating: 4.7 },
  { name: 'CARE Foundation', city: 'Pune', rescues: 345, rating: 4.8 },
  { name: 'Bark Buddies', city: 'Hyderabad', rescues: 267, rating: 4.6 }
];

export const TESTIMONIALS = [
  { name: 'Ananya Rao', role: 'Volunteer', text: 'ResQPaws is a game-changer. I helped rescue 3 dogs this month just by reporting through the app!', avatar: '🧕' },
  { name: 'Dr. Vikram Shah', role: 'Veterinarian', text: 'The fastest response I have seen from any platform. Critical cases reach us in minutes.', avatar: '👨\u200d⚕️' },
  { name: 'Meera Pillai', role: 'NGO Director', text: 'Our rescue rate tripled since we joined ResQPaws. The status tracker keeps everyone informed.', avatar: '👩' }
];

export const ANALYTICS = {
  perDay: [
    { day: 'Mon', reports: 24, rescued: 18 },
    { day: 'Tue', reports: 32, rescued: 26 },
    { day: 'Wed', reports: 28, rescued: 22 },
    { day: 'Thu', reports: 41, rescued: 34 },
    { day: 'Fri', reports: 38, rescued: 30 },
    { day: 'Sat', reports: 52, rescued: 44 },
    { day: 'Sun', reports: 47, rescued: 40 }
  ],
  severity: [
    { name: 'Critical', value: 34, color: '#ef4444' },
    { name: 'Medium', value: 48, color: '#f59e0b' },
    { name: 'Low', value: 28, color: '#10b981' }
  ],
  ngoPerf: [
    { name: 'Paws & Hearts', success: 94 },
    { name: 'Stray Angels', success: 91 },
    { name: 'Animal Aid', success: 88 },
    { name: 'Happy Tails', success: 85 },
    { name: 'CARE Found.', success: 82 }
  ]
};

export const USER = {
  name: 'Aarav Sharma',
  email: 'aarav@resqpaws.in',
  points: 1240,
  stars: 4.8,
  badges: ['Fast Reporter', 'Hero Volunteer', 'Weekend Warrior'],
  helped: 27
};
