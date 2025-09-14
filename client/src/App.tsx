import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import EmployerPage from "@/pages/employer";
import Resume from "@/pages/resume";
import UploadResume from "@/pages/upload-resume";
import ResumeUploadSignIn from "@/pages/resume-upload-signin";
import UploadResumeDashboard from "@/pages/upload-resume-dashboard";
import ResumeVariation1 from "@/pages/resume-variation-1";
import ResumeVariation2 from "@/pages/resume-variation-2";
import ResumeVariation3 from "@/pages/resume-variation-3";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useGlobalAnimations } from "@/hooks/useGlobalAnimations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resume" component={Resume} />
      <Route path="/employer" component={EmployerPage} />
      <Route path="/upload-resume" component={UploadResumeDashboard} />
      <Route path="/resume-upload-signin" component={ResumeUploadSignIn} />
      <Route path="/resume-tech">
        <ProtectedRoute>
          <ResumeVariation1 />
        </ProtectedRoute>
      </Route>
      <Route path="/resume-finance">
        <ProtectedRoute>
          <ResumeVariation2 />
        </ProtectedRoute>
      </Route>
      <Route path="/resume-leadership">
        <ProtectedRoute>
          <ResumeVariation3 />
        </ProtectedRoute>
      </Route>
      <Route>404: Page not found</Route>
    </Switch>
  );
}

function App() {
  // Initialize global animation system
  useGlobalAnimations();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
