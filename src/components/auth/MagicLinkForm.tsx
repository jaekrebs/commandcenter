
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function MagicLinkForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;
      
      toast({
        title: "Magic link sent",
        description: "Check your email for a login link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMagicLink} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyber-darkgray/50 border-cyber-purple/30"
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full cyber-button"
        disabled={loading}
      >
        {loading ? (
          "Sending Magic Link..."
        ) : (
          <>
            <Mail className="w-4 h-4" />
            <span>Send Magic Link</span>
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-400 text-center mt-2">
        We'll send a one-time login link to your email
      </p>
    </form>
  );
}
