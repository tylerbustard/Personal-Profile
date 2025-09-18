import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Download, Printer, Linkedin, ChevronUp, Briefcase, GraduationCap, Award, Heart, Target } from "lucide-react";
import Navigation from "@/components/navigation";

// Import logos from assets
import profileImage from "@assets/Untitled design (1)_1755896187722.png";
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import etsLogo from "@assets/ETS_1755939510188.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import mcgillLogo from "@assets/mcgill_1755937693386.png";
import fiscalAiLogo from "@assets/fiscal_ai_logo_new.png";

interface ResumeProps {
  variation?: 'universityoftoronto' | 'queensuniversity' | 'profile' | null;
}

export default function Resume({ variation = null }: ResumeProps = {}) {
  const [location] = useLocation();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Fetch resumes to check if any exist
  const resumesQuery = useQuery({
    queryKey: ['/api/resumes/employer'],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastKnownScrollY = 0;
    
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        if (Math.abs(scrollY - lastKnownScrollY) > 50) {
          setShowScrollToTop(scrollY > 300);
          lastKnownScrollY = scrollY;
        }
      }, 100);
    };

    setShowScrollToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
      <Navigation variation={variation} />

      {/* Print PDF Button - Only show if PDFs exist */}
      {resumesQuery.data && Array.isArray(resumesQuery.data) && resumesQuery.data.length > 0 ? (
        <div className="pt-24 pb-6">
          <div className="flex justify-center">
            <Button
                onClick={async () => {
                  try {
                    // Check if we're on mobile device
                    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    
                    if (isMobile) {
                      // For mobile devices, open PDF directly in new window/tab
                      // This bypasses mobile download restrictions
                      window.open('/api/resumes/latest/employer', '_blank');
                    } else {
                      // For desktop, use the blob download approach with custom filename
                      // First get the resume metadata to get the custom filename
                      const metadataResponse = await fetch('/api/resumes/employer');
                      const resumes = await metadataResponse.json();
                      
                      let customFilename = 'Tyler_Bustard_Resume.pdf'; // fallback
                      
                      if (resumes && resumes.length > 0) {
                        // Find the active resume or the most recent one
                        const activeResume = resumes.find((r: any) => r.isActive) || resumes[0];
                        if (activeResume && activeResume.fileName) {
                          customFilename = activeResume.fileName.endsWith('.pdf') 
                            ? activeResume.fileName 
                            : `${activeResume.fileName}.pdf`;
                        }
                      }
                      
                      // Now download the PDF with the custom filename
                      const response = await fetch('/api/resumes/latest/employer');
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = customFilename; // Use custom filename for download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } else {
                        // Handle error - no PDF found
                        alert('No resume PDF found. Please upload one via the upload dashboard.');
                      }
                    }
                  } catch (error) {
                    console.error('Error loading PDF:', error);
                    alert('Error loading resume PDF. Please try again.');
                  }
                }}
                className="px-6 py-3 text-sm font-medium rounded-xl  flex items-center gap-2 text-white bg-blue-600   shadow-lg"
                data-testid="button-download-pdf"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                <Printer size={16} />
                Download PDF
              </Button>
          </div>
        </div>
      ) : null}

      {/* Main Resume Content */}
      <div className={`px-6 sm:px-8 lg:px-10 pb-12 ${resumesQuery.data && Array.isArray(resumesQuery.data) && resumesQuery.data.length > 0 ? '' : 'pt-24'}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Resume Container - Exact dimensions: 21.59cm x 55.88cm */}
          <div className="resume-page bg-white rounded-2xl shadow-lg mb-6 print:shadow-none print:border-0 print:rounded-none"
               style={{ 
                 width: '21.59cm',
                 height: '55.88cm',
                 padding: '1.5cm 1.27cm 2.54cm 1.27cm', // Top: 1.5cm (reduced), Left/Right: 1.27cm, Bottom: 2.54cm
                 margin: '0 auto',
                 boxSizing: 'border-box',
                 overflow: 'hidden',
                 border: '1px solid rgba(0,0,0,0.08)'
               }}>
            
            {/* Header Section - Compact Layout (no container box) */}
            <div className="mb-6">
              {/* Row 1: Photo + Name/Role + Download */}
              <div className="flex items-center gap-4">
                <img 
                  src={profileImage} 
                  alt="Tyler Bustard" 
                  className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                  data-testid="img-resume-profile"
                  style={{ border: '2px solid white' }}
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight" style={{ letterSpacing: '-0.01em' }}>Tyler Bustard</h1>
                  <h2 className="text-xl text-blue-600 font-semibold leading-tight">Finance & Technology Professional</h2>
                </div>
              </div>

              {/* Row 2: Contact chips */}
              <div id="contact" className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"><Mail className="w-3 h-3 text-blue-500" /> tbustard@unb.ca</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"><Phone className="w-3 h-3 text-blue-500" /> +1 (613) 985-1223</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"><Globe className="w-3 h-3 text-blue-500" /> tylerbustard.ca</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"><MapPin className="w-3 h-3 text-blue-500" /> Toronto, Ontario</span>
              </div>

              {/* Row 3: One-line summary */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed max-w-4xl">
                  Driving innovation at the intersection of finance and technology while delivering exceptional results through analytical expertise, strategic thinking, and client-focused solutions.
                </p>
              </div>
            </div>

            {/* Education Section */}
            <section id="education" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Education</h3>
              
              <div className="space-y-4">
                {/* McGill University - Profile Variation Only */}
                {variation === 'profile' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                    <div className="flex gap-3 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-red-200">
                          <img src={mcgillLogo} alt="McGill" className="w-7 h-7 object-contain" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">Master of Management in Finance Candidate</h4>
                            <p className="text-sm text-gray-900 font-semibold">Desautels Faculty of Management</p>
                            <p className="text-sm text-blue-600 font-semibold">McGill University</p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2025-2026</span>
                        </div>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-2 pl-16">
                      <li className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Head of Risk Management - Desautels Capital Management Fund</span>
                      </li>
                      <li className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Chief Sustainability Officer - DCM Socially Responsible Investing Fund</span>
                      </li>
                      <li className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Recipient of 2 Scholarships for academic merit and leadership skills, Total $13,000</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* University of New Brunswick */}
                <div id="experience-fiscal-ai-equity-analyst" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                        <img src={unbLogo} alt="UNB" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Bachelor of Business Administration</h4>
                          <p className="text-sm text-gray-900 font-semibold">Major in Finance</p>
                          <p className="text-sm text-blue-600 font-semibold">University of New Brunswick</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2016-2020</span>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 pl-16">
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Analyst and Portfolio Manager - University of New Brunswick Student Investment Fund</span>
                    </li>
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Member of UNB Finance Club, Royal Bank of Canada Student Ambassador, Accredited Co-op Program</span>
                    </li>
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Recipient of 5 Scholarship for academic merit and leadership skills, Total $47,500</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Professional Experience Section */}
            <section id="experience" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Professional Experience</h3>
              
              <div className="space-y-4">
                {/* Current Role - Fiscal.ai */}
                <div id="experience-bmo-private-wealth-portfolio-assistant" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <img src={fiscalAiLogo} alt="Fiscal.ai" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Equity Analyst</h4>
                          <p className="text-sm text-blue-600 font-semibold">Fiscal.ai</p>
                          <p className="text-sm text-gray-600">Toronto, ON</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2023-Present</span>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 pl-16">
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Analyze and compile public company financial statements, cutting reporting turnaround by 13%</span>
                    </li>
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Collaborate with product and engineering to implement AI-driven data features, boosting adoption by 12%</span>
                    </li>
                  </ul>
                  <div className="mt-2 pl-16 flex flex-wrap gap-2">
                    {['Financial Analysis', 'AI Integration', 'Data Analytics', 'Python', 'SQL'].map((skill) => (
                      <span key={skill} className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BMO Private Wealth */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                        <img src={bmoLogo} alt="BMO" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Portfolio Assistant</h4>
                          <p className="text-sm text-blue-600 font-semibold">BMO Private Wealth</p>
                          <p className="text-sm text-gray-600">Toronto, ON</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2022-2023</span>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 pl-16">
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Advised Investment Counsellors managing $100M+ AUM, reducing preparation time by 12%</span>
                    </li>
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Bolstered client communications, boosting response rates by 9%, heightening client satisfaction and retention</span>
                    </li>
                  </ul>
                  <div className="mt-2 pl-16 flex flex-wrap gap-2">
                    {['Portfolio Management', 'Client Relations', 'Financial Analysis', 'Excel'].map((skill) => (
                      <span key={skill} className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Early Career Experience */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Early Career Experience</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* TD Canada Trust */}
                    <div id="experience-td-canada-trust-financial-advisor" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                      <div className="flex gap-3 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-green-200">
                            <img src={tdLogo} alt="TD" className="w-7 h-7 object-contain" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-bold text-gray-900">Financial Advisor</h5>
                              <p className="text-sm text-blue-600 font-semibold">TD Canada Trust</p>
                              <p className="text-sm text-gray-600">Kingston, ON</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2021-2022</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RBC Banking Advisor */}
                    <div id="experience-royal-bank-of-canada-banking-advisor" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                      <div className="flex gap-3 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                            <img src={rbcLogo} alt="Royal Bank of Canada" className="w-7 h-7 object-contain" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-bold text-gray-900">Banking Advisor</h5>
                              <p className="text-sm text-blue-600 font-semibold">Royal Bank of Canada</p>
                              <p className="text-sm text-gray-600">Kingston, ON</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2020-2021</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Co-op Experience */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Co-op Experience</h4>
                  <div className="space-y-3">
                    {/* RBC Client Advisor Intern */}
                    <div id="experience-royal-bank-of-canada-client-advisor-intern" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                      <div className="flex gap-3 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                            <img src={rbcLogo} alt="Royal Bank of Canada" className="w-7 h-7 object-contain" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-bold text-gray-900">Client Advisor Intern</h5>
                              <p className="text-sm text-blue-600 font-semibold">Royal Bank of Canada</p>
                              <p className="text-sm text-gray-600">Fredericton, NB</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2019-2020</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Irving Oil and Grant Thornton - Side by Side */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Irving Oil Marketing Intern */}
                      <div id="experience-irving-oil-limited-marketing-intern" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                        <div className="flex gap-3 items-center">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-red-200">
                              <img src={irvingLogo} alt="Irving Oil" className="w-7 h-7 object-contain" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-sm font-bold text-gray-900">Marketing Intern</h5>
                                <p className="text-sm text-blue-600 font-semibold">Irving Oil Limited</p>
                                <p className="text-sm text-gray-600">Saint John, NB</p>
                              </div>
                              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2018</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Grant Thornton Tax Return Intern */}
                      <div id="experience-grant-thornton-llp-tax-return-intern" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                        <div className="flex gap-3 items-center">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-purple-200">
                              <img src={grantThorntonLogo} alt="Grant Thornton" className="w-7 h-7 object-contain" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-sm font-bold text-gray-900">Tax Return Intern</h5>
                                <p className="text-sm text-blue-600 font-semibold">Grant Thornton LLP</p>
                                <p className="text-sm text-gray-600">Saint John, NB</p>
                              </div>
                              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2018</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Professional Certifications */}
            <section id="certifications" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Professional Certifications</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* CFA */}
                <div id="cert-cfa-level-i-candidate" className="bg-white rounded-xl border border-gray-200 p-3">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <img src={cfaLogo} alt="CFA" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">CFA Level I Candidate</h5>
                          <p className="text-sm text-blue-600 font-semibold">CFA Institute</p>
                          <p className="text-sm text-gray-600">Investment Analysis & Ethics</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2025</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRE Exam */}
                <div id="cert-gre-exam" className="bg-white rounded-xl border border-gray-200 p-3">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <img src={etsLogo} alt="ETS" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">GRE Exam</h5>
                          <p className="text-sm text-blue-600 font-semibold">Educational Testing Service</p>
                          <p className="text-sm text-gray-600">Score: 325 (Q: 165, V: 160)</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2024</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Certification Counts - Grid */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div id="certifications-finance" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm ">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <img src={csiLogo} alt="CSI" className="w-4 h-4 object-contain" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <img src={trainingTheStreetLogo} alt="Training The Street" className="w-4 h-4 object-contain" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <img src={bloombergLogo} alt="Bloomberg" className="w-4 h-4 object-contain" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <img src={mcgillLogo} alt="McGill University" className="w-4 h-4 object-contain" />
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">10</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Finance Certifications</p>
                </div>
                <div id="certifications-technology" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm ">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <img src={courseraLogo} alt="Coursera" className="w-4 h-4 object-contain" />
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">6</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Technology Certifications</p>
                </div>
                <div id="certifications-analytics" className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm ">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <img src={courseraLogo} alt="Coursera" className="w-4 h-4 object-contain" />
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">5</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Analytics Certifications</p>
                </div>
              </div>
            </section>

            {/* Community Leadership */}
            <section id="community" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Community Leadership</h3>
              
              <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm ">
                <div className="flex gap-3 items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-red-200">
                      <img src={unitedWayLogo} alt="United Way" className="w-7 h-7 object-contain" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Next Gen Ambassador</h4>
                        <p className="text-sm text-blue-600 font-semibold">United Way</p>
                        <p className="text-sm text-gray-600">Toronto, ON</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2020-Present</span>
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Additional Community - Two Cards */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm ">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                        <img src={rbcLogo} alt="Royal Bank of Canada" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Student Ambassador</h5>
                          <p className="text-sm text-blue-600 font-semibold">Royal Bank of Canada</p>
                          <p className="text-sm text-gray-600">Fredericton, NB</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2019-2020</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm ">
                  <div className="flex gap-3 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-red-200">
                        <img src={irvingLogo} alt="Irving" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Volunteer Staff</h5>
                          <p className="text-sm text-blue-600 font-semibold">Irving Oil Limited</p>
                          <p className="text-sm text-gray-600">Saint John, NB</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 shadow-sm">2018</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>


      {/* Print Styles - Optimized for 8.5" x 22" */}
      <style>{`
        @media print {
          @page {
            size: 21.59cm 55.88cm;
            margin: 1.27cm;
          }
          
          body, html {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Hide navigation and non-essential elements */
          nav, .print\\:hidden, button {
            display: none !important;
          }
          
          /* Reset backgrounds and containers */
          .min-h-screen {
            background: white !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          
          .px-4, .sm\\:px-6, .lg\\:px-8, .pb-16, .pt-24 {
            padding: 0 !important;
          }
          
          .max-w-5xl {
            max-width: 100% !important;
            margin: 0 !important;
          }
          
          /* Resume page specific */
          .resume-page {
            background: white !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0.5in !important;
            margin: 0 !important;
            min-height: auto !important;
            page-break-after: avoid !important;
          }
          
          /* Typography adjustments */
          h1 { font-size: 28pt !important; }
          h2 { font-size: 16pt !important; }
          h3 { font-size: 11pt !important; }
          h4 { font-size: 10pt !important; }
          p, li, span { font-size: 9pt !important; }
          .text-sm { font-size: 10pt !important; }
          .text-base { font-size: 10pt !important; }
          
          /* Ensure colors print */
          .bg-gradient-to-r, .bg-gradient-to-br {
            background: #f3f4f6 !important;
          }
          
          .text-blue-600 { color: #2563eb !important; }
          .text-blue-500 { color: #3b82f6 !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .border-blue-200 { border-color: #bfdbfe !important; }
          
          /* Profile image adjustments */
          img {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          /* Section spacing */
          section {
            margin-bottom: 0.4in !important;
            page-break-inside: avoid !important;
          }
          
          /* Keep elements together */
          .rounded-xl, .rounded-lg {
            page-break-inside: avoid !important;
          }
          
          /* Grid and flex adjustments */
          .grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
          
          /* Remove hover effects */
          .hover\\:shadow-md:hover,
          .hover\\:shadow-xl:hover,
          .hover\\:scale-110:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Clean Scroll to Top Button with Glass Effect */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 rounded-full ${
          showScrollToTop 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        } shadow-xl `}
        style={{ 
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
        data-testid="scroll-to-top-button"
      >
        <div className="flex items-center px-5 py-3">
          <span className="text-sm font-medium mr-3 text-gray-700">
            Back to top
          </span>
          <div className="w-8 h-8 bg-blue-600  text-white rounded-full flex items-center justify-center ">
            <ChevronUp size={18} />
          </div>
        </div>
      </button>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 py-8  print:hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/90 font-medium">
              © {new Date().getFullYear()} Tyler Bustard. All rights reserved.
            </p>
            <button
              onClick={() => {
                const basePath = variation ? `/${variation}` : '';
                localStorage.setItem('previousPage', location);
                window.location.href = `${basePath}/sign-in`;
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10  border border-white/20  text-white  "
              data-testid="footer-employer-signin"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}