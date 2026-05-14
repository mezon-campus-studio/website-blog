export const dynamic = 'force-dynamic';

import React from 'react';
import { EditPostClient } from './EditPostClient';

export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-12">
      <EditPostClient id={params.id} />
    </div>
  );
}
