import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, LogOut, Eye, EyeOff, Video, Play, ArrowLeft, FileText } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VideoUpload {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  isActive: boolean;
}

interface ResumeUpload {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize: number;
  isActive?: boolean;
  description?: string;
}

function EmployerDashboard({ user }: { user: { email: string } }) {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [resumeTitle, setResumeTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoUpload | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch videos from API
  const videosQuery = useQuery({
    queryKey: ['/api/videos'],
    staleTime: 30000, // 30 seconds
  });

  // Fetch resumes from API
  const resumesQuery = useQuery({
    queryKey: ['/api/resumes/employer'],
    staleTime: 30000, // 30 seconds
  });



  // Video upload mutation
  const videoUploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File, title: string }) => {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('uploadedBy', user.email);
      
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Video Upload Successful",
        description: "Your introduction video has been uploaded and is now active!",
      });
      setSelectedVideo(null);
      setVideoTitle('');
      // Refresh videos list
      videosQuery.refetch();
    },
    onError: () => {
      toast({
        title: "Video Upload Failed", 
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    },
  });


  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (MP4, MOV, AVI, etc.)
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a MP4, MOV, or AVI video file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a video file smaller than 100MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedVideo(file);
    }
  };

  const handleVideoUpload = () => {
    if (selectedVideo && videoTitle.trim()) {
      videoUploadMutation.mutate({ file: selectedVideo, title: videoTitle.trim() });
    }
  };

  const handlePdfSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a PDF file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedPdf(file);
    }
  };

  // PDF upload mutation - Exactly matching video upload pattern
  const pdfUploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File, title: string }) => {
      console.log('Starting PDF upload:', { fileName: file.name, fileSize: file.size, title });
      
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('title', title);
      formData.append('userId', 'employer');
      formData.append('description', `Uploaded via employer dashboard`);
      
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('PDF upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('PDF upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('PDF upload successful:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('PDF upload mutation success:', data);
      toast({
        title: "PDF Upload Successful",
        description: `Your resume "${data.resume?.fileName || 'PDF'}" has been uploaded and set as active!`,
      });
      setSelectedPdf(null);
      setResumeTitle('');
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ['/api/resumes/employer'] });
      resumesQuery.refetch();
    },
    onError: (error: any) => {
      console.error('PDF upload mutation error:', error);
      toast({
        title: "PDF Upload Failed", 
        description: error.message || "Failed to upload PDF. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePdfUpload = () => {
    if (selectedPdf && resumeTitle.trim()) {
      pdfUploadMutation.mutate({ file: selectedPdf, title: resumeTitle.trim() });
    }
  };

  const setActiveVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return apiRequest(`/api/videos/${videoId}/activate`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: "Active Video Updated",
        description: "The selected video is now active on the website.",
      });
      videosQuery.refetch();
    },
    onError: () => {
      toast({
        title: "Failed to Activate Video",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return apiRequest(`/api/videos/${videoId}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Video Deleted",
        description: "The video has been removed successfully.",
      });
      videosQuery.refetch();
    },
    onError: () => {
      toast({
        title: "Failed to Delete Video",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete resume mutation
  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return apiRequest(`/api/resumes/${resumeId}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Resume Deleted",
        description: "The resume has been removed successfully.",
      });
      resumesQuery.refetch();
    },
    onError: () => {
      toast({
        title: "Failed to Delete Resume",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set active resume mutation
  const setActiveResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return apiRequest(`/api/resumes/${resumeId}/activate`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: "Active Resume Updated",
        description: "The selected resume is now active for printing.",
      });
      resumesQuery.refetch();
    },
    onError: () => {
      toast({
        title: "Failed to Activate Resume",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleViewVideo = (video: VideoUpload) => {
    setPreviewVideo(video);
    setShowPreviewDialog(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="text-gray-600 hover:text-gray-900 font-medium"
            data-testid="button-back"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              localStorage.removeItem('employerAuth');
              window.location.href = '/';
            }}
            data-testid="button-logout"
            className="text-gray-600 hover:text-gray-900 font-medium"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            Sign Out
          </Button>
        </div>
        
        {/* Hero Header Section with Glass Effect */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white/30 p-10 shadow-2xl hover:shadow-3xl transition-all duration-500"
               style={{
                 backdropFilter: 'blur(20px)',
                 WebkitBackdropFilter: 'blur(20px)',
                 boxShadow: '0 20px 80px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
               }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              paddingBottom: '0.1em'
            }}>
              Media Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
            }}>
              Upload and manage videos and resume PDFs for Tyler Bustard's portfolio with professional-grade tools
            </p>
          </div>
        </div>

        {/* Main Content Grid - Videos Left, PDFs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN - Video Section */}
          <div className="space-y-8">
            {/* Video Upload Section */}
            <Card className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-[2rem] overflow-hidden min-h-[420px] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
              <CardContent className="p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg">
                    <Video className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900" style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      letterSpacing: '-0.025em'
                    }}>
                      Upload New Video
                    </h2>
                    <p className="text-sm text-gray-500" style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                    }}>
                      Upload introduction videos (max: 100MB)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="video-file" className="text-sm font-medium text-gray-700">Video File</Label>
                    <div className="relative">
                      <Input
                        id="video-file"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoSelect}
                        disabled={videoUploadMutation.isPending}
                        className="cursor-pointer border-gray-200 rounded-2xl h-14 text-sm bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-blue-100 file:text-blue-700 hover:file:from-blue-100 hover:file:to-blue-200 file:shadow-md hover:file:shadow-lg file:transition-all file:duration-200"
                        data-testid="input-video-file"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                      />
                    </div>
                    {selectedVideo && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Video className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-blue-700 font-medium">
                          {selectedVideo.name} ({(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="video-title" className="text-sm font-medium text-gray-700">Video Title</Label>
                    <Input
                      id="video-title"
                      placeholder="Enter a descriptive title..."
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      disabled={videoUploadMutation.isPending}
                      className="border-gray-200 rounded-2xl h-14 bg-white/60 backdrop-blur-sm hover:bg-white/80 focus:bg-white/90 transition-all duration-200 text-base px-4"
                      data-testid="input-video-title"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                    />
                  </div>

                  <Button 
                    onClick={handleVideoUpload}
                    disabled={!selectedVideo || !videoTitle.trim() || videoUploadMutation.isPending}
                    data-testid="button-upload-video"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    {videoUploadMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Videos */}
            <Card className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-[2rem] overflow-hidden min-h-[500px] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
              <CardContent className="p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900" style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        letterSpacing: '-0.025em'
                      }}>
                        Uploaded Videos
                      </h2>
                      <p className="text-sm text-gray-500" style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                      }}>
                        {videosQuery.data && Array.isArray(videosQuery.data) && videosQuery.data.length === 1 
                          ? '1 video uploaded' 
                          : `${(videosQuery.data && Array.isArray(videosQuery.data) ? videosQuery.data.length : 0)} videos uploaded`
                        }
                      </p>
                    </div>
                  </div>
                </div>
            <div>
              {videosQuery.isLoading ? (
                <div className="space-y-3">
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              ) : videosQuery.data && Array.isArray(videosQuery.data) && videosQuery.data.length > 0 ? (
                <div className="space-y-4">
                  {videosQuery.data.map((video: VideoUpload) => (
                    <div key={video.id} className="flex items-center justify-between p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/90 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                          <Video className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            {video.fileName}
                          </p>
                          <p className="text-sm text-gray-500" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            Video
                          </p>
                          <p className="text-xs text-gray-400 mt-1" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            100 MB • {new Date(video.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {video.isActive ? (
                          <span className="px-4 py-2 text-sm bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full font-semibold shadow-md" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            Active
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveVideoMutation.mutate(video.id)}
                            disabled={setActiveVideoMutation.isPending}
                            className="text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                          >
                            Set Active
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewVideo(video)}
                          className="text-gray-400 hover:text-gray-600"
                          data-testid={`button-view-${video.id}`}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this video?')) {
                              deleteVideoMutation.mutate(video.id);
                            }
                          }}
                          disabled={deleteVideoMutation.isPending}
                          className="text-red-500 hover:text-red-600"
                          data-testid={`button-delete-${video.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No videos uploaded</h3>
                  <p className="text-gray-500 text-sm">Upload your first video to get started</p>
                </div>
              )}
            </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - PDF Section */}
          <div className="space-y-8">
            {/* PDF Upload Section */}
            <Card className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-[2rem] overflow-hidden min-h-[420px] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
              <CardContent className="p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg">
                    <FileText className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900" style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      letterSpacing: '-0.025em'
                    }}>
                      Upload Resume PDF
                    </h2>
                    <p className="text-sm text-gray-500" style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                    }}>
                      Upload resume PDFs for printing (max: 10MB)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="pdf-file" className="text-sm font-medium text-gray-700">Resume PDF File</Label>
                    <div className="relative">
                      <Input
                        id="pdf-file"
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfSelect}
                        disabled={pdfUploadMutation.isPending}
                        className="cursor-pointer border-gray-200 rounded-2xl h-14 text-sm bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-50 file:to-green-100 file:text-green-700 hover:file:from-green-100 hover:file:to-green-200 file:shadow-md hover:file:shadow-lg file:transition-all file:duration-200"
                        data-testid="input-pdf-file"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                      />
                    </div>
                    {selectedPdf && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-700 font-medium">
                          {selectedPdf.name} ({(selectedPdf.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="resume-title" className="text-sm font-medium text-gray-700">Resume Title</Label>
                    <Input
                      id="resume-title"
                      placeholder="Enter a descriptive title..."
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      disabled={pdfUploadMutation.isPending}
                      className="border-gray-200 rounded-2xl h-14 bg-white/60 backdrop-blur-sm hover:bg-white/80 focus:bg-white/90 transition-all duration-200 text-base px-4"
                      data-testid="input-resume-title"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                    />
                  </div>

                  <Button 
                    onClick={handlePdfUpload}
                    disabled={!selectedPdf || !resumeTitle.trim() || pdfUploadMutation.isPending}
                    data-testid="button-upload-pdf"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    {pdfUploadMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Resume PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Resumes */}
            <Card className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-[2rem] overflow-hidden min-h-[500px] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
              <CardContent className="p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-xl">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900" style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        letterSpacing: '-0.025em'
                      }}>
                        Uploaded Resumes
                      </h2>
                      <p className="text-sm text-gray-500" style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                      }}>
                        {resumesQuery.data && Array.isArray(resumesQuery.data) && resumesQuery.data.length === 1 
                          ? '1 resume uploaded' 
                          : `${(resumesQuery.data && Array.isArray(resumesQuery.data) ? resumesQuery.data.length : 0)} resumes uploaded`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  {resumesQuery.isLoading ? (
                    <div className="space-y-3">
                      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                  ) : resumesQuery.data && Array.isArray(resumesQuery.data) && resumesQuery.data.length > 0 ? (
                    <div className="space-y-4">
                      {resumesQuery.data.map((resume: ResumeUpload) => (
                        <div key={resume.id} className="flex items-center justify-between p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/90 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                              <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900" style={{ 
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                              }}>
                                {resume.fileName}
                              </p>
                              <p className="text-sm text-gray-500" style={{ 
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                              }}>
                                Resume PDF
                              </p>
                              <p className="text-xs text-gray-400 mt-1" style={{ 
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                              }}>
                                {(resume.fileSize / (1024 * 1024)).toFixed(2)} MB • {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {resume.isActive ? (
                              <span className="px-4 py-2 text-sm bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full font-semibold shadow-md" style={{ 
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                              }}>
                                Active
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveResumeMutation.mutate(resume.id)}
                                disabled={setActiveResumeMutation.isPending}
                                className="text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-105"
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                              >
                                Set Active
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                window.open(resume.fileUrl, '_blank');
                              }}
                              className="text-gray-400 hover:text-gray-600"
                              data-testid={`button-view-${resume.id}`}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this resume?')) {
                                  deleteResumeMutation.mutate(resume.id);
                                }
                              }}
                              disabled={deleteResumeMutation.isPending}
                              className="text-red-500 hover:text-red-600"
                              data-testid={`button-delete-${resume.id}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-4 bg-green-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded</h3>
                      <p className="text-gray-500 text-sm">Upload your first resume to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewVideo?.fileName}</DialogTitle>
          </DialogHeader>
          {previewVideo && (
            <div className="w-full">
              <video
                controls
                className="w-full rounded-lg"
                src={previewVideo.fileUrl}
              >
                Your browser does not support the video tag.
              </video>
              <div className="mt-4 text-sm text-gray-500">
                <p>Uploaded: {new Date(previewVideo.uploadedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
                {previewVideo.isActive && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                    Currently Active
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmployerLogin({ onLogin }: { onLogin: (user: { email: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check credentials
    if (email === 'tylerbustard' && password === 'Mvn7c7bb!!') {
      localStorage.setItem('employerAuth', JSON.stringify({ email }));
      onLogin({ email });
      toast({
        title: "Login Successful",
        description: "Welcome to the employer dashboard!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f7' }}>
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }}
        className="fixed top-6 left-6 text-gray-600 hover:text-gray-900 font-medium z-10"
        data-testid="button-back"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-gray-900" style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-0.025em'
          }}>
            Media Upload Access
          </CardTitle>
          <CardDescription className="text-gray-600" style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
          }}>
            Sign in to upload and manage videos and resume PDFs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Username</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username"
                required
                data-testid="input-email"
                className="bg-white border-gray-200 focus:border-blue-500"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  data-testid="input-password"
                  className="bg-white border-gray-200 focus:border-blue-500 pr-10"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-2.5 transition-all duration-200 hover:scale-105"
              disabled={isLoading}
              data-testid="button-login"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EmployerPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on component mount
    const authData = localStorage.getItem('employerAuth');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('employerAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: { email: string }) => {
    setUser(userData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f7' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-50 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <EmployerDashboard user={user} /> : <EmployerLogin onLogin={handleLogin} />;
}