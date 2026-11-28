import type { ReactNode } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageSelector } from '@/features/language/language-selector';
import { getCurrentUser } from '@/features/auth/current-user';
import { SessionControls } from '@/features/auth/session-controls';
import { AdminNavigation } from './admin-navigation';

export async function AdminShell({ children }: { children: ReactNode }) {
  const t = await getTranslations('Admin');
  const session = await getCurrentUser();
  const account = session.state === 'signed-in' ? session.user : { name: null, email: 'Admin' };
  return (
    <div className="admin-theme min-h-dvh bg-auth-canvas text-auth-foreground">
      <header className="sticky top-0 z-30 border-b border-auth-border/80 bg-auth-surface/90 shadow-sm shadow-auth-foreground/5 backdrop-blur-xl">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="group flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-auth-primary to-auth-primary-hover text-auth-primary-foreground shadow-md shadow-auth-primary/15 transition-transform group-hover:scale-[1.03]">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </span>
            <span className="text-[0.95rem]">{t('brand')}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-auth-primary/15 bg-auth-primary/5 px-3 py-1.5 text-xs font-semibold text-auth-primary md:inline-flex">
              <span className="size-1.5 rounded-full bg-auth-primary" aria-hidden="true" />
              {t('adminConsole')}
            </span>
            <LanguageSelector />
            <ThemeToggle />
            <SessionControls refreshNeeded={false} account={account} />
          </div>
        </div>
        <div className="w-full border-t border-auth-border/70 bg-auth-canvas/60 px-2 lg:hidden">
          <AdminNavigation />
        </div>
      </header>
      <div className="flex min-h-[calc(100dvh-4.5rem)] w-full">
        <aside className="sticky top-18 hidden h-[calc(100dvh-4.5rem)] w-64 shrink-0 border-r border-auth-border/80 bg-auth-surface/70 p-4 lg:block">
          <AdminNavigation />
        </aside>
        <main className="min-w-0 flex-1 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--auth-primary)_5%,transparent),transparent_42%)] p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
