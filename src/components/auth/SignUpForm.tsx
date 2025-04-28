
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Sign up the user first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Wait briefly for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the latest session to ensure we're authenticated when making DB calls
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error("Authentication session not established");
      }

      // 2. Create the user role as super_admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { 
            user_id: authData.user.id,
            role: 'super_admin'
          }
        ]);

      if (roleError) {
        console.error("Error setting user role:", roleError);
        throw new Error("Failed to set user role");
      }
      
      // 3. Store the access code
      const { error: accessCodeError } = await supabase
        .from('access_codes')
        .insert([
          {
            user_id: authData.user.id,
            code: accessCode
          }
        ]);

      if (accessCodeError) {
        console.error("Error storing access code:", accessCodeError);
        throw new Error("Failed to store access code");
      }

      toast({
        title: "Account created",
        description: "Your super admin account has been created successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
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
    <form onSubmit={handleSignUp} className="space-y-4">
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
      
      <div>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-cyber-darkgray/50 border-cyber-purple/30"
          required
        />
      </div>

      <div>
        <Input
          type="text"
          placeholder="Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="bg-cyber-darkgray/50 border-cyber-purple/30"
          required
        />
      </div>
      
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          "Creating Super Admin Account..."
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            <span>Create Super Admin Account</span>
          </>
        )}
      </Button>
    </form>
  );
}
