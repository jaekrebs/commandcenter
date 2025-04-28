
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Terminal } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function AccessCodeForm() {
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const navigate = useNavigate();

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessCode.length !== 4) {
      toast({
        title: "Invalid access code",
        description: "Please enter a valid 4-digit access code",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First, get the user's email using the access code
      const { data, error: fetchError } = await supabase
        .rpc('get_user_by_access_code', { access_code: accessCode });
        
      if (fetchError || !data || data.length === 0) {
        throw new Error("Invalid access code");
      }
      
      const userEmail = data[0].email;
      
      // Then sign in with a magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      toast({
        title: "Access granted",
        description: "A magic link has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Access denied",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="text-center mb-4">
          <Terminal className="mx-auto h-12 w-12 text-cyber-purple mb-2" />
          <h2 className="text-xl font-bold text-cyber-purple">ENTER ACCESS CODE</h2>
        </div>
        
        <div className="flex justify-center mb-4">
          <InputOTP
            maxLength={4}
            value={accessCode}
            onChange={setAccessCode}
            render={({ slots }) => (
              <InputOTPGroup className="gap-4">
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-14 h-14 text-2xl bg-cyber-darkgray/50 border-cyber-purple/30"
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cyber-button"
        disabled={loading}
      >
        {loading ? "Verifying..." : "AUTHENTICATE"}
      </Button>
    </form>
  );
}
