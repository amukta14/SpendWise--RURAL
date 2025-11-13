import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    categories: 'Categories',
    budget: 'Budget',
    profile: 'Profile',
    logout: 'Logout',
    
    // Dashboard
    totalSpent: 'Total Spent',
    remainingBudget: 'Remaining Budget',
    topCategory: 'Top Category',
    recentExpenses: 'Recent Expenses',
    monthlyOverview: 'Monthly Overview',
    categoryBreakdown: 'Category Breakdown',
    
    // Expenses
    addExpense: 'Add Expense',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    notes: 'Notes',
    paymentMode: 'Payment Mode',
    location: 'Location',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
    // Payment modes
    cash: 'Cash',
    upi: 'UPI',
    credit: 'Credit',
    other: 'Other',
    
    // Budget
    setBudget: 'Set Budget',
    monthly: 'Monthly',
    weekly: 'Weekly',
    budgetAmount: 'Budget Amount',
    spent: 'Spent',
    remaining: 'Remaining',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone Number',
    village: 'Village/Town',
    monthlyIncome: 'Monthly Income',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    viewAll: 'View All',
    noData: 'No data available',
  },
  te: {
    // Navigation
    dashboard: 'డాష్‌బోర్డ్',
    expenses: 'ఖర్చులు',
    categories: 'వర్గాలు',
    budget: 'బడ్జెట్',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
    
    // Dashboard
    totalSpent: 'మొత్తం ఖర్చు',
    remainingBudget: 'మిగిలిన బడ్జెట్',
    topCategory: 'టాప్ వర్గం',
    recentExpenses: 'ఇటీవల ఖర్చులు',
    monthlyOverview: 'నెలవారీ సమీక్ష',
    categoryBreakdown: 'వర్గం వారీగా',
    
    // Expenses
    addExpense: 'ఖర్చు జోడించు',
    amount: 'మొత్తం',
    category: 'వర్గం',
    date: 'తేదీ',
    notes: 'గమనికలు',
    paymentMode: 'చెల్లింపు విధానం',
    location: 'స్థలం',
    save: 'సేవ్ చేయి',
    cancel: 'రద్దు చేయి',
    edit: 'సవరించు',
    delete: 'తొలగించు',
    
    // Payment modes
    cash: 'నగదు',
    upi: 'UPI',
    credit: 'క్రెడిట్',
    other: 'ఇతర',
    
    // Budget
    setBudget: 'బడ్జెట్ సెట్ చేయండి',
    monthly: 'నెలవారీ',
    weekly: 'వారంవారీ',
    budgetAmount: 'బడ్జెట్ మొత్తం',
    spent: 'ఖర్చు చేసారు',
    remaining: 'మిగిలినది',
    
    // Auth
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    name: 'పేరు',
    phone: 'ఫోన్ నంబర్',
    village: 'గ్రామం/పట్టణం',
    monthlyIncome: 'నెలవారీ ఆదాయం',
    
    // Common
    search: 'వెతుకు',
    filter: 'ఫిల్టర్',
    sort: 'క్రమబద్ధీకరించు',
    viewAll: 'అన్నీ చూడండి',
    noData: 'డేటా అందుబాటులో లేదు',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    expenses: 'खर्चे',
    categories: 'श्रेणियाँ',
    budget: 'बजट',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
    
    // Dashboard
    totalSpent: 'कुल खर्च',
    remainingBudget: 'शेष बजट',
    topCategory: 'शीर्ष श्रेणी',
    recentExpenses: 'हाल के खर्चे',
    monthlyOverview: 'मासिक अवलोकन',
    categoryBreakdown: 'श्रेणी विवरण',
    
    // Expenses
    addExpense: 'खर्च जोड़ें',
    amount: 'राशि',
    category: 'श्रेणी',
    date: 'तारीख',
    notes: 'टिप्पणियाँ',
    paymentMode: 'भुगतान मोड',
    location: 'स्थान',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    
    // Payment modes
    cash: 'नकद',
    upi: 'UPI',
    credit: 'क्रेडिट',
    other: 'अन्य',
    
    // Budget
    setBudget: 'बजट सेट करें',
    monthly: 'मासिक',
    weekly: 'साप्ताहिक',
    budgetAmount: 'बजट राशि',
    spent: 'खर्च किया',
    remaining: 'शेष',
    
    // Auth
    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    phone: 'फोन नंबर',
    village: 'गाँव/शहर',
    monthlyIncome: 'मासिक आय',
    
    // Common
    search: 'खोजें',
    filter: 'फ़िल्टर',
    sort: 'क्रमबद्ध करें',
    viewAll: 'सभी देखें',
    noData: 'कोई डेटा उपलब्ध नहीं',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('spendwise_language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('spendwise_language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
