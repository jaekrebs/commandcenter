
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Sign up the user using supabase.auth.signUp
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Check if email confirmation is required
      if (authData.session === null) {
        // Email confirmation is required - save the user ID for later use
        // and show a message to the user
        setConfirmationSent(true);
        localStorage.setItem('pendingSignupData', JSON.stringify({
          userId: authData.user.id,
          email,
          username,
          accessCode
        }));
        
        toast({
          title: "Confirmation email sent",
          description: "Please check your email and confirm your account before logging in.",
        });
        return;
      }

      // If we have a session, it means email confirmation is disabled
      // Sign in the user to ensure we have a valid session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error("Sign in error after signup:", signInError);
        throw signInError;
      }
      
      if (!signInData.session) {
        throw new Error("Failed to establish session after signup");
      }
      
      console.log("Authenticated session established:", signInData.session);
      
      // Now proceed with setting up the user role and access code
      await setupUserAccount(authData.user.id);
      
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

  // Function to complete account setup after confirmation
  const setupUserAccount = async (userId: string) => {
    try {
      console.log("Setting up user account for:", userId);
      
      // Get current session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found. Please sign in first.");
      }
      
      console.log("Active session confirmed for role setup");
      
      // Check if the role already exists to avoid duplicate key error
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (roleCheckError && roleCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
        console.error("Error checking existing role:", roleCheckError);
      }
      
      if (existingRole) {
        console.log("User role already exists, skipping creation");
      } else {
        // Create the user role as super_admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            { 
              user_id: userId,
              role: 'super_admin'
            }
          ]);

        if (roleError) {
          console.error("Error setting user role:", roleError);
          throw new Error("Failed to set user role");
        }
        
        console.log("User role set successfully");
      }
      
      // Check if access code already exists
      const { data: existingCode, error: codeCheckError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (codeCheckError && codeCheckError.code !== 'PGRST116') {
        console.error("Error checking existing access code:", codeCheckError);
      }
      
      if (existingCode) {
        console.log("Access code already exists, skipping creation");
      } else {
        // Store the access code
        const { error: accessCodeError } = await supabase
          .from('access_codes')
          .insert([
            {
              user_id: userId,
              code: accessCode
            }
          ]);

        if (accessCodeError) {
          console.error("Error storing access code:", accessCodeError);
          throw new Error("Failed to store access code");
        }
        
        console.log("Access code stored successfully");
      }

      toast({
        title: "Account created",
        description: "Your super admin account has been created successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Account setup error:", error);
      toast({
        title: "Setup error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (confirmationSent) {
    return (
      <div className="text-center space-y-4">
        <Mail className="mx-auto h-12 w-12 text-cyber-purple mb-4" />
        <h3 className="text-xl font-bold text-cyber-purple">Check your email</h3>
        <Alert>
          <AlertDescription>
            A confirmation link has been sent to <strong>{email}</strong>. 
            Please check your inbox and confirm your email address to complete your registration.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-gray-400 mt-4">
          After confirming your email, you'll need to sign in to access your account.
        </p>
      </div>
    );
  }

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
      
      <p className="text-xs text-gray-400 text-center mt-2">
        You'll need to verify your email before logging in
      </p>
    </form>
  );
}
