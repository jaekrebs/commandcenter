
import { Shield } from "lucide-react";
import { AccessCodeForm } from "./AccessCodeForm";

export function AuthForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black p-4">
      <div className="cyber-panel max-w-md w-full p-8">
        <div className="mb-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-cyber-purple mb-4" />
          <h1 className="text-3xl font-bold text-cyber-purple mb-2">ACCESS TERMINAL</h1>
          <p className="text-gray-400">Enter your access code to proceed</p>
        </div>
        
        <AccessCodeForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">SECURITY PROTOCOL v2.077</p>
        </div>
      </div>
    </div>
  );
}
