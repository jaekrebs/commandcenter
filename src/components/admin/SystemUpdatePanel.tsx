
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Settings2, RefreshCw, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function SystemUpdatePanel() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: systemStatus } = useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      // Simulated system status for UI display purposes
      return {
        version: "2.3.1",
        lastUpdate: new Date().toISOString(),
        status: "stable"
      };
    }
  });

  const handleSystemUpdate = async () => {
    setIsUpdating(true);
    setProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // In a real application, this would trigger system updates
      // For now, we'll just show a notification
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast({
        title: "System Update",
        description: "System health check completed. All systems operational.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete system update",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsUpdating(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">System Version:</span>
          <span className="text-sm">{systemStatus?.version || "Unknown"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Last Updated:</span>
          <span className="text-sm">
            {systemStatus?.lastUpdate 
              ? new Date(systemStatus.lastUpdate).toLocaleString() 
              : "Never"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Status:</span>
          <div className="flex items-center">
            <Activity className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-sm text-green-500">{systemStatus?.status || "Unknown"}</span>
          </div>
        </div>
      </div>
      
      {isUpdating && (
        <Progress value={progress} className="h-2 my-2" />
      )}

      <div className="flex justify-between">
        <Button 
          onClick={handleSystemUpdate} 
          disabled={isUpdating}
          className="cyber-button text-sm"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Settings2 className="mr-2 h-4 w-4" />
              Update System
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isUpdating}
          onClick={() => {
            toast({
              title: "System Check",
              description: "System diagnostics started. This may take a moment.",
            });
          }}
        >
          <Activity className="mr-2 h-4 w-4" />
          Run Diagnostics
        </Button>
      </div>
    </div>
  );
}
