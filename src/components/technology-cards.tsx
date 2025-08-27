import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const technologies = [
  {
    name: 'Next.js 15',
    description: 'React framework with App Router for modern web applications',
    category: 'Frontend Framework'
  },
  {
    name: 'Convex',
    description: 'Real-time backend with database, authentication, and serverless functions',
    category: 'Backend'
  },
  {
    name: 'Better Auth',
    description: 'Modern authentication library with secure user management',
    category: 'Authentication'
  },
  {
    name: 'TypeScript',
    description: 'Strongly typed JavaScript for better development experience',
    category: 'Language'
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    category: 'Styling'
  },
  {
    name: 'Zustand',
    description: 'Lightweight state management for React applications',
    category: 'State Management'
  },
  {
    name: 'Shadcn/ui',
    description: 'Copy-paste component library built on Radix UI and Tailwind CSS',
    category: 'UI Components'
  },
  {
    name: 'Polar.sh',
    description: 'Modern payment and subscription infrastructure for developers',
    category: 'Payment Integration'
  }
];

export function TechnologyCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {technologies.map((tech) => (
        <Card key={tech.name} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{tech.name}</CardTitle>
            <CardDescription className="text-xs font-medium text-primary">
              {tech.category}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tech.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}