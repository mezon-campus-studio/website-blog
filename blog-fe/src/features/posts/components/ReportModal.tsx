'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui';
import { Flag, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useReportPost } from '../hooks/usePostInteractions';

const REPORT_REASONS = [
  { value: 'Spam', label: '🚫 Spam', description: 'Repetitive or promotional content' },
  { value: 'Misinformation', label: '📰 Misinformation', description: 'False or misleading information' },
  { value: 'Harassment', label: '⚠️ Harassment', description: 'Threatening or hateful content' },
  { value: 'Inappropriate', label: '🔞 Inappropriate', description: 'Explicit or offensive material' },
  { value: 'Other', label: '💬 Other', description: 'Another reason not listed' },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle?: string;
}

export function ReportModal({ isOpen, onClose, postId, postTitle }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: reportPost, isPending, error } = useReportPost();

  const handleClose = () => {
    setSelectedReason('');
    setDetail('');
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    const reason = detail.trim() ? `${selectedReason}: ${detail.trim()}` : selectedReason;

    reportPost(
      { postId, reason },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={!isPending}
      className="bg-card-bg/95 backdrop-blur-xl border-card-border/50"
    >
      {submitted ? (
        // ── Success State ──
        <div className="flex flex-col items-center gap-4 py-6 text-center w-full">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle2 className="text-secondary" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight mb-1">Report Submitted</h3>
            <p className="text-sm text-muted-foreground">
              Thank you. Our team will review this content shortly.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleClose}
            className="mt-2 px-8 rounded-full font-bold"
          >
            Done
          </Button>
        </div>
      ) : (
        // ── Form State ──
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <Flag className="text-destructive" size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-lg tracking-tight truncate">Report Post</h3>
              {postTitle && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  "{postTitle}"
                </p>
              )}
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Select a reason
            </p>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedReason(r.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    selectedReason === r.value
                      ? 'border-destructive bg-destructive/5 text-destructive'
                      : 'border-card-border bg-card-bg/50 hover:border-destructive/40'
                  }`}
                >
                  <span className="text-sm font-bold flex-1">{r.label}</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">{r.description}</span>
                  {selectedReason === r.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detail (optional) */}
          {selectedReason === 'Other' || selectedReason ? (
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Additional details{selectedReason !== 'Other' && ' (optional)'}
              </p>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Describe the issue in more detail..."
                rows={3}
                required={selectedReason === 'Other'}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-destructive/50 outline-none transition-all resize-none"
              />
            </div>
          ) : null}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm">
              <AlertTriangle size={16} />
              <span>
                {(error as any).response?.data?.message || 'Failed to submit report. Please try again.'}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedReason || isPending}
              className="flex-[2] rounded-xl font-bold text-[10px] uppercase tracking-widest bg-destructive hover:bg-destructive/80 text-white shadow-lg shadow-destructive/20"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Flag size={14} className="mr-2" />
              )}
              {isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
