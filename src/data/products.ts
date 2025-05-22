
import type { Product, ProductVariant } from '@/types';

// Export this function
export const calculatePricePerUnit = (price: number, weightString: string, unitWeight: number = 100, unitLabel: string = "g"): string => {
  const weightMatch = weightString.match(/(\d+)/);
  if (!weightMatch) return '';
  const weightValue = parseFloat(weightMatch[1]);
  if (isNaN(weightValue) || weightValue === 0) return '';

  const pricePerBaseUnit = (price / weightValue);
  const pricePerDisplayUnit = pricePerBaseUnit * unitWeight;
  return `(₹${pricePerDisplayUnit.toFixed(2)} / ${unitWeight}${unitLabel})`;
};

const generateVariants = (basePrice: number, baseWeight: number, weights: number[]): ProductVariant[] => {
  return weights.map((w, index) => {
    const priceMultiplier = w / baseWeight;
    const retailPrice = parseFloat((basePrice * Math.pow(priceMultiplier, 0.85)).toFixed(2));
    const weightStr = `${w}g`;

    // Wholesale specific logic
    // Example: larger packs have smaller min qty for wholesale, smaller packs might have higher min qty
    let wholesaleMinQuantity;
    if (w <= 100) {
      wholesaleMinQuantity = 10; // Min 10 units for 100g packs
    } else if (w <= 250) {
      wholesaleMinQuantity = 5;  // Min 5 units for 250g packs
    } else {
      wholesaleMinQuantity = 3;  // Min 3 units for 500g+ packs
    }
    const wholesalePrice = parseFloat((retailPrice * 0.85).toFixed(2)); // 15% discount for wholesale

    return {
      weight: weightStr,
      price: retailPrice,
      pricePerUnit: calculatePricePerUnit(retailPrice, weightStr),
      sku: `SKU-${baseWeight}-${w}-${index}`,
      wholesalePrice: wholesalePrice,
      wholesaleMinQuantity: wholesaleMinQuantity,
    };
  });
};


export const products: Product[] = [
  {
    id: '1',
    name: 'Andhra Chilli Paste',
    slug: 'andhra-chilli-paste',
    description: 'A fiery and aromatic paste capturing the essence of Andhra cuisine.',
    longDescription: 'Experience the authentic taste of Andhra Pradesh with our Chilli Paste. Made from sun-dried Guntur chillies and a secret blend of spices, this paste is perfect for adding a spicy kick to your curries, stir-fries, or as a marinade. Its robust flavor and vibrant color will elevate any dish.',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'chilli paste main' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'chilli paste closeup' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'chilli paste ingredients' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'chilli paste texture' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'chilli paste jar' }
    ],
    category: 'Spicy',
    defaultVariantIndex: 1, // 250g
    variants: generateVariants(12.99, 250, [100, 250, 500]),
  },
  {
    id: '2',
    name: 'Kerala Coconut Curry Paste',
    slug: 'kerala-coconut-curry-paste',
    description: 'Rich and creamy paste infused with fresh coconut and traditional Kerala spices.',
    longDescription: 'Our Kerala Coconut Curry Paste brings the taste of the Malabar coast to your kitchen. A harmonious blend of freshly grated coconut, ginger, garlic, and fragrant spices like cardamom and cloves. Ideal for creating authentic fish curries, vegetable stews, or chicken preparations.',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'coconut curry main' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'coconut curry closeup' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'coconut curry ingredients' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'coconut curry texture' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'coconut curry dish' }
    ],
    category: 'Mild',
    defaultVariantIndex: 1, // 250g
    variants: generateVariants(14.50, 250, [100, 250, 450]),
  },
  {
    id: '3',
    name: 'Tamilian Tamarind Paste',
    slug: 'tamilian-tamarind-paste',
    description: 'Tangy and savory tamarind paste, a staple in Tamil Nadu cooking.',
    longDescription: 'Discover the unique tangy flavor of South Indian cuisine with our Tamilian Tamarind Paste. Made from pure tamarind pulp and blended with traditional spices, it adds depth and complexity to sambar, rasam, and various gravies. A versatile ingredient for authentic Tamil flavors.',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'tamarind paste main' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'tamarind paste closeup' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'tamarind fruit' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'tamarind paste texture' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'tamarind paste usage' }
    ],
    category: 'Tangy',
    defaultVariantIndex: 0, // 200g
    variants: generateVariants(10.99, 200, [200, 400]),
  },
  {
    id: '4',
    name: 'Karnataka Garlic-Ginger Paste',
    slug: 'karnataka-garlic-ginger-paste',
    description: 'Aromatic and pungent paste combining fresh garlic and ginger from Karnataka.',
    longDescription: 'A fundamental ingredient in Indian cooking, our Karnataka Garlic-Ginger Paste is made from the freshest, locally sourced garlic and ginger. This smooth, aromatic paste saves you prep time and adds a foundational flavor to a wide array of vegetarian and non-vegetarian dishes.',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'garlic ginger main' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'garlic ginger closeup' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'fresh garlic ginger' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'ginger paste texture' },
      { url: 'https://placehold.co/100x100.png', dataAiHint: 'garlic paste cooking' }
    ],
    category: 'Aromatic',
    defaultVariantIndex: 0, // 200g
    variants: generateVariants(9.99, 200, [200, 350, 600]),
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
