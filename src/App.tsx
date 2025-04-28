
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./pages/Dashboard";
import NPCRelationships from "./pages/NPCRelationships";
import Missions from "./pages/Missions";
import Cyberware from "./pages/Cyberware";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";
import { LoadingState } from "@/components/LoadingState";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Still checking auth state
  if (isAuthenticated === null) {
    return <LoadingState message="Authenticating..." />;
  }
  
  // Not authenticated - redirect to auth page
  if (!isAuthenticated && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }
  
  // Authenticated and trying to access auth page - redirect to dashboard
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-cyber-black">
          <Routes>
            <Route path="/auth" element={<ProtectedRoute><Auth /></ProtectedRoute>} />
            <Route element={
              <>
                <Navigation />
                <ProtectedRoute><main /></ProtectedRoute>
              </>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/npc-relationships" element={<NPCRelationships />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/cyberware" element={<Cyberware />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
