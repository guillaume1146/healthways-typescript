import { PrismaClient } from '@prisma/client'

interface FoodItem {
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  servingSize: string
  unit: string
  isLocal: boolean
}

const FOODS: FoodItem[] = [
  // ─── Fruits ───
  { name: 'Apple', category: 'Fruits', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, servingSize: '1 medium (182g)', unit: 'piece', isLocal: false },
  { name: 'Banana', category: 'Fruits', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, servingSize: '1 medium (118g)', unit: 'piece', isLocal: false },
  { name: 'Mango', category: 'Fruits', calories: 135, protein: 1.1, carbs: 35, fat: 0.6, fiber: 3.7, servingSize: '1 cup sliced (165g)', unit: 'cup', isLocal: true },
  { name: 'Pineapple', category: 'Fruits', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, servingSize: '1 cup chunks (165g)', unit: 'cup', isLocal: true },
  { name: 'Papaya', category: 'Fruits', calories: 62, protein: 0.7, carbs: 16, fat: 0.4, fiber: 2.5, servingSize: '1 cup cubes (140g)', unit: 'cup', isLocal: true },
  { name: 'Lychee', category: 'Fruits', calories: 125, protein: 1.6, carbs: 31, fat: 0.8, fiber: 2.5, servingSize: '1 cup (190g)', unit: 'cup', isLocal: true },
  { name: 'Coconut (fresh)', category: 'Fruits', calories: 283, protein: 2.7, carbs: 12, fat: 27, fiber: 7.2, servingSize: '1 cup shredded (80g)', unit: 'cup', isLocal: true },
  { name: 'Orange', category: 'Fruits', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, servingSize: '1 medium (131g)', unit: 'piece', isLocal: false },
  { name: 'Watermelon', category: 'Fruits', calories: 46, protein: 0.9, carbs: 12, fat: 0.2, fiber: 0.6, servingSize: '1 cup diced (152g)', unit: 'cup', isLocal: false },
  { name: 'Guava', category: 'Fruits', calories: 112, protein: 4.2, carbs: 24, fat: 1.6, fiber: 8.9, servingSize: '1 cup (165g)', unit: 'cup', isLocal: true },
  { name: 'Passion Fruit', category: 'Fruits', calories: 17, protein: 0.4, carbs: 4.2, fat: 0.1, fiber: 1.9, servingSize: '1 fruit (18g)', unit: 'piece', isLocal: true },
  { name: 'Longan', category: 'Fruits', calories: 60, protein: 1.3, carbs: 15, fat: 0.1, fiber: 1.1, servingSize: '100g', unit: 'serving', isLocal: true },
  { name: 'Grapes', category: 'Fruits', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, servingSize: '1 cup (151g)', unit: 'cup', isLocal: false },
  { name: 'Starfruit (Carambole)', category: 'Fruits', calories: 41, protein: 1.4, carbs: 9, fat: 0.4, fiber: 3.7, servingSize: '1 cup sliced (132g)', unit: 'cup', isLocal: true },
  { name: 'Jackfruit', category: 'Fruits', calories: 155, protein: 2.8, carbs: 40, fat: 1, fiber: 2.5, servingSize: '1 cup (165g)', unit: 'cup', isLocal: true },

  // ─── Vegetables ───
  { name: 'Broccoli', category: 'Vegetables', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, servingSize: '1 cup chopped (156g)', unit: 'cup', isLocal: false },
  { name: 'Spinach', category: 'Vegetables', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, servingSize: '1 cup raw (30g)', unit: 'cup', isLocal: false },
  { name: 'Carrot', category: 'Vegetables', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, servingSize: '1 medium (61g)', unit: 'piece', isLocal: false },
  { name: 'Tomato', category: 'Vegetables', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, servingSize: '1 medium (123g)', unit: 'piece', isLocal: false },
  { name: 'Cucumber', category: 'Vegetables', calories: 16, protein: 0.7, carbs: 3.1, fat: 0.2, fiber: 0.5, servingSize: '1 cup sliced (119g)', unit: 'cup', isLocal: false },
  { name: 'Brinjal (Eggplant)', category: 'Vegetables', calories: 35, protein: 0.8, carbs: 9, fat: 0.2, fiber: 2.5, servingSize: '1 cup cubed (82g)', unit: 'cup', isLocal: true },
  { name: 'Pumpkin (Giraumon)', category: 'Vegetables', calories: 30, protein: 1.2, carbs: 8, fat: 0.1, fiber: 0.6, servingSize: '1 cup cubed (116g)', unit: 'cup', isLocal: true },
  { name: 'Chouchou (Chayote)', category: 'Vegetables', calories: 25, protein: 1.1, carbs: 6, fat: 0.2, fiber: 2.2, servingSize: '1 cup chopped (132g)', unit: 'cup', isLocal: true },
  { name: 'Calebasse (Bottle Gourd)', category: 'Vegetables', calories: 15, protein: 0.6, carbs: 3.4, fat: 0, fiber: 0.5, servingSize: '1 cup cooked (146g)', unit: 'cup', isLocal: true },
  { name: 'Mouroungue (Drumstick)', category: 'Vegetables', calories: 37, protein: 2, carbs: 8.5, fat: 0.2, fiber: 3.2, servingSize: '1 cup sliced (100g)', unit: 'cup', isLocal: true },
  { name: 'Bitter Gourd (Margose)', category: 'Vegetables', calories: 21, protein: 1, carbs: 4.3, fat: 0.2, fiber: 2, servingSize: '1 cup sliced (93g)', unit: 'cup', isLocal: true },
  { name: 'Green Beans', category: 'Vegetables', calories: 34, protein: 2, carbs: 8, fat: 0.1, fiber: 4, servingSize: '1 cup (125g)', unit: 'cup', isLocal: false },
  { name: 'Cabbage', category: 'Vegetables', calories: 22, protein: 1.3, carbs: 5, fat: 0.1, fiber: 2.2, servingSize: '1 cup shredded (89g)', unit: 'cup', isLocal: false },
  { name: 'Lettuce', category: 'Vegetables', calories: 5, protein: 0.5, carbs: 1, fat: 0.1, fiber: 0.5, servingSize: '1 cup shredded (36g)', unit: 'cup', isLocal: false },
  { name: 'Sweet Potato (Patate Douce)', category: 'Vegetables', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, servingSize: '1 medium (114g)', unit: 'piece', isLocal: true },

  // ─── Grains & Starches ───
  { name: 'White Rice (cooked)', category: 'Grains', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, servingSize: '1 cup (158g)', unit: 'cup', isLocal: false },
  { name: 'Brown Rice (cooked)', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, servingSize: '1 cup (195g)', unit: 'cup', isLocal: false },
  { name: 'Roti / Chapati', category: 'Grains', calories: 120, protein: 3.5, carbs: 20, fat: 3.5, fiber: 1.5, servingSize: '1 piece (40g)', unit: 'piece', isLocal: true },
  { name: 'White Bread', category: 'Grains', calories: 79, protein: 2.7, carbs: 15, fat: 1, fiber: 0.6, servingSize: '1 slice (30g)', unit: 'slice', isLocal: false },
  { name: 'Whole Wheat Bread', category: 'Grains', calories: 81, protein: 4, carbs: 14, fat: 1.1, fiber: 1.9, servingSize: '1 slice (33g)', unit: 'slice', isLocal: false },
  { name: 'Oats', category: 'Grains', calories: 154, protein: 5.3, carbs: 27, fat: 2.6, fiber: 4, servingSize: '1/2 cup dry (40g)', unit: 'serving', isLocal: false },
  { name: 'Pasta (cooked)', category: 'Grains', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, servingSize: '1 cup (140g)', unit: 'cup', isLocal: false },
  { name: 'Noodles (cooked)', category: 'Grains', calories: 219, protein: 7, carbs: 40, fat: 3.3, fiber: 1.8, servingSize: '1 cup (160g)', unit: 'cup', isLocal: false },
  { name: 'Cassava (Manioc)', category: 'Grains', calories: 165, protein: 1.4, carbs: 39, fat: 0.3, fiber: 1.8, servingSize: '1 cup (103g)', unit: 'cup', isLocal: true },
  { name: 'Corn (Sweet)', category: 'Grains', calories: 96, protein: 3.4, carbs: 21, fat: 1.5, fiber: 2.4, servingSize: '1 medium ear (90g)', unit: 'piece', isLocal: false },

  // ─── Protein ───
  { name: 'Chicken Breast (grilled)', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g', unit: 'serving', isLocal: false },
  { name: 'Chicken Curry', category: 'Protein', calories: 243, protein: 19, carbs: 8, fat: 15, fiber: 1.5, servingSize: '1 cup (240g)', unit: 'cup', isLocal: true },
  { name: 'Fish - Capitaine (grilled)', category: 'Protein', calories: 128, protein: 26, carbs: 0, fat: 2.6, fiber: 0, servingSize: '1 fillet (100g)', unit: 'serving', isLocal: true },
  { name: 'Fish Vindaye', category: 'Protein', calories: 220, protein: 20, carbs: 6, fat: 13, fiber: 1, servingSize: '1 serving (150g)', unit: 'serving', isLocal: true },
  { name: 'Egg (boiled)', category: 'Protein', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, servingSize: '1 large (50g)', unit: 'piece', isLocal: false },
  { name: 'Lentils / Dal (cooked)', category: 'Protein', calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 15.6, servingSize: '1 cup (198g)', unit: 'cup', isLocal: true },
  { name: 'Chickpeas (cooked)', category: 'Protein', calories: 269, protein: 14.5, carbs: 45, fat: 4.2, fiber: 12.5, servingSize: '1 cup (164g)', unit: 'cup', isLocal: false },
  { name: 'Tofu', category: 'Protein', calories: 144, protein: 15, carbs: 3.5, fat: 8, fiber: 2, servingSize: '1/2 cup (126g)', unit: 'serving', isLocal: false },
  { name: 'Beef (lean, cooked)', category: 'Protein', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, servingSize: '100g', unit: 'serving', isLocal: false },
  { name: 'Lamb (cooked)', category: 'Protein', calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, servingSize: '100g', unit: 'serving', isLocal: false },
  { name: 'Shrimp (cooked)', category: 'Protein', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, servingSize: '100g', unit: 'serving', isLocal: false },
  { name: 'Tuna (canned)', category: 'Protein', calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, servingSize: '1 can drained (100g)', unit: 'serving', isLocal: false },
  { name: 'Sardines', category: 'Protein', calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, servingSize: '1 can (92g)', unit: 'serving', isLocal: false },

  // ─── Dairy ───
  { name: 'Milk (whole)', category: 'Dairy', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, servingSize: '1 cup (244ml)', unit: 'cup', isLocal: false },
  { name: 'Yogurt (plain)', category: 'Dairy', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, servingSize: '1 cup (245g)', unit: 'cup', isLocal: false },
  { name: 'Cheese (cheddar)', category: 'Dairy', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, fiber: 0, servingSize: '1 slice (28g)', unit: 'slice', isLocal: false },
  { name: 'Cottage Cheese (Fromage Blanc)', category: 'Dairy', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, servingSize: '1/2 cup (113g)', unit: 'serving', isLocal: false },
  { name: 'Butter', category: 'Dairy', calories: 102, protein: 0.1, carbs: 0, fat: 12, fiber: 0, servingSize: '1 tbsp (14g)', unit: 'tbsp', isLocal: false },
  { name: 'Lassi (sweet)', category: 'Dairy', calories: 170, protein: 6, carbs: 28, fat: 4, fiber: 0, servingSize: '1 glass (250ml)', unit: 'glass', isLocal: true },

  // ─── Mauritian Specialties ───
  { name: 'Dholl Puri', category: 'Mauritian', calories: 280, protein: 8, carbs: 42, fat: 9, fiber: 4, servingSize: '1 piece with filling', unit: 'piece', isLocal: true },
  { name: 'Roti Chaud (with curry)', category: 'Mauritian', calories: 350, protein: 10, carbs: 45, fat: 14, fiber: 3, servingSize: '1 roti with filling', unit: 'piece', isLocal: true },
  { name: 'Mine Frite (Fried Noodles)', category: 'Mauritian', calories: 380, protein: 12, carbs: 48, fat: 16, fiber: 2, servingSize: '1 plate (250g)', unit: 'plate', isLocal: true },
  { name: 'Riz Frite (Fried Rice)', category: 'Mauritian', calories: 350, protein: 10, carbs: 52, fat: 12, fiber: 1.5, servingSize: '1 plate (250g)', unit: 'plate', isLocal: true },
  { name: 'Briani', category: 'Mauritian', calories: 420, protein: 18, carbs: 55, fat: 15, fiber: 3, servingSize: '1 plate (300g)', unit: 'plate', isLocal: true },
  { name: 'Gateau Piment (Chilli Cakes)', category: 'Mauritian', calories: 45, protein: 2.5, carbs: 5, fat: 2, fiber: 1, servingSize: '1 piece (15g)', unit: 'piece', isLocal: true },
  { name: 'Samoussa', category: 'Mauritian', calories: 120, protein: 3, carbs: 14, fat: 6, fiber: 1, servingSize: '1 piece (40g)', unit: 'piece', isLocal: true },
  { name: 'Boulette (Steamed)', category: 'Mauritian', calories: 45, protein: 3, carbs: 5, fat: 1.5, fiber: 0.3, servingSize: '1 piece (25g)', unit: 'piece', isLocal: true },
  { name: 'Rougaille Saucisse', category: 'Mauritian', calories: 320, protein: 14, carbs: 12, fat: 24, fiber: 2, servingSize: '1 serving (200g)', unit: 'serving', isLocal: true },
  { name: 'Daube (Stew)', category: 'Mauritian', calories: 280, protein: 22, carbs: 8, fat: 18, fiber: 2, servingSize: '1 serving (200g)', unit: 'serving', isLocal: true },
  { name: 'Farata', category: 'Mauritian', calories: 200, protein: 4, carbs: 28, fat: 8, fiber: 1, servingSize: '1 piece (60g)', unit: 'piece', isLocal: true },
  { name: 'Alouda', category: 'Mauritian', calories: 180, protein: 3, carbs: 35, fat: 4, fiber: 1, servingSize: '1 glass (300ml)', unit: 'glass', isLocal: true },
  { name: 'Salade Palmiste (Heart of Palm)', category: 'Mauritian', calories: 60, protein: 3.5, carbs: 8, fat: 1.5, fiber: 3, servingSize: '1 cup (146g)', unit: 'cup', isLocal: true },
  { name: 'Vindaye Poisson', category: 'Mauritian', calories: 240, protein: 22, carbs: 6, fat: 14, fiber: 1.5, servingSize: '1 serving (150g)', unit: 'serving', isLocal: true },
  { name: 'Halim', category: 'Mauritian', calories: 320, protein: 16, carbs: 38, fat: 12, fiber: 6, servingSize: '1 bowl (300ml)', unit: 'bowl', isLocal: true },
  { name: 'Cari Poisson', category: 'Mauritian', calories: 230, protein: 24, carbs: 5, fat: 13, fiber: 1.5, servingSize: '1 serving (180g)', unit: 'serving', isLocal: true },
  { name: 'Bol Renversé', category: 'Mauritian', calories: 450, protein: 16, carbs: 58, fat: 18, fiber: 2, servingSize: '1 bowl (350g)', unit: 'bowl', isLocal: true },
  { name: 'Gateau Patate (Sweet Potato Cake)', category: 'Mauritian', calories: 180, protein: 2, carbs: 32, fat: 5, fiber: 2, servingSize: '1 piece (80g)', unit: 'piece', isLocal: true },
  { name: 'Gateau Coco', category: 'Mauritian', calories: 150, protein: 2, carbs: 22, fat: 7, fiber: 1.5, servingSize: '1 piece (50g)', unit: 'piece', isLocal: true },

  // ─── Beverages ───
  { name: 'Water', category: 'Beverages', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, servingSize: '1 glass (250ml)', unit: 'glass', isLocal: false },
  { name: 'Green Tea', category: 'Beverages', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, servingSize: '1 cup (240ml)', unit: 'cup', isLocal: false },
  { name: 'Black Coffee', category: 'Beverages', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, servingSize: '1 cup (240ml)', unit: 'cup', isLocal: false },
  { name: 'Orange Juice', category: 'Beverages', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, servingSize: '1 cup (248ml)', unit: 'cup', isLocal: false },
  { name: 'Coconut Water', category: 'Beverages', calories: 46, protein: 1.7, carbs: 9, fat: 0.5, fiber: 2.6, servingSize: '1 cup (240ml)', unit: 'cup', isLocal: true },
  { name: 'Sugarcane Juice', category: 'Beverages', calories: 180, protein: 0.2, carbs: 45, fat: 0, fiber: 0, servingSize: '1 glass (250ml)', unit: 'glass', isLocal: true },
  { name: 'Mango Lassi', category: 'Beverages', calories: 200, protein: 5, carbs: 36, fat: 4, fiber: 1, servingSize: '1 glass (250ml)', unit: 'glass', isLocal: true },
  { name: 'Lemonade', category: 'Beverages', calories: 99, protein: 0.2, carbs: 26, fat: 0.1, fiber: 0.3, servingSize: '1 glass (250ml)', unit: 'glass', isLocal: false },
  { name: 'Milk Tea (Thé au lait)', category: 'Beverages', calories: 75, protein: 2, carbs: 12, fat: 2, fiber: 0, servingSize: '1 cup (240ml)', unit: 'cup', isLocal: true },

  // ─── Snacks ───
  { name: 'Almonds', category: 'Snacks', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, servingSize: '1 oz (28g, ~23 nuts)', unit: 'serving', isLocal: false },
  { name: 'Peanuts', category: 'Snacks', calories: 161, protein: 7, carbs: 4.6, fat: 14, fiber: 2.4, servingSize: '1 oz (28g)', unit: 'serving', isLocal: false },
  { name: 'Banana Chips', category: 'Snacks', calories: 147, protein: 0.7, carbs: 17, fat: 10, fiber: 2.2, servingSize: '1 oz (28g)', unit: 'serving', isLocal: true },
  { name: 'Granola Bar', category: 'Snacks', calories: 190, protein: 3, carbs: 29, fat: 7, fiber: 2, servingSize: '1 bar (42g)', unit: 'piece', isLocal: false },
  { name: 'Dark Chocolate', category: 'Snacks', calories: 170, protein: 2.2, carbs: 13, fat: 12, fiber: 3.1, servingSize: '1 oz (28g)', unit: 'serving', isLocal: false },
  { name: 'Popcorn (air-popped)', category: 'Snacks', calories: 31, protein: 1, carbs: 6.2, fat: 0.4, fiber: 1.2, servingSize: '1 cup (8g)', unit: 'cup', isLocal: false },
  { name: 'Trail Mix', category: 'Snacks', calories: 173, protein: 5, carbs: 15, fat: 11, fiber: 2, servingSize: '1 oz (28g)', unit: 'serving', isLocal: false },
  { name: 'Rice Cake', category: 'Snacks', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, fiber: 0.4, servingSize: '1 cake (9g)', unit: 'piece', isLocal: false },
]

export async function seedFoodDatabase(prisma: PrismaClient) {
  console.log('Seeding food database...')

  await prisma.foodDatabase.deleteMany()

  await prisma.foodDatabase.createMany({
    data: FOODS,
  })

  console.log(`  Created ${FOODS.length} food items`)
}
