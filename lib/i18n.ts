export const translations = {
  en: {
    greeting: 'Assalamu Alaikum',
    familyId: 'Family ID',
    members: 'Members',
    pendingDues: 'Pending Dues',
    payNow: 'Pay Now',
    quickActions: 'Quick Actions',
    teacherArea: 'Teacher Area',
    myFamily: 'My Family',
    payDues: 'Pay Dues',
    children: 'Children',
    events: 'Events',
    announcements: 'Announcements',
    notice: 'Notice',
    mahalluInfo: 'Mahallu Information',
    address: 'Address',
    contact: 'Contact',
    familyWard: 'Family Ward',
    unassigned: 'Unassigned',
    notAvailable: 'Not available'
  },
  ml: {
    greeting: 'അസ്സലാമു അലൈക്കും',
    familyId: 'കുടുംബ ഐഡി',
    members: 'അംഗങ്ങൾ',
    pendingDues: 'കുടിശ്ശികകൾ',
    payNow: 'ഇപ്പോൾ അടയ്ക്കുക',
    quickActions: 'പ്രധാന സേവനങ്ങൾ',
    teacherArea: 'അധ്യാപകന്റെ ഇടം',
    myFamily: 'എന്റെ കുടുംബം',
    payDues: 'കുടിശ്ശിക അടയ്ക്കുക',
    children: 'കുട്ടികൾ',
    events: 'പരിപാടികൾ',
    announcements: 'അറിയിപ്പുകൾ',
    notice: 'അറിയിപ്പ്',
    mahalluInfo: 'മഹല്ല് വിവരങ്ങൾ',
    address: 'വിലാസം',
    contact: 'ബന്ധപ്പെടുക',
    familyWard: 'കുടുംബ വാർഡ്',
    unassigned: 'നിശ്ചയിച്ചിട്ടില്ല',
    notAvailable: 'ലഭ്യമല്ല'
  }
};

export const t = (key: keyof typeof translations.en, lang: 'en' | 'ml') => {
  return translations[lang][key] || translations['en'][key] || key;
};
