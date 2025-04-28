
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: "user@example.com",
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      toast({
        title: "Access code sent",
        description: "Check your email for the access code.",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black p-4">
      <div className="cyber-panel max-w-md w-full p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cyber-purple mb-2">ACCESS REQUIRED</h1>
          <p className="text-gray-400">Enter authentication code to proceed</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full font-mono bg-cyber-darkgray/50 border-cyber-purple/30 text-center tracking-wider"
              placeholder="ENTER ACCESS CODE"
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full cyber-button"
            disabled={isLoading}
          >
            {isLoading ? "VERIFYING..." : "AUTHENTICATE"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">SECURITY PROTOCOL v2.077</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
