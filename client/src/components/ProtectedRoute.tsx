import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f7' }}>
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f7' }}>
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-0.025em'
            }}>
              Authentication Required
            </CardTitle>
            <CardDescription className="text-gray-600" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
            }}>
              Please sign in to access this private resume page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-sign-in"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In with Replit
            </Button>
            <p className="text-xs text-gray-500 text-center">
              This will redirect you to Replit for secure authentication
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}