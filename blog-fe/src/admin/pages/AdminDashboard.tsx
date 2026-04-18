import { Card, CardContent } from '@shared/ui';

export default function AdminDashboard() {
  return (
    <div className="space-y-spacing-lg">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

      <div className="grid gap-spacing-lg md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Articles', value: '24' },
          { label: 'Published', value: '18' },
          { label: 'Drafts', value: '6' },
          { label: 'Total Users', value: '320' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-spacing-lg">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mt-spacing-md">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
