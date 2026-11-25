// Edit this file to update the website text. Leave address/email empty to hide them.
export const site = {
  name: 'Hope and Heal Recovery Center',
  tagline: 'Where addiction meets recovery with hope.',
  // Add the building/landmark line below once you have it, e.g. 'Plot 123, Near XYZ Square'.
  street: '',
  area: 'Patia, Bhubaneswar',
  region: 'Odisha',
  pin: '751024',
  email: '',
  hours: '',
  // Optional: put a real photo in client/public/images/ and set e.g. '/images/center.jpg'
  heroPhoto: '',
};
site.addressLines = [site.street, site.area, `${site.region} - ${site.pin}`].filter(Boolean);
site.address = site.addressLines.join(', ');
site.mapQuery = `${site.street ? site.street + ', ' : ''}${site.area}, ${site.region} ${site.pin}`;

export const contacts = [
  { name: 'Raja Virendra Mohapatra', phone: '+91 82496 85694', tel: '+918249685694' },
  { name: 'Abhilash Malla', phone: '+91 63718 66603', tel: '+916371866603' },
];

export const cycle = [
  { title: 'Craving', text: 'An intense urge to use substances or repeat harmful behavior.' },
  { title: 'Control', text: 'Losing control over how much or how often you use.' },
  { title: 'Compulsion', text: 'A strong drive to continue, even when you want to stop.' },
  { title: 'Continued use', text: 'Using despite negative consequences to health, family, or life.' },
];

export const services = [
  { name: 'Detoxification support', text: 'Support through the early days of stopping, with attention to comfort and safety.', detail: 'Stopping alcohol or drugs can be physically and emotionally hard. This support helps a person get through the first days with care, so that treatment can begin.' },
  { name: 'Psychological counselling', text: 'One-to-one sessions to understand triggers, build coping skills and work through underlying difficulties.', detail: 'Counselling looks at what drives the substance use: stress, trauma, low mood, anxiety or habit. It builds practical skills for handling urges and emotions without using.' },
  { name: 'Relapse prevention', text: 'Practical planning for high-risk situations, so recovery can hold when life gets hard.', detail: 'Relapse prevention names the people, places and feelings that raise risk, then builds a plan for each one, including who to call and what to do next.' },
  { name: 'Aftercare programs', text: 'Continued contact and support once the main program ends.', detail: 'Recovery continues after treatment. Aftercare keeps a person connected to support while they return to work, family and daily routines.' },
  { name: 'Family therapy', text: 'Sessions that help families understand addiction, rebuild trust and support recovery together.', detail: 'Addiction affects the whole family. These sessions help families understand what is happening, repair communication and support recovery without blame.' },
];

export const supports = [
  'Alcohol dependence',
  'Drug and substance use disorders',
  'Mental health conditions that occur alongside addiction',
  'Families and loved ones of someone struggling',
];

export const journey = [
  { title: 'Reach out', text: 'Call us or send an inquiry. You do not need to have everything figured out.' },
  { title: 'Register', text: 'Create an account and share some background, so our team understands the situation before we speak.' },
  { title: 'Assessment', text: 'We talk with the person and family to understand substance use, health and goals.' },
  { title: 'Treatment plan', text: 'Together we choose the services that fit, such as detoxification support, counselling or family therapy.' },
  { title: 'Aftercare', text: 'Support continues after the main program, to help recovery last.' },
];

export const values = [
  { title: 'Dignity first', text: 'Addiction is a health condition. Everyone who contacts us is treated with respect, without judgment.' },
  { title: 'Confidential', text: 'Conversations and records are kept private.' },
  { title: 'Whole person', text: 'We look at substance use together with mental health, relationships and daily life.' },
  { title: 'Families included', text: 'Recovery is stronger when the people close to someone understand and support it.' },
];

export const statusLabels = {
  registered: 'Registered',
  'under-review': 'Under review',
  'assessment-scheduled': 'Assessment scheduled',
  'in-treatment': 'In treatment',
  aftercare: 'Aftercare',
  closed: 'Closed',
};
export const statusSteps = ['registered', 'under-review', 'assessment-scheduled', 'in-treatment', 'aftercare'];

export const programLabels = {
  'detox-support': 'Detoxification support',
  counselling: 'Psychological counselling',
  'relapse-prevention': 'Relapse prevention',
  aftercare: 'Aftercare program',
  'family-therapy': 'Family therapy',
  'not-sure': 'Not sure yet',
};

export const relationLabels = { patient: 'Patient', family: 'Family member', friend: 'Friend', visitor: 'Visitor', other: 'Other' };
