"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Github, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type StarsResponse = {
  stars: number;
  html_url?: string;
  error?: string;
};

function formatCompact(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { notation: 'compact' }).format(n);
  } catch {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
  }
}

export function GithubStar() {
  const [stars, setStars] = useState<number | null>(null);
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/0xAquaWolf/AquaKit');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/github-stars', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data: StarsResponse = await res.json();
        if (!mounted) return;
        if (typeof data?.stars === 'number') setStars(data.stars);
        if (data?.html_url) setRepoUrl(data.html_url);
      } catch {
        // Non-fatal: leave stars as null
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const label = useMemo(() => (stars != null ? formatCompact(stars) : null), [stars]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="outline" size="sm" className="h-8 px-2">
          <Link
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star AquaKit on GitHub"
            className="group inline-flex items-center gap-1.5"
          >
            <Github className="size-4 opacity-80 transition-opacity group-hover:opacity-100" />
            {label && (
              <span
                className="tabular-nums text-xs text-foreground/80 rounded-sm px-1.5 py-0.5 leading-none"
                aria-live="polite"
              >
                {label}
              </span>
            )}
            <Star className="size-4 opacity-80" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Star AquaKit on GitHub</TooltipContent>
    </Tooltip>
  );
}

export function GithubStarSkeleton() {
  return (
    <Button variant="outline" size="sm" className="h-8 px-2" disabled>
      <div className="inline-flex items-center gap-1.5">
        <Github className="size-4 opacity-50" />
        <span className="h-3 w-8 rounded bg-muted" />
        <Star className="size-4 opacity-50" />
      </div>
    </Button>
  );
}
