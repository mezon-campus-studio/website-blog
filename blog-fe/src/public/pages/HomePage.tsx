import { Helmet } from 'react-helmet-async';
import { Button } from '../../shared/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <Helmet>
        <title>Home | The Curator</title>
      </Helmet>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(hsl(var(--color-muted-foreground)/0.5)_1px,transparent_0)] bg-[size:24px_24px]" />

      <div className="max-w-md w-full bg-card bg-opacity-50 backdrop-blur-sm border border-card-border p-8 rounded-xl shadow-xl text-center relative z-10">
        <h1 className="text-4xl font-bold text-foreground mb-4 font-serif italic">
          The Curator
        </h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Welcome to the development server! The main application dashboard is currently under construction. Please use the links below to test the authentication flows.
        </p>

        <div className="flex flex-col gap-4">
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/login'}
            className="w-full py-3"
          >
            Preview Login Page
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/signup'}
            className="w-full py-3"
          >
            Preview Sign Up Page
          </Button>
        </div>
      </div>
    </div>
  );
}
