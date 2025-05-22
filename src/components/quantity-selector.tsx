
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ quantity, onQuantityChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const handleDecrement = () => {
    onQuantityChange(Math.max(min, quantity - 1));
  };

  const handleIncrement = () => {
    onQuantityChange(Math.min(max, quantity + 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = min;
    }
    onQuantityChange(Math.max(min, Math.min(max, value)));
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handleDecrement} disabled={quantity <= min} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <Button variant="outline" size="icon" onClick={handleIncrement} disabled={quantity >= max} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
