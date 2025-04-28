
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
import Admin from "./pages/Admin";
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
        <div className="min-h-screen bg-cyber-black text-white">
          <Routes>
            <Route path="/auth" element={<ProtectedRoute><Auth /></ProtectedRoute>} />
            <Route 
              path="/"
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="/npc-relationships" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><NPCRelationships /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="/missions" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><Missions /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="/cyberware" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><Cyberware /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="/notes" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><Notes /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><Settings /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><Admin /></ProtectedRoute>
                  </div>
                </>
              } 
            />
            <Route 
              path="*" 
              element={
                <>
                  <Navigation />
                  <div className="pt-16">
                    <ProtectedRoute><NotFound /></ProtectedRoute>
                  </div>
                </>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
