import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const technologies = [
  {
    name: 'Next.js 15',
    description: 'React framework with App Router for modern web applications',
    category: 'Frontend Framework',
    url: 'https://nextjs.org',
  },
  {
    name: 'Convex',
    description:
      'Real-time backend with database, authentication, and serverless functions',
    category: 'Backend',
    url: 'https://convex.dev/referral/0XAQUA9256',
  },
  {
    name: 'Better Auth',
    description: 'Modern authentication library with secure user management',
    category: 'Authentication',
    url: 'https://better-auth.com',
  },
  {
    name: 'TypeScript',
    description: 'Strongly typed JavaScript for better development experience',
    category: 'Language',
    url: 'https://typescriptlang.org',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    category: 'Styling',
    url: 'https://tailwindcss.com',
  },
  {
    name: 'Zustand',
    description: 'Lightweight state management for React applications',
    category: 'State Management',
    url: 'https://zustand-demo.pmnd.rs',
  },
  {
    name: 'Shadcn/ui',
    description:
      'Copy-paste component library built on Radix UI and Tailwind CSS',
    category: 'UI Components',
    url: 'https://ui.shadcn.com',
  },
  {
    name: 'Polar.sh',
    description:
      'Modern payment and subscription infrastructure for developers',
    category: 'Payment Integration',
    url: 'https://polar.sh',
  },
];

export function TechnologyCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {technologies.map((tech) => (
        <a
          key={tech.name}
          href={tech.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform hover:scale-105"
        >
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{tech.name}</CardTitle>
              <CardDescription className="text-xs font-medium text-primary">
                {tech.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {tech.description}
              </p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
