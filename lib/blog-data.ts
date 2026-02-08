export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  author: string
  readTime: string
  tags: string[]
  relatedProducts: string[] // Product IDs to link
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: '5-sunnah-remedies',
    title: 'The 5 Sunnah Remedies Every Home Needs',
    excerpt: 'Discover the prophetic medicines that have stood the test of time, from Black Seed to Honey.',
    coverImage: 'https://images.unsplash.com/photo-1611073807909-6447c2115168?q=80&w=1200&auto=format&fit=crop',
    date: 'October 15, 2024',
    author: 'Hakeem Mohsin',
    readTime: '5 min read',
    tags: ['Sunnah', 'Health', 'Immunity'],
    relatedProducts: ['black-seed-oil', 'manuka-honey', 'ajwa-dates'],
    content: `
      <p>In the tradition of Tibb-e-Nabawi (Prophetic Medicine), health is a divine blessing. For centuries, households have relied on simple, powerful remedies guided by the Sunnah. Here are five essentials that should be in every home.</p>
      
      <h3>1. Nigella Sativa (Kalonji)</h3>
      <p>Known as the "seed of blessing," the Prophet (PBUH) stated that black seed is a cure for every disease except death. Modern science confirms its potent anti-inflammatory and immune-boosting properties.</p>
      
      <h3>2. Honey (Asal)</h3>
      <p>Described in the Quran as a "healing for mankind," honey is a natural antibiotic and energy booster. Raw, unprocessed honey is best for medicinal use.</p>
      
      <h3>3. Olive Oil (Zaitoon)</h3>
      <p>"Eat the oil and use it on your hair and skin, for it comes from a blessed tree." Cold-pressed olive oil is rich in antioxidants and heart-healthy fats.</p>
      
      <h3>4. Dates (Ajwa)</h3>
      <p>Specifically Ajwa dates from Medina are renowned for their heart-protective qualities and protection against toxins.</p>

      <h3>5. Talbinah (Barley Broth)</h3>
      <p>A soothing broth made from barley flour, milk, and honey. It is known to soothe the heart and relieve sadness/depression.</p>

      <p>Incorporating these into your daily routine is not just a health choice, but a spiritual one.</p>
    `
  },
  {
    id: '2',
    slug: 'secret-of-shilajit',
    title: 'The Secret of Shilajit: Why Hakeems Call it "The Conqueror"',
    excerpt: 'Unveiling the power of the Himalayan resin that boosts energy, vitality, and mental clarity.',
    coverImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1200&auto=format&fit=crop',
    date: 'October 22, 2024',
    author: 'Dr. Ayesha Khan',
    readTime: '7 min read',
    tags: ['Vitality', 'Men\'s Health', 'Energy'],
    relatedProducts: ['shilajit-resin', 'ashwagandha-gold'],
    content: `
      <p>High in the Himalayan peaks, a thick, dark resin oozes from the rocks. This is Shilajit, a substance formed over centuries by the decomposition of medicinal plants. In Sanskrit, it means "Conqueror of Mountains."</p>

      <h3>What is Shilajit?</h3>
      <p>It is a powerhouse of Fulvic Acid and over 84 minerals. Unlike synthetic supplements, its nutrients are in an ionic form, making them easily absorbable by the human body.</p>

      <h3>Benefits for Modern Life</h3>
      <ul>
        <li><strong>Energy Boost:</strong> It works at the cellular level to improve mitochondrial function.</li>
        <li><strong>Anti-Aging:</strong> High antioxidant levels fight free radicals and cellular damage.</li>
        <li><strong>Brain Health:</strong> Studies suggest it may help with cognitive disorders and memory retention.</li>
      </ul>

      <h3>How to Use It</h3>
      <p>A pea-sized amount dissolved in warm milk or water is the traditional way to consume it. The taste is earthy and bitter—a sign of its purity.</p>
    `
  },
  {
    id: '3',
    slug: 'hair-oil-secrets',
    title: 'Why Modern Shampoos Are Ruining Your Hair',
    excerpt: 'Sulfates and parabens strip your natural oils. Return to the tradition of oiling with Bhringraj.',
    coverImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop',
    date: 'November 01, 2024',
    author: 'Hakeem Mohsin',
    readTime: '6 min read',
    tags: ['Hair Care', 'Natural Beauty'],
    relatedProducts: ['bhringraj-oil-pure', 'sikakai-shampoo', 'egg-oil'],
    content: `
      <p>We've all been there—dry, frizzy, unmanageable hair despite using expensive "pro-vitamin" shampoos. The culprit often lies in the ingredients list: Sulfates (SLS) and Parabens.</p>

      <h3>The Strip-Down Effect</h3>
      <p>Sulfates are detergents. They clean your hair, but they also strip away the natural sebum that keeps your scalp healthy. This leads to a cycle of oil overproduction and dryness.</p>

      <h3>The Traditional Solution: Oiling (Champi)</h3>
      <p>In Unani and Ayurvedic tradition, oiling is not just about shine; it's about feeding the roots.</p>
      
      <h4>Bhringraj: The King of Herbs</h4>
      <p>This herb improves blood circulation to the scalp. When infused in a carrier oil, it can reactivate dormant follicles.</p>

      <h4>Roghan-e-Baiza (Egg Oil)</h4>
      <p>Rich in cholesterol and essential fatty acids, it mimics the lipids found in human skin, making it an excellent healer for damaged hair shafts.</p>
    `
  }
]
