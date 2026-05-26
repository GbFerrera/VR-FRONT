import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor,
  textColor,
  trend,
}: StatCardProps) {
  return (
    <Card className={cn('border-none', bgColor)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn('w-5 h-5', textColor)} />
              <span className={cn('text-2xl font-bold', textColor)}>{value}</span>
            </div>
            <p className="text-sm text-white/90 font-medium">{title}</p>
            <p className="text-xs text-white/70 mt-1">{subtitle}</p>
          </div>
          {trend && (
            <div className="text-right">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-200' : 'text-red-200'
                )}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
