'use client';

import React, { Suspense } from 'react';
import { useMyReports, useDeleteReport } from '@/features/posts/hooks/useReports';
import { Button, Card, CardContent } from '@/components/ui';
import { Flag, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ReportStatus } from '@/features/posts/types';

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const configs = {
    PENDING: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock, label: 'Pending' },
    RESOLVED: { color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2, label: 'Resolved' },
    REJECTED: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle, label: 'Rejected' },
    REVIEWED: { color: 'bg-primary/10 text-primary border-primary/20', icon: AlertCircle, label: 'Under Review' },
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </div>
  );
};

function MyReportsContent() {
  const { data: reports, isLoading } = useMyReports();
  const { mutate: retractReport, isPending: isRetracting } = useDeleteReport();

  const handleRetract = (id: string) => {
    if (confirm('Are you sure you want to retract this report?')) {
      retractReport(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-4xl font-black tracking-tight">My Reports</h1>
        <p className="text-muted-foreground italic">Track the status of stories you've reported for community guidelines violations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse border-card-border bg-card-bg/30">
              <CardContent className="p-6 h-32" />
            </Card>
          ))
        ) : reports && reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id} className="group border-card-border bg-card-bg/30 backdrop-blur-md hover:bg-card-bg/50 transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="flex md:flex-col items-center gap-4 shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive group-hover:scale-110 transition-transform">
                      <Flag size={24} />
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-lg leading-tight line-clamp-1">
                        Reported Post ID: {report.postId}
                      </h3>
                      <span className="text-[10px] font-medium text-muted-foreground shrink-0 uppercase tracking-widest">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="bg-background/50 rounded-xl p-4 border border-card-border/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-tighter text-[10px]">Reason provided:</p>
                      <p className="text-sm italic">"{report.reason}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link href={`/posts/${report.postId}`} target="_blank">
                      <Button variant="ghost" size="sm" className="gap-2 font-bold uppercase tracking-widest text-[10px]">
                        <ExternalLink size={14} />
                        View Post
                      </Button>
                    </Link>
                    
                    {report.status === 'PENDING' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRetract(report.id)}
                        disabled={isRetracting}
                        className="text-destructive hover:bg-destructive/10 gap-2 font-bold uppercase tracking-widest text-[10px]"
                      >
                        {isRetracting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Retract
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card-bg/20 rounded-3xl border border-dashed border-card-border">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
              <Flag size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">No reports yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">You haven't reported any content. If you see something that violates our rules, let us know.</p>
            </div>
            <Button variant="primary" onClick={() => window.location.href = '/'} className="rounded-full px-8">Explore Feed</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MyReportsClient() {
  return (
    <Suspense fallback={<div>Loading reports...</div>}>
      <MyReportsContent />
    </Suspense>
  );
}
