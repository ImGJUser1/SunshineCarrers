// components/AdminCMS.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui';
import { AdminControlPanel } from './AdminControlPanel';
import { getCollectionItems } from '../services/firebase';
import type { CollectionType } from '../types';
import { Database } from 'lucide-react';

const COLLECTIONS: { id: CollectionType; label: string }[] = [
  { id: 'pages',           label: 'Pages' },
  { id: 'jobs',            label: 'Jobs' },
  { id: 'universities',    label: 'Universities' },
  { id: 'countries',       label: 'Countries' },
  { id: 'ai_tools',        label: 'AI Tools' },
  { id: 'courses',         label: 'Courses' },
  { id: 'freelance_gigs',  label: 'Freelance Gigs' },
  { id: 'consultants',     label: 'Consultants' },
];

export const AdminCMS: React.FC = () => {
  // NOTE: this is now explicitly typed as CollectionType, not string
  const [activeCollection, setActiveCollection] = useState<CollectionType>('pages');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getCollectionItems(activeCollection);
        setItems(data);
      } catch (err) {
        console.error('Error loading collection items:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeCollection]);

  return (
    <div className="space-y-8">
      {/* High‑level admin dashboard (your existing panel) */}
      <AdminControlPanel />

      {/* Simple CMS data viewer for the active collection */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-gray-700" />
            <h3 className="text-xl font-bold text-gray-900">
              Collection Data
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {COLLECTIONS.map((c) => (
              <Button
                key={c.id}
                variant={c.id === activeCollection ? 'primary' : 'outline'}
                className="text-xs px-3 py-1"
                onClick={() => setActiveCollection(c.id)}
              >
                {c.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-3">
          Showing <Badge color="blue">{items.length}</Badge> documents from{' '}
          <span className="font-mono">{activeCollection}</span>
        </div>

        <div className="border rounded-xl p-3 max-h-96 overflow-auto bg-gray-50">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">No documents found.</p>
          ) : (
            <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
              {JSON.stringify(items, null, 2)}
            </pre>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminCMS;
