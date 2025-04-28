
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function AuthSection() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEmailSignIn = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithOtp({
        email: 'user@example.com',
        // Since you're the only user, we'll hardcode this
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in."
      });
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
        variant="default"
        disabled={isLoading}
        onClick={() => supabase.auth.signOut().then(() => {
          toast({
            title: "Signed out",
            description: "You have been successfully signed out."
          });
          window.location.href = "/";
        })}
        className="w-full"
      >
        {isLoading ? "Processing..." : "Sign Out"}
      </Button>
    </div>
  );
}
