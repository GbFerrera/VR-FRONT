import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockStatsProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend: string;
  bgColor: string;
  textColor: string;
}

export function StockStats({
  icon: Icon,
  value,
  label,
  trend,
  bgColor,
  textColor,
}: StockStatsProps) {
  return (
    <Card className={cn('border-none', bgColor)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-lg bg-white/20')}>
            <Icon className={cn('w-8 h-8', textColor)} />
          </div>
          <div className="flex-1">
            <p className={cn('text-3xl font-bold', textColor)}>{value}</p>
            <p className={cn('text-sm font-medium mt-1', textColor)}>{label}</p>
            <p className={cn('text-xs mt-2', textColor, 'opacity-90')}>{trend}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
