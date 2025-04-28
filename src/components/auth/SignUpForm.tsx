
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
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/");
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
          "Creating Account..."
        ) : (
          <>
            <Shield className="w-4 h-4" />
            <span>Create Account</span>
          </>
        )}
      </Button>
    </form>
  );
}
