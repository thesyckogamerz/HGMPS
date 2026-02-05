require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const products = JSON.parse(fs.readFileSync('parsed_products.json', 'utf8'));

// Use service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertProducts() {
  console.log(`Inserting ${products.length} products...`);

  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        product_name: product.name,
        urdu_name: product.urduName || null,
        description: product.description,
        price: product.price / 100, // convert from paisa to rupees
        category: product.category,
        image_url: product.image,
        stock_quantity: product.inStock ? 10 : 0,
        reviews: product.reviews,
        rating: product.rating,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error(`Error inserting ${product.id}:`, error);
    } else {
      console.log(`Inserted ${product.id}`);
    }
  }

  console.log('Done inserting products');
}

insertProducts();
