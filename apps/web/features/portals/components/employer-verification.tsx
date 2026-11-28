'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type {
  EmployerDocumentType,
  EmployerVerificationDocumentResponse,
  EmployerVerificationResponse,
} from '@repo/contracts';
import { FileCheck2, FileText, Info, ShieldCheck, Trash2, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import {
  deleteEmployerVerificationDocumentAction,
  submitEmployerVerificationAction,
  uploadEmployerVerificationDocumentAction,
} from '@/features/portals/portal-actions';

export function EmployerVerification({
  verification,
  initialDocuments,
}: {
  verification: EmployerVerificationResponse;
  initialDocuments: EmployerVerificationDocumentResponse[];
}) {
  const t = useTranslations('Portal');
  const [documents, setDocuments] = useState(initialDocuments);
  const [documentType, setDocumentType] = useState<EmployerDocumentType>('OTHER');
  const [file, setFile] = useState<File | null>(null);
  const [evidenceConfirmed, setEvidenceConfirmed] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function upload() {
    if (!file) {
      setError(t('documentRequired'));
      return;
    }
    if (!evidenceConfirmed) {
      setError(t('evidenceConfirmationRequired'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('documentTooLarge'));
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const base64Data = await fileToBase64(file);
      const result = await uploadEmployerVerificationDocumentAction({
        documentType,
        evidencePolicyConfirmed: true,
        originalName: file.name,
        mimeType: file.type,
        base64Data,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDocuments((current) => [...current, result.data]);
      setFile(null);
      setFileInputKey((current) => current + 1);
      setEvidenceConfirmed(false);
      setMessage(t('documentUploaded'));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('documentRequired'));
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError('');
    setMessage('');
    const result = await submitEmployerVerificationAction();
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessage(t('verificationSubmitted'));
  }

  async function remove(documentId: string) {
    setBusy(true);
    setError('');
    setMessage('');
    const result = await deleteEmployerVerificationDocumentAction(documentId);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDocuments((current) => current.filter((document) => document.id !== documentId));
    setEvidenceConfirmed(false);
    setMessage(t('documentRemoved'));
  }

  const canChangeDocuments = !['VERIFIED', 'SUSPENDED'].includes(verification.verificationStatus);

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#123b2b] p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-7 lg:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-14 -z-10 size-72 rounded-full bg-emerald-300/15 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-100 shadow-inner">
            <ShieldCheck className="size-7" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-[0.14em] text-emerald-100/80 uppercase">
              {t('verification')}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {t('verificationDescription')}
            </h1>
            <p className="mt-2 text-sm text-white/75">
              {t('verificationLevel')}:{' '}
              <span className="font-semibold text-white">
                {t(`verificationLevels.${verification.verificationLevel}`)}
              </span>
            </p>
          </div>
          <Badge className="h-7 border border-white/20 bg-white/10 px-3 text-white shadow-none">
            {t(`verificationStatuses.${verification.verificationStatus}`)}
          </Badge>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-auth-primary/15 bg-auth-primary/5 p-4 text-sm leading-6 text-auth-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-auth-primary" aria-hidden="true" />
          <p>{t('privateEvidenceNotice')}</p>
        </div>
        <p
          role="note"
          className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm leading-6 text-amber-900 dark:text-amber-100"
        >
          {t('noAadhaarNotice')}
        </p>
      </div>

      {(verification.rejectionReason || verification.verificationNote) && (
        <div className="grid gap-3 lg:grid-cols-2">
          {verification.rejectionReason && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-xs font-bold tracking-wide text-destructive uppercase">
                {t('reason')}
              </p>
              <p className="mt-1 text-sm leading-6">{verification.rejectionReason}</p>
            </div>
          )}
          {verification.verificationNote && (
            <div className="rounded-2xl border border-auth-border bg-auth-surface p-4">
              <p className="text-xs font-bold tracking-wide text-auth-muted uppercase">
                {t('note')}
              </p>
              <p className="mt-1 text-sm leading-6">{verification.verificationNote}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-xl border border-emerald-700/15 bg-emerald-700/5 p-4 text-sm font-medium text-emerald-800 dark:text-emerald-200"
        >
          {message}
        </p>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card className="overflow-hidden rounded-3xl border-auth-border/80 shadow-sm shadow-auth-foreground/[0.025]">
          <CardHeader className="border-b border-auth-border/70 bg-auth-canvas/35 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-auth-primary/8 text-auth-primary">
                <FileCheck2 className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="text-base">{t('documents')}</CardTitle>
                <CardDescription className="mt-1">
                  {documents.length} {t('documents').toLowerCase()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-5">
            {documents.length > 0 ? (
              documents.map((document) => (
                <div
                  key={document.id}
                  className="group flex flex-wrap items-center gap-3 rounded-2xl border border-auth-border/80 bg-auth-surface p-3.5 transition hover:border-auth-primary/25 hover:shadow-sm sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-auth-canvas text-auth-primary">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-auth-foreground">
                      {document.originalName ?? document.documentType}
                    </p>
                    <p className="mt-1 text-xs text-auth-muted">
                      {document.reviewStatus}
                      {document.reviewNote ? ` · ${document.reviewNote}` : ''}
                    </p>
                  </div>
                  {canChangeDocuments && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-auth-muted hover:bg-destructive/5 hover:text-destructive"
                      aria-label={t('removeDocument')}
                      disabled={busy}
                      onClick={() => void remove(document.id)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-auth-border px-5 py-10 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-auth-canvas text-auth-muted">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-medium text-auth-foreground">{t('noDocuments')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {canChangeDocuments && (
          <Card className="overflow-hidden rounded-3xl border-auth-border/80 shadow-sm shadow-auth-foreground/[0.025]">
            <CardHeader className="border-b border-auth-border/70 bg-auth-canvas/35 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-auth-primary/8 text-auth-primary">
                  <UploadCloud className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="text-base">{t('uploadDocument')}</CardTitle>
                  <CardDescription className="mt-1">{t('privateEvidenceNotice')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-5 sm:p-6">
              <NativeSelect
                aria-label={t('documentType')}
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value as EmployerDocumentType)}
                className="w-full [&_[data-slot=native-select]]:h-11 [&_[data-slot=native-select]]:rounded-xl"
              >
                <NativeSelectOption value="GST_CERTIFICATE">GST certificate</NativeSelectOption>
                <NativeSelectOption value="UDYAM_CERTIFICATE">UDYAM certificate</NativeSelectOption>
                <NativeSelectOption value="SHOP_ESTABLISHMENT_REGISTRATION">
                  Shop establishment
                </NativeSelectOption>
                <NativeSelectOption value="TRADE_LICENSE">Trade license</NativeSelectOption>
                <NativeSelectOption value="INCORPORATION_CERTIFICATE">
                  Incorporation certificate
                </NativeSelectOption>
                <NativeSelectOption value="BUSINESS_ADDRESS_PROOF">
                  Business address proof
                </NativeSelectOption>
                <NativeSelectOption value="BUSINESS_BANK_PROOF">
                  Business bank proof
                </NativeSelectOption>
                <NativeSelectOption value="FSSAI_LICENSE">FSSAI license</NativeSelectOption>
                <NativeSelectOption value="REPRESENTATIVE_AUTHORIZATION">
                  Representative authorization
                </NativeSelectOption>
                <NativeSelectOption value="OTHER">Other</NativeSelectOption>
              </NativeSelect>
              <Input
                key={fileInputKey}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="h-12 rounded-xl border-dashed border-auth-border bg-auth-canvas/45 py-2.5"
              />
              {file && (
                <p className="truncate rounded-lg bg-auth-canvas/60 px-3 py-2 text-xs font-medium text-auth-muted">
                  {file.name}
                </p>
              )}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-auth-border bg-auth-canvas/40 p-3.5 text-sm leading-5 text-auth-muted transition hover:border-auth-primary/25">
                <Checkbox
                  id="verification-evidence-confirmation"
                  checked={evidenceConfirmed}
                  onCheckedChange={(checked) => setEvidenceConfirmed(checked === true)}
                  disabled={busy}
                  className="mt-0.5"
                />
                <span>{t('noAadhaarConfirmation')}</span>
              </label>
              <Button
                type="button"
                className="h-11 w-full rounded-xl shadow-sm"
                disabled={busy || !file || !evidenceConfirmed}
                onClick={() => void upload()}
              >
                <UploadCloud className="size-4" aria-hidden="true" />
                {busy ? t('uploading') : t('uploadDocument')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {['NOT_SUBMITTED', 'REJECTED', 'NEEDS_MORE_INFO'].includes(verification.verificationStatus) &&
        documents.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-auth-primary/15 bg-auth-primary/5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-auth-surface text-auth-primary shadow-sm">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-auth-foreground">{t('submitVerification')}</p>
                <p className="mt-1 text-xs text-auth-muted">{t('verificationDescription')}</p>
              </div>
            </div>
            <Button
              type="button"
              className="h-11 rounded-xl px-5"
              disabled={busy}
              onClick={() => void submit()}
            >
              {t('submitVerification')}
            </Button>
          </div>
        )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The document could not be read.'));
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}
