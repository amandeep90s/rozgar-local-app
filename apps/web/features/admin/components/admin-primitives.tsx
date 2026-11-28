import type { ReactNode } from 'react';
import { AlertCircle, LoaderCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const t = useTranslations('Admin');
  return (
    <div className="relative isolate mb-6 flex flex-col gap-4 overflow-hidden rounded-3xl border border-auth-border/80 bg-gradient-to-br from-auth-surface via-auth-surface to-auth-primary/5 p-5 shadow-lg shadow-auth-foreground/[0.035] sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 -z-10 size-48 rounded-full bg-auth-primary/10 blur-3xl"
      />
      <div className="relative min-w-0">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-auth-primary/15 bg-auth-primary/5 px-3 py-1.5 text-[0.68rem] font-bold tracking-[0.14em] text-auth-primary uppercase">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          {t('adminConsole')}
        </p>
        <h1 className="text-2xl leading-tight font-semibold tracking-tight text-auth-foreground sm:text-3xl lg:text-[2rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-auth-muted sm:text-[0.95rem]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="relative shrink-0">{children}</div>}
    </div>
  );
}

export function AdminNotice({
  title,
  message,
  onRetry,
  retryText = 'Retry',
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
        <span>{message}</span>
        {onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw aria-hidden="true" />
            {retryText}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function AdminLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 py-10 text-sm text-muted-foreground"
    >
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function AdminStatusBadge({ status, label }: { status: string; label?: string }) {
  const appearance = ['APPROVED', 'VERIFIED', 'PUBLISHED', 'HIRED', 'ACTION_TAKEN'].includes(status)
    ? 'border-emerald-600/15 bg-emerald-600/10 text-emerald-800 dark:text-emerald-200'
    : ['REJECTED', 'REMOVED', 'DISMISSED', 'SUSPENDED'].includes(status)
      ? 'border-rose-600/15 bg-rose-600/10 text-rose-800 dark:text-rose-200'
      : ['PENDING', 'PENDING_REVIEW', 'UNDER_REVIEW', 'NEEDS_MORE_INFO'].includes(status)
        ? 'border-amber-600/20 bg-amber-500/10 text-amber-800 dark:text-amber-200'
        : 'border-auth-border bg-auth-canvas text-auth-muted';
  return (
    <Badge variant="outline" className={cn('h-6 gap-1.5 px-2.5 font-semibold', appearance)}>
      <span className="size-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      {label ?? formatAdminEnum(status)}
    </Badge>
  );
}

export type AdminColumn<T> = {
  header: string;
  cell: (item: T) => ReactNode;
};

export function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyTitle,
  emptyDescription,
}: {
  columns: AdminColumn<T>[];
  rows: T[];
  getRowKey: (item: T) => string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const emptyState = (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  return (
    <>
      <div className="grid gap-3 p-3 lg:hidden">
        {rows.length ? (
          rows.map((row) => (
            <article
              key={getRowKey(row)}
              className="rounded-2xl border border-auth-border/80 bg-auth-surface p-4 shadow-sm shadow-auth-foreground/[0.03]"
            >
              <dl className="grid gap-3">
                {columns.map((column) => (
                  <div
                    key={column.header}
                    className="grid grid-cols-[minmax(6.5rem,0.7fr)_minmax(0,1.3fr)] items-start gap-3"
                  >
                    <dt className="text-xs font-medium text-auth-muted">{column.header}</dt>
                    <dd className="min-w-0 text-right text-sm text-auth-foreground">
                      {column.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))
        ) : (
          <div className="py-8 text-center">{emptyState}</div>
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <Table className="min-w-[760px]">
          <TableHeader className="bg-auth-primary/10">
            <TableRow className="border-auth-border hover:bg-auth-primary/10">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className="h-12 bg-auth-primary/10 px-4 text-xs font-semibold tracking-[0.08em] text-auth-muted uppercase"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  className="border-auth-border/70 odd:bg-auth-canvas/25 hover:bg-auth-primary/5"
                >
                  {columns.map((column) => (
                    <TableCell key={column.header} className="px-4 py-3.5 text-auth-foreground">
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-auth-border/70 hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-48 px-4 text-center whitespace-normal"
                >
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function AdminPagination({
  page,
  pageSize,
  total,
  hasNextPage,
  onPageChange,
  summary,
  previousText,
  nextText,
}: {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  summary: string;
  previousText: string;
  nextText: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">{summary}</p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text={previousText}
              aria-disabled={page <= 1}
              onClick={(event) => {
                event.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text={nextText}
              aria-disabled={!hasNextPage || page >= pageCount}
              onClick={(event) => {
                event.preventDefault();
                if (hasNextPage && page < pageCount) onPageChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function formatAdminDate(value: string | null, locale: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

export function formatAdminEnum(value: string) {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}
