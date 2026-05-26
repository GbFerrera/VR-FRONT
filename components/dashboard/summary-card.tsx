import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryItemProps {
  icon: LucideIcon;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  trend?: 'up' | 'down';
}

export function SummaryCard({ items }: { items: SummaryItemProps[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Resumo do Dia</CardTitle>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Ver Todos →
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={cn('p-4 rounded-lg relative', item.bgColor)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn('p-2 rounded-full', item.iconColor)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {item.trend && (
                    <span className="text-xs text-green-600">↗</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <p className="text-xs text-gray-600 mt-1">{item.label}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
