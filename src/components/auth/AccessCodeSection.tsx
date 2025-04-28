import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function AccessCodeSection() {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing code on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user) return;

        const { data, error } = await supabase
          .from("access_codes")
          .select("code")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (error) throw error;
        if (data?.code) setAccessCode(data.code);
      } catch (err) {
        console.error("Error fetching access code:", err);
      }
    })();
  }, []);

  // Save or update
  const handleSaveAccessCode = async () => {
    if (!/^\d{4}$/.test(accessCode)) {
      toast({ title: "Invalid access code", description: "Please enter a valid 4-digit code", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error("No authenticated user");

      const { data: existing, error: fetchError } = await supabase
        .from("access_codes")
        .select("code")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (fetchError) throw fetchError;

      const op = existing
        ? supabase.from("access_codes").update({ code: accessCode }).eq("user_id", session.user.id)
        : supabase.from("access_codes").insert([{ user_id: session.user.id, code: accessCode }]);
      const { error } = await op;
      if (error) throw error;

      toast({ title: "Access code updated", description: "Your access code has been saved." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Access Code</h2>
      <p className="text-sm text-gray-300 mb-6">
        Set or update your 4-digit access code. This code allows quick login to your account.
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="access-code">Your 4-Digit Access Code</Label>
          <div className="flex justify-center mb-4">
            <InputOTP
              maxLength={4}
              value={accessCode}
              onChange={setAccessCode}
            >
              <InputOTPGroup className="gap-4">
                {[0, 1, 2, 3].map((idx) => (
                  <InputOTPSlot
                    key={idx}
                    index={idx}
                    className="w-14 h-14 text-2xl bg-cyber-darkgray/50 border-cyber-purple/30"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          onClick={handleSaveAccessCode}
          className="w-full cyber-button"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Access Code"}
        </Button>
      </div>
    </div>
  );
}
