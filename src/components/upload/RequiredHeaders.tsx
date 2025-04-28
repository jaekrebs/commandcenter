
import { AlertCircle } from 'lucide-react';

interface RequiredHeadersProps {
  headers: string[];
}

export function RequiredHeaders({ headers }: RequiredHeadersProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <AlertCircle className="w-4 h-4" />
      <span>Required headers: {headers.join(', ')}</span>
    </div>
  );
}
