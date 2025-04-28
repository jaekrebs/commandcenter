
import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
  type?: 'default' | 'character-required';
  showRedirect?: boolean;
}

export function LoadingState({ 
  message = "Loading cybernetic data...", 
  type = 'default',
  showRedirect = false 
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="animate-pulse mb-4">
        <Loader className="w-12 h-12 text-cyber-purple animate-spin" />
      </div>
      
      <p className="text-cyber-purple font-bold text-lg mb-2">{message}</p>
      
      {type === 'character-required' && (
        <p className="text-gray-400 text-sm mb-4">
          No character profile selected. Please select a character profile to continue.
        </p>
      )}
      
      {showRedirect && (
        <div className="mt-4 space-x-4">
          <a href="/" className="text-sm cyber-button">
            Return to Dashboard
          </a>
          <a href="/settings" className="text-sm cyber-button">
            Go to Settings
          </a>
        </div>
      )}
    </div>
  );
}
