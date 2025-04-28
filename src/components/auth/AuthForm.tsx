
import { useState } from "react";
import { Shield } from "lucide-react";
import { AccessCodeForm } from "./AccessCodeForm";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { MagicLinkForm } from "./MagicLinkForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<string>("access-code");

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black p-4">
      <div className="cyber-panel max-w-md w-full p-8">
        <div className="mb-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-cyber-purple mb-4" />
          <h1 className="text-3xl font-bold text-cyber-purple mb-2">ACCESS TERMINAL</h1>
          <p className="text-gray-400">Choose your authentication method</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="access-code">Access Code</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="access-code">
            <AccessCodeForm />
          </TabsContent>
          
          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
          
          <TabsContent value="magic-link">
            <MagicLinkForm />
          </TabsContent>
        </Tabs>

        {activeTab !== "magic-link" && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setActiveTab("magic-link")} 
              className="text-sm text-cyber-purple hover:underline"
            >
              Use Magic Link Instead
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">SECURITY PROTOCOL v2.077</p>
        </div>
      </div>
    </div>
  );
}
