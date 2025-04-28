
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";

export function AccessCodeSection() {
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState("");
  const [currentAccessCode, setCurrentAccessCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchCurrentAccessCode();
    }
  }, [user]);
  
  const fetchCurrentAccessCode = async () => {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('code')
        .eq('user_id', user?.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCurrentAccessCode(data.code);
      }
    } catch (error) {
      console.error("Error fetching access code:", error);
    }
  };
  
  const handleSetAccessCode = async () => {
    if (!accessCode.match(/^\d{4}$/)) {
      toast({
        title: "Invalid format",
        description: "Access code must be 4 digits",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (currentAccessCode) {
        // Update existing code
        const { error } = await supabase
          .from('access_codes')
          .update({ code: accessCode })
          .eq('user_id', user?.id);
          
        if (error) throw error;
      } else {
        // Insert new code
        const { error } = await supabase
          .from('access_codes')
          .insert({ 
            user_id: user?.id,
            code: accessCode
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Access code updated",
        description: "Your access code has been set successfully.",
      });
      
      setCurrentAccessCode(accessCode);
      setAccessCode("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Access Code</h2>
      
      {currentAccessCode && (
        <div className="mb-4 p-3 bg-cyber-darkgray/30 rounded">
          <p className="text-sm text-gray-300">Current access code: <span className="font-mono">{currentAccessCode}</span></p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="accessCode">Set or change your 4-digit access code</Label>
          <Input 
            id="accessCode"
            type="text" 
            inputMode="numeric" 
            pattern="[0-9]*" 
            maxLength={4}
            value={accessCode} 
            onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 4))} 
            placeholder="Enter 4 digits"
            className="bg-cyber-darkgray/50 border-cyber-purple/30"
          />
        </div>
        
        <Button
          onClick={handleSetAccessCode}
          disabled={isLoading || !accessCode || accessCode.length !== 4}
          className="w-full"
        >
          {isLoading ? "Processing..." : (currentAccessCode ? "Update Access Code" : "Set Access Code")}
        </Button>
      </div>
    </div>
  );
}
