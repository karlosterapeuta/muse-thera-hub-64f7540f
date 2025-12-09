import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ExternalLink, MessageCircle, Calendar } from 'lucide-react';
import { Product } from '@/data/products-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Calendar
};

interface ProductAnnouncementCardProps {
  product: Product;
}

export function ProductAnnouncementCard({ product }: ProductAnnouncementCardProps) {
  const IconComponent = iconMap[product.icon] || MessageCircle;

  const handleClick = () => {
    window.open(product.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Gradient accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${product.color}, ${product.color}80)` }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${product.color}20` }}
            >
              <IconComponent 
                className="h-5 w-5" 
                style={{ color: product.color }} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
              {product.badge && (
                <span 
                  className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${product.color}15`,
                    color: product.color,
                    border: `1px solid ${product.color}30`
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </div>
          <Badge 
            variant={product.priceType === 'free' ? 'default' : 'secondary'}
            className={product.priceType === 'free' 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
            }
          >
            {product.price}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        <ul className="space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check 
                className="h-4 w-4 flex-shrink-0" 
                style={{ color: product.color }} 
              />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={handleClick}
          className="w-full group/btn transition-all duration-300"
          style={{ 
            backgroundColor: product.color,
            color: 'white'
          }}
        >
          <span>Conhecer Agora</span>
          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
