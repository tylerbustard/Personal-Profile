import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/home";
import Resume from "@/pages/resume";
import ResumeUploadSignIn from "@/pages/resume-upload-signin";
import UploadResumeDashboard from "@/pages/upload-resume-dashboard";
import ResumeVariation1 from "@/pages/resume-variation-1";
import ResumeVariation2 from "@/pages/resume-variation-2";
import ResumeVariation3 from "@/pages/resume-variation-3";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useGlobalAnimations } from "@/hooks/useGlobalAnimations";

// Create a wrapper component that handles subdirectory routing
function SubdirectoryRouter() {
  const [location] = useLocation();
  
  // Extract the subdirectory from the path
  const pathParts = location.split('/').filter(Boolean);
  const subdirectory = pathParts[0] === 'universityoftoronto' || pathParts[0] === 'queensuniversity' || pathParts[0] === 'profile' ? pathParts[0] : null;
  const remainingPath = subdirectory ? '/' + pathParts.slice(1).join('/') : location;
  
  // If we're at a subdirectory root, redirect to home
  if (subdirectory && remainingPath === '/') {
    return <Home variation={subdirectory} />;
  }

  return (
    <Switch>
      {/* Root paths */}
      <Route path="/" component={() => <Home />} />
      <Route path="/resume" component={() => <Resume />} />
      <Route path="/upload" component={() => <UploadResumeDashboard />} />
      <Route path="/sign-in" component={() => <ResumeUploadSignIn />} />
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
      
      {/* University of Toronto subdirectory */}
      <Route path="/universityoftoronto" component={() => <Home variation="universityoftoronto" />} />
      <Route path="/universityoftoronto/resume" component={() => <Resume variation="universityoftoronto" />} />
      <Route path="/universityoftoronto/upload" component={() => <UploadResumeDashboard variation="universityoftoronto" />} />
      <Route path="/universityoftoronto/sign-in" component={() => <ResumeUploadSignIn variation="universityoftoronto" />} />
      <Route path="/universityoftoronto/resume-tech">
        <ProtectedRoute>
          <ResumeVariation1 variation="universityoftoronto" />
        </ProtectedRoute>
      </Route>
      <Route path="/universityoftoronto/resume-finance">
        <ProtectedRoute>
          <ResumeVariation2 variation="universityoftoronto" />
        </ProtectedRoute>
      </Route>
      <Route path="/universityoftoronto/resume-leadership">
        <ProtectedRoute>
          <ResumeVariation3 variation="universityoftoronto" />
        </ProtectedRoute>
      </Route>
      
      {/* Queen's University subdirectory */}
      <Route path="/queensuniversity" component={() => <Home variation="queensuniversity" />} />
      <Route path="/queensuniversity/resume" component={() => <Resume variation="queensuniversity" />} />
      <Route path="/queensuniversity/upload" component={() => <UploadResumeDashboard variation="queensuniversity" />} />
      <Route path="/queensuniversity/sign-in" component={() => <ResumeUploadSignIn variation="queensuniversity" />} />
      <Route path="/queensuniversity/resume-tech">
        <ProtectedRoute>
          <ResumeVariation1 variation="queensuniversity" />
        </ProtectedRoute>
      </Route>
      <Route path="/queensuniversity/resume-finance">
        <ProtectedRoute>
          <ResumeVariation2 variation="queensuniversity" />
        </ProtectedRoute>
      </Route>
      <Route path="/queensuniversity/resume-leadership">
        <ProtectedRoute>
          <ResumeVariation3 variation="queensuniversity" />
        </ProtectedRoute>
      </Route>
      
      {/* Profile subdirectory */}
      <Route path="/profile" component={() => <Home variation="profile" />} />
      <Route path="/profile/resume" component={() => <Resume variation="profile" />} />
      <Route path="/profile/upload" component={() => <UploadResumeDashboard variation="profile" />} />
      <Route path="/profile/sign-in" component={() => <ResumeUploadSignIn variation="profile" />} />
      <Route path="/profile/resume-tech">
        <ProtectedRoute>
          <ResumeVariation1 variation="profile" />
        </ProtectedRoute>
      </Route>
      <Route path="/profile/resume-finance">
        <ProtectedRoute>
          <ResumeVariation2 variation="profile" />
        </ProtectedRoute>
      </Route>
      <Route path="/profile/resume-leadership">
        <ProtectedRoute>
          <ResumeVariation3 variation="profile" />
        </ProtectedRoute>
      </Route>
      
      <Route>404: Page not found</Route>
    </Switch>
  );
}

function Router() {
  return <SubdirectoryRouter />;
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
