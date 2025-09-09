import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, ArrowLeft, LogOut, Printer } from "lucide-react";
import Navigation from "@/components/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResumeUpload } from "@shared/schema";

export default function UploadResumeDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for custom authentication
  useEffect(() => {
    const authData = localStorage.getItem('resumeUploadAuth');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        if (userData.username === 'tylerbustard') {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('resumeUploadAuth');
          window.location.href = '/resume-upload-signin';
        }
      } catch (error) {
        localStorage.removeItem('resumeUploadAuth');
        window.location.href = '/resume-upload-signin';
      }
    } else {
      window.location.href = '/resume-upload-signin';
    }
    setIsLoading(false);
  }, []);

  // Fetch existing uploads (mock data for now)
  const { data: uploads = [], isLoading: uploadsLoading } = useQuery<ResumeUpload[]>({
    queryKey: ["/api/resume-uploads"],
    enabled: isAuthenticated,
    queryFn: async () => {
      // Mock data since we're not using the actual API
      const stored = localStorage.getItem('resumeUploads');
      return stored ? JSON.parse(stored) : [];
    }
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  // Upload mutation (mock implementation)
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) return;
      
      setUploading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock upload record
      const newUpload: ResumeUpload = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileUrl: URL.createObjectURL(selectedFile),
        description: description || null,
        uploadedAt: new Date(),
        userId: 'tylerbustard'
      };
      
      // Store in localStorage
      const stored = localStorage.getItem('resumeUploads');
      const uploads = stored ? JSON.parse(stored) : [];
      uploads.unshift(newUpload);
      localStorage.setItem('resumeUploads', JSON.stringify(uploads));
      
      return newUpload;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
      setSelectedFile(null);
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/resume-uploads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  // Delete mutation (mock implementation)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const stored = localStorage.getItem('resumeUploads');
      const uploads = stored ? JSON.parse(stored) : [];
      const filtered = uploads.filter((u: ResumeUpload) => u.id !== id);
      localStorage.setItem('resumeUploads', JSON.stringify(filtered));
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resume-uploads"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f7" }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/resume'}
            className="text-gray-600 hover:text-gray-900 font-medium"
            data-testid="button-back"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resume
          </Button>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={async () => {
                try {
                  // Fetch the latest resume PDF
                  const response = await fetch('/api/latest-resume');
                  if (response.ok) {
                    // Create a blob from the PDF response
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    
                    // Open in new window for printing
                    const printWindow = window.open(url, '_blank');
                    if (printWindow) {
                      printWindow.addEventListener('load', () => {
                        setTimeout(() => {
                          printWindow.print();
                        }, 500);
                      });
                    }
                    
                    // Clean up the blob URL after a delay
                    setTimeout(() => {
                      window.URL.revokeObjectURL(url);
                    }, 60000);
                  } else if (response.status === 404) {
                    toast({
                      title: "No Resume Found",
                      description: "Please upload a resume first.",
                      variant: "destructive"
                    });
                  } else {
                    toast({
                      title: "Failed to Load Resume",
                      description: "Please try again.",
                      variant: "destructive"
                    });
                  }
                } catch (error) {
                  console.error('Error loading resume:', error);
                  toast({
                    title: "Error",
                    description: "Failed to load resume for printing.",
                    variant: "destructive"
                  });
                }
              }}
              data-testid="button-print-pdf"
              className="text-gray-600 hover:text-gray-900 font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print PDF
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                localStorage.removeItem('resumeUploadAuth');
                window.location.href = '/';
              }}
              data-testid="button-logout"
              className="text-gray-600 hover:text-gray-900 font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-0.025em'
          }}>
            Resume Upload
          </h1>
          <p className="text-gray-600" style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
          }}>
            Upload and manage PDF versions of your resume
          </p>
        </div>

        {/* Upload Form */}
        <Card className="bg-white shadow-sm border border-gray-200 mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-0.025em'
            }}>
              Upload New Resume
            </h2>
            <p className="text-sm text-gray-600 mb-6" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
            }}>
              Select a PDF file to upload (max: 10MB)
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Resume File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="cursor-pointer"
                  data-testid="input-file"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for this version..."
                  disabled={uploading}
                  rows={3}
                  data-testid="input-description"
                />
              </div>

              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!selectedFile || uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                data-testid="button-upload"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Resume
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-0.025em'
            }}>
              Uploaded Resumes
            </h2>
            <p className="text-sm text-gray-600 mb-6" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
            }}>
              {uploads.length === 1 ? '1 file uploaded' : `${uploads.length} files uploaded`}
            </p>
            <div>
              {uploadsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading uploads...</p>
                </div>
              ) : uploads.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No resumes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      data-testid={`upload-item-${upload.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            {upload.fileName}
                          </p>
                          <p className="text-sm text-gray-500" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            Resume
                          </p>
                          <p className="text-xs text-gray-400 mt-1" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            {formatFileSize(upload.fileSize)} • {upload.uploadedAt ? formatDate(upload.uploadedAt) : "Unknown date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => window.open(upload.fileUrl, "_blank")}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600"
                          data-testid={`button-view-${upload.id}`}
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => deleteMutation.mutate(upload.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          data-testid={`button-delete-${upload.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}