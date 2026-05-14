export const dynamic = 'force-dynamic';

import React from 'react';
import { CreatePostClient } from './CreatePostClient';

export default function CreatePostPage() {
  return (
    <div className="container py-8 pb-20">
      <CreatePostClient />
    </div>
  );
}
