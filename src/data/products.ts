
import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Andhra Chilli Paste',
    slug: 'andhra-chilli-paste',
    description: 'A fiery and aromatic paste capturing the essence of Andhra cuisine.',
    longDescription: 'Experience the authentic taste of Andhra Pradesh with our Chilli Paste. Made from sun-dried Guntur chillies and a secret blend of spices, this paste is perfect for adding a spicy kick to your curries, stir-fries, or as a marinade. Its robust flavor and vibrant color will elevate any dish.',
    price: 12.99,
    weight: '250g',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'chilli paste main' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'chilli paste closeup' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'chilli paste ingredients' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'chilli paste texture' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'chilli paste jar' }
    ],
    category: 'Spicy',
  },
  {
    id: '2',
    name: 'Kerala Coconut Curry Paste',
    slug: 'kerala-coconut-curry-paste',
    description: 'Rich and creamy paste infused with fresh coconut and traditional Kerala spices.',
    longDescription: 'Our Kerala Coconut Curry Paste brings the taste of the Malabar coast to your kitchen. A harmonious blend of freshly grated coconut, ginger, garlic, and fragrant spices like cardamom and cloves. Ideal for creating authentic fish curries, vegetable stews, or chicken preparations.',
    price: 14.50,
    weight: '250g',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'coconut curry main' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'coconut curry closeup' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'coconut curry ingredients' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'coconut curry texture' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'coconut curry dish' }
    ],
    category: 'Mild',
  },
  {
    id: '3',
    name: 'Tamilian Tamarind Paste',
    slug: 'tamilian-tamarind-paste',
    description: 'Tangy and savory tamarind paste, a staple in Tamil Nadu cooking.',
    longDescription: 'Discover the unique tangy flavor of South Indian cuisine with our Tamilian Tamarind Paste. Made from pure tamarind pulp and blended with traditional spices, it adds depth and complexity to sambar, rasam, and various gravies. A versatile ingredient for authentic Tamil flavors.',
    price: 10.99,
    weight: '200g',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'tamarind paste main' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'tamarind paste closeup' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'tamarind fruit' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'tamarind paste texture' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'tamarind paste usage' }
    ],
    category: 'Tangy',
  },
  {
    id: '4',
    name: 'Karnataka Garlic-Ginger Paste',
    slug: 'karnataka-garlic-ginger-paste',
    description: 'Aromatic and pungent paste combining fresh garlic and ginger from Karnataka.',
    longDescription: 'A fundamental ingredient in Indian cooking, our Karnataka Garlic-Ginger Paste is made from the freshest, locally sourced garlic and ginger. This smooth, aromatic paste saves you prep time and adds a foundational flavor to a wide array of vegetarian and non-vegetarian dishes.',
    price: 9.99,
    weight: '200g',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'garlic ginger main' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'garlic ginger closeup' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'fresh garlic ginger' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'ginger paste texture' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'garlic paste cooking' }
    ],
    category: 'Aromatic',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
