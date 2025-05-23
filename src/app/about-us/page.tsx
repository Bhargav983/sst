
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Leaf, ScrollText, ChefHat } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-primary/10 p-8">
            <ChefHat className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-4xl font-bold text-primary">About SutraCart</CardTitle>
            <p className="text-xl text-muted-foreground mt-2">Crafting Authentic Flavors, Connecting Traditions</p>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-8 text-foreground/80 leading-relaxed">
            
            <section className="text-center">
              <p className="text-lg">
                At SutraCart, we believe that the heart of any great meal lies in the authenticity of its flavors. 
                Born from a passion for traditional South Indian cuisine, SutraCart is more than just a brand – 
                it's a journey to bring the rich, aromatic, and diverse tastes of South India into kitchens around the world.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <ScrollText className="h-7 w-7 text-primary" /> Our Story
              </h2>
              <p>
                Our founders, with roots deeply embedded in the culinary traditions of Andhra Pradesh, Kerala, Tamil Nadu, and Karnataka, 
                grew up savoring the distinct spice blends and masala pastes that define South Indian cooking. 
                They realized that the secret to these unforgettable flavors lay not just in the recipes, but in the quality of ingredients 
                and the meticulous preparation methods passed down through generations.
              </p>
              <p className="mt-3">
                SutraCart was established with a simple mission: to make these authentic, handcrafted masala pastes accessible to everyone, 
                without compromising on quality or tradition. We wanted to eliminate the hassle of sourcing numerous individual spices and 
                the time-consuming process of grinding them, allowing food lovers to create genuine South Indian dishes with ease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Leaf className="h-7 w-7 text-primary" /> Our Philosophy: Purity & Passion
              </h2>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p>
                    <strong>Quality Ingredients:</strong> We meticulously source the freshest, highest-quality spices, herbs, and other natural ingredients, 
                    often directly from local farms and trusted suppliers in South India. We believe that premium ingredients are the cornerstone of exceptional taste.
                  </p>
                  <p className="mt-3">
                    <strong>Authentic Recipes:</strong> Our masala pastes are prepared using age-old family recipes and traditional techniques. We avoid artificial colors, 
                    flavors, and preservatives, ensuring that every spoonful is packed with pure, natural goodness.
                  </p>
                  <p className="mt-3">
                    <strong>Handcrafted with Care:</strong> Each batch of SutraCart masala paste is made with the same love and attention to detail that you would find in a home kitchen. 
                    This commitment to craftsmanship ensures a consistent, high-quality product every time.
                  </p>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Fresh Spices" 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint="fresh spices market" 
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Our Promise</h2>
              <p>
                With SutraCart, you're not just buying a masala paste; you're embracing a culinary heritage. We promise to deliver products 
                that are authentic, flavorful, and convenient, helping you create memorable meals that tantalize your taste buds and transport 
                you to the vibrant streets and homes of South India.
              </p>
              <p className="mt-3">
                Join us on this flavorful journey and experience the true essence of South Indian cuisine with SutraCart.
              </p>
            </section>
            
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
