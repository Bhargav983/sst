
import type { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`}
        />
      );
    }
    return stars;
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="h-12 w-12">
          {review.avatarUrl ? (
             <Image 
                src={review.avatarUrl} 
                alt={review.customerName} 
                width={48} 
                height={48} 
                className="rounded-full" 
                data-ai-hint="customer avatar"
            />
          ) : (
            <AvatarFallback>{review.customerName.substring(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold">{review.customerName}</CardTitle>
          <div className="flex items-center gap-0.5 mt-1">
            {renderStars()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80 leading-relaxed mb-2">"{review.reviewText}"</p>
        <p className="text-xs text-muted-foreground text-right">{review.date}</p>
      </CardContent>
    </Card>
  );
}
