import { Product } from './cart-context'
export type { Product }

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  image: string
  productCount: number
  parentId?: string
}

export const categories: Category[] = [
  // Parent Categories
  {
    id: 'natures-cureness',
    slug: 'natures-cureness',
    name: "Nature's Cureness",
    description: 'Holistic healing from the heart of Unani & Ayurveda.',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
    productCount: 50,
  },
  {
    id: 'beautification',
    slug: 'beautification',
    name: 'Beautification',
    description: 'Time-tested botanical care for natural beauty.',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800&auto=format&fit=crop',
    productCount: 40,
  },
  {
    id: 'premium-collection',
    slug: 'premium-collection',
    name: 'Premium Collection',
    description: 'Exquisite, high-value natural treasures.',
    icon: '💎',
    image: 'https://images.unsplash.com/photo-1615485925763-867862f80931?q=80&w=800&auto=format&fit=crop',
    productCount: 15,
  },

  // Subcategories for Nature's Cureness
  {
    id: 'unani-specialties',
    slug: 'unani-specialties',
    name: 'Unani Specialties',
    description: 'Classic Khamiras and Maajoons for vitality.',
    icon: '🏺',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=800&auto=format&fit=crop',
    productCount: 10,
    parentId: 'natures-cureness',
  },
  {
    id: 'herbal-remedies',
    slug: 'herbal-remedies',
    name: 'Herbal Remedies',
    description: 'Single herbs and roots for daily health.',
    icon: '🍃',
    image: 'https://images.unsplash.com/photo-1471943311424-646960669fba?q=80&w=800&auto=format&fit=crop',
    productCount: 15,
    parentId: 'natures-cureness',
  },
  {
    id: 'immunity-boosters',
    slug: 'immunity-boosters',
    name: 'Immunity Boosters',
    description: 'Strengthen your defenses naturally.',
    icon: '🛡️',
    image: 'https://images.unsplash.com/photo-1623910363248-be2244485089?q=80&w=800&auto=format&fit=crop',
    productCount: 10,
    parentId: 'natures-cureness',
  },
    {
    id: 'digestive-wellness',
    slug: 'digestive-wellness',
    name: 'Digestive Wellness',
    description: 'Support gut health with traditional salts and seeds.',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800&auto=format&fit=crop',
    productCount: 15,
    parentId: 'natures-cureness',
  },

  // Subcategories for Beautification
  {
    id: 'hair-growth',
    slug: 'hair-growth',
    name: 'Hair Growth',
    description: 'Ancient oils and powders for lush hair.',
    icon: '💇‍♀️',
    image: 'https://images.unsplash.com/photo-1522337360705-8754d8a203e8?q=80&w=800&auto=format&fit=crop',
    productCount: 10,
    parentId: 'beautification',
  },
  {
    id: 'skincare',
    slug: 'skincare',
    name: 'Skincare',
    description: 'Ubtans and floral waters for glowing skin.',
    icon: '🧴',
    image: 'https://images.unsplash.com/photo-1556228552-523cd13b86dc?q=80&w=800&auto=format&fit=crop',
    productCount: 12,
    parentId: 'beautification',
  },
  {
    id: 'glowing-solutions',
    slug: 'glowing-solutions',
    name: 'Glowing Solutions',
    description: 'Radiance from within.',
    icon: '🌟',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop',
    productCount: 8,
    parentId: 'beautification',
  },
  {
    id: 'weight-loss',
    slug: 'weight-loss',
    name: 'Weight Loss Solutions',
    description: 'Natural support for healthy weight management.',
    icon: '⚖️',
    image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2899?q=80&w=800&auto=format&fit=crop',
    productCount: 5,
    parentId: 'beautification',
  },
  {
    id: 'weight-gain',
    slug: 'weight-gain',
    name: 'Weight Gain Solutions',
    description: 'Healthy mass building supplements.',
    icon: '💪',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    productCount: 5,
    parentId: 'beautification',
  },
];

export const products: Product[] = [
  // --- NATURE'S CURENESS: UNANI SPECIALTIES ---
  {
    "id": "khamira-marwareed", 
    "name": "Khamira Marwareed", 
    "price": 3500, 
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop", 
    "category": "unani-specialties", 
    "description": "A traditional pearl-based tonic (Khamira) used for centuries to strengthen the heart and elevate mood. Enriched with real pearls.", 
    "rating": 5.0, 
    "reviews": 120, 
    "inStock": true, 
    "badge": "Royal Unani", 
    "urduName": "خمیرہ مروارید"
  },
  {
    "id": "majoon-falasfa", 
    "name": "Majoon-e-Falasfa", 
    "price": 1800, 
    "image": "https://images.unsplash.com/photo-1590735213920-68192a48792b?q=80&w=800&auto=format&fit=crop", 
    "category": "unani-specialties", 
    "description": "An ancient 'Philosopher's Honey' blend. Renowned for boosting brain power, kidney health, and relieving joint pain.", 
    "rating": 4.8, 
    "reviews": 85, 
    "inStock": true, 
    "urduName": "معجون فلاسفہ"
  },
  {
    "id": "shilajit-resin", 
    "name": "Himalayan Shilajit Resin", 
    "price": 4500, 
    "originalPrice": 5500,
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop", 
    "category": "unani-specialties", 
    "description": "Pure, filtered black resin from the Himalayas. Known as the 'Conqueror of Mountains' for enhancing vitality and vigor.", 
    "rating": 4.9, 
    "reviews": 210, 
    "inStock": true, 
    "badge": "Best Seller", 
    "urduName": "شلاجیت"
  },

  // --- NATURE'S CURENESS: HERBAL REMEDIES ---
  {
    "id": "black-seed-oil", 
    "name": "Premium Black Seed Oil (Kalonji)", 
    "price": 1200, 
    "image": "https://images.unsplash.com/photo-1611073807909-6447c2115168?q=80&w=800&auto=format&fit=crop", 
    "category": "herbal-remedies", 
    "description": "Cold-pressed Nigella Sativa oil. A 'cure for everything except death' as per tradition. Boosts general immunity.", 
    "rating": 4.9, 
    "reviews": 450, 
    "inStock": true, 
    "badge": "Essential", 
    "urduName": "کلونجی کا تیل"
  },
  {
    "id": "ashwagandha-gold", 
    "name": "Ashwagandha Gold Extract", 
    "price": 2499, 
    "originalPrice": 3299, 
    "image": "https://images.unsplash.com/photo-1611073807909-6447c2115168?q=80&w=800&auto=format&fit=crop", 
    "category": "herbal-remedies", 
    "description": "Premium KSM-66 extract. An ancient adaptogen used to combat stress and build strength.", 
    "rating": 4.8, 
    "reviews": 342, 
    "inStock": true, 
    "badge": "Best Seller", 
    "urduName": "اشوگندھا گولڈ"
  },

  // --- NATURE'S CURENESS: IMMUNITY ---
  {
    "id": "turmeric-golden", 
    "name": "Golden Turmeric Capsules", 
    "price": 1599, 
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop", 
    "category": "immunity-boosters", 
    "description": "Curcumin enriched with black pepper. The 'Golden Healer' of traditional medicine.", 
    "rating": 4.7, 
    "reviews": 312, 
    "inStock": true, 
    "urduName": "ہلدی کیپسول"
  },
  {
    "id": "reishi-mushroom", 
    "name": "Reishi Mushroom Tincture", 
    "price": 2999, 
    "originalPrice": 3499, 
    "image": "https://images.unsplash.com/photo-1623910363248-be2244485089?q=80&w=800&auto=format&fit=crop", 
    "category": "immunity-boosters", 
    "description": "Functional mushroom extract for longevity and spirit calming.", 
    "rating": 4.9, 
    "reviews": 278, 
    "inStock": true, 
    "badge": "Premium", 
    "urduName": "ریشی مشروم"
  },

  // --- BEAUTIFICATION: HAIR GROWTH ---
  {
    "id": "bhringraj-oil-pure", 
    "name": "Mahabhringraj Oil", 
    "price": 1499, 
    "image": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop", 
    "category": "hair-growth", 
    "description": "Known as 'Keshraj' or King of Hair. Traditional preparation for preventing graying and hair fall.", 
    "rating": 4.9, 
    "reviews": 230, 
    "inStock": true, 
    "badge": "Ayurvedic", 
    "urduName": "بھرنگراج تیل"
  },
  {
    "id": "egg-oil", 
    "name": "Roghan-e-Baiza-e-Murgh (Egg Oil)", 
    "price": 1899, 
    "image": "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop", 
    "category": "hair-growth", 
    "description": "Concentrated extract from egg yolks. A Unani secret for regrowing hair spots and strengthening follicles.", 
    "rating": 4.7, 
    "reviews": 112, 
    "inStock": true, 
    "urduName": "روغن بیضہ مرغ"
  },
  {
    "id": "sikakai-shampoo", 
    "name": "Reetha & Sikakai Cleanser", 
    "price": 899, 
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop", 
    "category": "hair-growth", 
    "description": "Natural soapnut and acacia blend. The traditional way to wash hair without chemicals.", 
    "rating": 4.6, 
    "reviews": 180, 
    "inStock": true, 
    "urduName": "ریٹھا اور سکاکائی"
  },

  // --- BEAUTIFICATION: SKINCARE ---
  {
    "id": "husn-e-yousuf", 
    "name": "Husn-e-Yousuf Ubtan", 
    "price": 1200, 
    "image": "https://images.unsplash.com/photo-1556228552-523cd13b86dc?q=80&w=800&auto=format&fit=crop", 
    "category": "skincare", 
    "description": "Traditional beautifying powder blend. Used by brides for a radiant, spot-free complexion.", 
    "rating": 4.9, 
    "reviews": 310, 
    "inStock": true, 
    "badge": "Bridal Choice", 
    "urduName": "حسن یوسف"
  },
  {
    "id": "kumkumadi-tailam", 
    "name": "Kumkumadi Tailam", 
    "price": 3200, 
    "originalPrice": 4000,
    "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800&auto=format&fit=crop", 
    "category": "skincare", 
    "description": "The 'Miraculous Saffron Oil'. A classical Ayurvedic formula for skin rejuvenation and glow.", 
    "rating": 5.0, 
    "reviews": 95, 
    "inStock": true, 
    "badge": "Luxury", 
    "urduName": "کمکمادی تیلم"
  },
  {
    "id": "rose-water-kannauj", 
    "name": "Pure Rose Water (Kannauj)", 
    "price": 899, 
    "image": "https://images.unsplash.com/photo-1556228720-1987d7d24295?q=80&w=800&auto=format&fit=crop", 
    "category": "skincare", 
    "description": "Deg-distilled rose water from the perfume capital of India. Natural skin toner.", 
    "rating": 4.8, 
    "reviews": 400, 
    "inStock": true, 
    "urduName": "عرق گلاب"
  },

  // --- BEAUTIFICATION: WEIGHT LOSS ---
  {
    "id": "triphala-powder", 
    "name": "Organic Triphala Powder", 
    "price": 999, 
    "image": "https://images.unsplash.com/photo-1616641697268-2a74c449553f?q=80&w=800&auto=format&fit=crop", 
    "category": "weight-loss", 
    "description": "Three-fruit blend (Amla, Haritaki, Bibhitaki). Gentle detoxifier that improves metabolism.", 
    "rating": 4.7, 
    "reviews": 220, 
    "inStock": true, 
    "urduName": "ترپھلا پاؤڈر"
  },
  {
    "id": "lukman-hayat-oil", 
    "name": "Lukman-e-Hayat Massage Oil", 
    "price": 1500, 
    "image": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop", 
    "category": "weight-loss", 
    "description": "Traditional massage oil to help tone the body and burn cellulite.", 
    "rating": 4.5, 
    "reviews": 130, 
    "inStock": true, 
    "urduName": "لقمان حیات تیل"
  },

  // --- BEAUTIFICATION: WEIGHT GAIN ---
  {
    "id": "mass-gainer-herbal", 
    "name": "Herbal Mass Gainer", 
    "price": 2499, 
    "originalPrice": 2999, 
    "image": "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop", 
    "category": "weight-gain", 
    "description": "A blend of Ashwagandha, Shatavari, and White Musli to build healthy body mass.", 
    "rating": 4.6, 
    "reviews": 150, 
    "inStock": true, 
    "urduName": "ہربل ماس گینر"
  },
  {
    "id": "chyawanprash-gold", 
    "name": "Royal Chyawanprash", 
    "price": 1600, 
    "image": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800&auto=format&fit=crop", 
    "category": "weight-gain", 
    "description": "Traditional gooseberry jam with 40+ herbs. Builds strength, immunity, and healthy weight.", 
    "rating": 4.8, 
    "reviews": 290, 
    "inStock": true, 
    "urduName": "چونپراش"
  },

  // --- PREMIUM COLLECTION ---
  {
    "id": "manuka-honey", 
    "name": "Manuka Honey MGO 850+", 
    "price": 9500, 
    "image": "https://images.unsplash.com/photo-1587049352851-8d4e8918dcf1?q=80&w=800&auto=format&fit=crop", 
    "category": "premium-collection", 
    "description": "Ultra-premium medicinal honey from New Zealand. Potent antibacterial properties.", 
    "rating": 5.0, 
    "reviews": 45, 
    "inStock": true, 
    "badge": "Luxury", 
    "urduName": "مینوکا شہد"
  },
  {
    "id": "kashmiri-saffron", 
    "name": "Kashmiri Mogra Saffron", 
    "price": 8000, 
    "image": "https://images.unsplash.com/photo-1502330023388-f97021590ddf?q=80&w=800&auto=format&fit=crop", 
    "category": "premium-collection", 
    "description": "The world's finest saffron threads. 5g. Used for glowing skin and health.", 
    "rating": 5.0, 
    "reviews": 60, 
    "inStock": true, 
    "urduName": "کشمیری زعفران"
  },
]

export function getProductsByCategory(categoryId: string): Product[] {
  // If accessing a main category, return all products from its subcategories too
  const category = categories.find(c => c.id === categoryId)
  if (!category) return products.filter(p => p.category === categoryId)

  // Find subcategories
  const subCategories = categories.filter(c => c.parentId === category.id)
  const categoryIds = [categoryId, ...subCategories.map(c => c.id)]

  return products.filter(p => categoryIds.includes(p.category))
}

export function getProductById(productId: string): Product | undefined {
  return products.find(p => p.id === productId)
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(c => c.id === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.badge || p.rating >= 4.8).slice(0, 8)
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-IN')}`
}
