'use client';

import React from 'react';
import Image from 'next/image';
import { X, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

export interface SavedAccount {
  email: string;
  name: string;
  avatar_url?: string;
  password?: string; // Encrypted/Encoded for auto-login
}

interface SavedAccountsProps {
  accounts: SavedAccount[];
  onSelect: (account: SavedAccount) => void;
  onRemove: (email: string) => void;
}

export const SavedAccounts: React.FC<SavedAccountsProps> = ({ accounts, onSelect, onRemove }) => {
  if (accounts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
        Quick Login
      </h3>
      <div className="flex flex-wrap gap-4">
        {accounts.map((account) => (
          <div key={account.email} className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => onSelect(account)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card-bg/50 border border-card-border hover:border-primary hover:bg-primary/5 transition-all w-24"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-md group-hover:scale-110 transition-transform">
                {account.avatar_url ? (
                  <Image
                    src={account.avatar_url}
                    alt={account.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold truncate w-full text-center uppercase tracking-wider">
                {account.name.split(' ')[0]}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(account.email);
              }}
              className="absolute -top-1 -right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Remove account"
            >
              <X size={10} strokeWidth={4} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
