
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { MagicLinkForm } from "./MagicLinkForm";

export function AuthForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black p-4">
      <div className="cyber-panel max-w-md w-full p-8">
        <div className="mb-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-cyber-purple mb-4" />
          <h1 className="text-3xl font-bold text-cyber-purple mb-2">ACCESS TERMINAL</h1>
          <p className="text-gray-400">Enter your credentials to proceed</p>
        </div>
        
        <Tabs defaultValue="signin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
          
          <TabsContent value="magic">
            <MagicLinkForm />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">SECURITY PROTOCOL v2.077</p>
        </div>
      </div>
    </div>
  );
}
