import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8 md:px-10">
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    </div>
  );
}
