import { Card, CardContent } from '@/components/ui/card';

type InfoCardProps = {
  desc: string;
  value: string | number;
};

export const InfoCard = ({ desc, value }: InfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{desc}</p>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
};
