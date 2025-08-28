"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Github, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';

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

  const label = useMemo(() => (stars != null ? formatCompact(stars) : 'Star'), [stars]);

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={repoUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
        <Github className="opacity-80" />
        <span className="hidden sm:inline">Star</span>
        <Star className="fill-yellow-400 stroke-yellow-500" />
        <span className="tabular-nums" aria-live="polite">
          {label}
        </span>
      </Link>
    </Button>
  );
}

