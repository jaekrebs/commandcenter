
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

export function AuthSection() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
      
      window.location.href = "/auth";
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Authentication</h2>
      <p className="text-sm text-gray-300 mb-4">
        Manage your account authentication settings.
      </p>
      <Button 
        variant="destructive"
        disabled={isLoading}
        onClick={handleSignOut}
        className="w-full"
      >
        {isLoading ? "Processing..." : (
          <>
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </>
        )}
      </Button>
    </div>
  );
}
