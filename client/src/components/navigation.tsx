import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown, Menu, X, ArrowLeft, Printer } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/Untitled design (1)_1755896187722.png";

interface NavigationProps {
  variation?: 'universityoftoronto' | 'queensuniversity' | 'profile' | null;
}

export default function Navigation({ variation = null }: NavigationProps = {}) {
  const [location] = useLocation();
  const basePath = variation ? `/${variation}` : '';
  const isHomePage = location === '/' || location === `/${variation}`;
  const isResumePage = location === '/resume' || location === `${basePath}/resume`;
  const isUploadPage = location === '/upload' || location === `${basePath}/upload`;
  const isSignInPage = location === '/sign-in' || location === `${basePath}/sign-in`;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState(isHomePage ? 'hero' : '');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<string | null>(null);

  // Helper functions for dropdown hover behavior with improved stability
  const handleDropdownEnter = (dropdownName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Optimized delay for better UX
    setHoverTimeout(timeout);
  };

  // Enhanced function to handle dropdown content hover
  const handleDropdownContentEnter = (dropdownName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  // Enhanced function to handle dropdown content leave
  const handleDropdownContentLeave = () => {
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Consistent delay
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (openDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setOpenDropdown(null);
        }
      }
    };
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (openDropdown) {
          setOpenDropdown(null);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [openDropdown, hoverTimeout, isMobileMenuOpen]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        // Only update if there's a significant change
        if (Math.abs(currentScrollY - lastScrollY) > 3) {
          setScrollY(currentScrollY);
          setIsScrolled(currentScrollY > 100);
          lastScrollY = currentScrollY;
        }
        rafId = null;
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);


  useEffect(() => {
    if (!isHomePage && !isResumePage && !isUploadPage && !isSignInPage) {
      setCurrentSection('');
      return;
    }

    // Set initial section based on page
    setCurrentSection(isHomePage ? 'hero' : 'academic-highlights');

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -65% 0px',
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]
    };

    let visibleSections = new Map();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let activeSection = isHomePage ? 'hero' : 'academic-highlights';
      
      Array.from(visibleSections.entries()).forEach(([sectionId, ratio]) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeSection = sectionId;
        }
      });

      setCurrentSection(activeSection);
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Add a small delay to ensure sections are rendered before observing
    const setupObserver = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.observe(section));
    };
    
    // Setup immediately and also after a short delay to catch any late-rendered sections
    setupObserver();
    const delayTimer = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(delayTimer);
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.unobserve(section));
      visibleSections.clear();
    };
  }, [isHomePage, isResumePage, isUploadPage, isSignInPage]);

  const scrollToSection = (href: string) => {
    // Close dropdown immediately for better UX
    setOpenDropdown(null);
    
    // If on resume page, scroll to resume sections
    if (isResumePage) {
      const element = document.querySelector(href);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        });
      }
      setIsMobileMenuOpen(false);
      return;
    }
    
    // If not on home page, navigate to home page first
    if (!isHomePage) {
      window.location.href = `${basePath}${href}`;
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Bar with Clean Glass Effect */}
      <nav 
        className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-out will-change-transform"
        style={{
          transform: 'translateZ(0)',
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.88)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: isScrolled 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)' 
            : '0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Left side - Logo/Name */}
            <div className="flex items-center">
              {isHomePage && (
                <button 
                  onClick={() => {
                    // Use a slight delay to prevent conflict with other animations
                    setTimeout(() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }, 50);
                  }}
                  className="flex items-center space-x-4 transition-transform duration-200 hover:scale-105 cursor-pointer"
                >
                  <img 
                    src={profileImage} 
                    alt="Tyler Bustard" 
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 shadow-sm"
                  />
                  <div className="relative">
                    <span className="text-lg tracking-tight apple-heading-nav text-gray-900 dark:text-white">
                      <span className="font-bold">Tyler</span>{' '}
                      <span className="font-normal">Bustard</span>
                    </span>
                  </div>
                </button>
              )}
              {isResumePage && (
                <button 
                  onClick={() => {
                    // Always go to home page, not back in history
                    window.location.href = basePath || '/';
                  }}
                  className="flex items-center space-x-4 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <img 
                    src={profileImage} 
                    alt="Tyler Bustard" 
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 shadow-sm"
                  />
                  <div className="relative">
                    <span className="text-lg tracking-tight apple-heading-nav text-gray-900 dark:text-white">
                      <span className="font-bold">Tyler</span>{' '}
                      <span className="font-normal">Bustard</span>
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Center - Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              
              {/* Resume Page Navigation - With Dropdowns */}
              {isResumePage && (
                <>
                  {/* Education */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('education')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#education')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'education' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Education
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Education Dropdown */}
                    {openDropdown === 'education' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                          onMouseEnter={() => handleDropdownContentEnter('education')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            <button 
                              onClick={() => {
                                scrollToSection('#education');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">University of New Brunswick</div>
                                <div className="text-xs text-gray-600">Bachelor of Business Administration, Finance Major</div>
                                <div className="text-xs text-gray-500">Saint John, NB • 2016-2020</div>
                              </div>
                            </button>
                            
                            <div className="border-t border-gray-200/50"></div>
                            
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Achievements</div>
                              <div className="text-xs text-gray-600">• 5 Academic Awards ($47,500)</div>
                              <div className="text-xs text-gray-600">• Accredited Co-op Program</div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Leadership</div>
                              <div className="text-xs text-gray-600">• Student Investment Fund</div>
                              <div className="text-xs text-gray-600">• RBC Student Ambassador</div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Coursework</div>
                              <div className="text-xs text-gray-600">• 40 Total Courses Completed</div>
                              <div className="text-xs text-gray-600">• 6 Course Categories</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('experience')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#experience')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'experience' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Experience
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Experience Dropdown */}
                    {openDropdown === 'experience' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                          onMouseEnter={() => handleDropdownContentEnter('experience')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {/* Professional Experience */}
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Professional Experience</div>
                            
                            {/* BMO Private Wealth */}
                            <button 
                              onClick={() => {
                                scrollToSection('#experience');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Portfolio Assistant</div>
                                <div className="text-xs text-gray-600">BMO Private Wealth</div>
                                <div className="text-xs text-gray-500">Toronto, ON • 2022-2023</div>
                              </div>
                            </button>

                            {/* TD Canada Trust */}
                            <button 
                              onClick={() => {
                                scrollToSection('#experience');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Financial Advisor</div>
                                <div className="text-xs text-gray-600">TD Canada Trust</div>
                                <div className="text-xs text-gray-500">Kingston, ON • 2021-2022</div>
                              </div>
                            </button>

                            {/* RBC Banking Advisor */}
                            <button 
                              onClick={() => {
                                scrollToSection('#experience');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Banking Advisor</div>
                                <div className="text-xs text-gray-600">RBC</div>
                                <div className="text-xs text-gray-500">Kingston, ON • 2020-2021</div>
                              </div>
                            </button>

                            <div className="border-t border-gray-200/50 my-3"></div>
                            
                            {/* Co-op Experience */}
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Co-op Experience</div>

                            {/* RBC Client Advisor */}
                            <button 
                              onClick={() => {
                                scrollToSection('#co-op-experience');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Client Advisor Intern</div>
                                <div className="text-xs text-gray-600">RBC</div>
                                <div className="text-xs text-gray-500">Fredericton, NB • 2019-2020</div>
                              </div>
                            </button>

                            {/* Irving Oil */}
                            <button 
                              onClick={() => {
                                scrollToSection('#co-op-experience');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Marketing Intern</div>
                                <div className="text-xs text-gray-600">Irving Oil</div>
                                <div className="text-xs text-gray-500">Saint John, NB • 2018</div>
                              </div>
                            </button>

                            {/* Grant Thornton */}
                            <button 
                              onClick={() => {
                                scrollToSection('#co-op-experience');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Tax Return Intern</div>
                                <div className="text-xs text-gray-600">Grant Thornton LLP</div>
                                <div className="text-xs text-gray-500">Saint John, NB • 2018</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('certifications')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#certifications')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'certifications' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Certifications
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Certifications Dropdown */}
                    {openDropdown === 'certifications' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                          onMouseEnter={() => handleDropdownContentEnter('certifications')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {/* CFA Level I Candidate */}
                            <button 
                              onClick={() => {
                                scrollToSection('#certifications');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">CFA Level I Candidate</div>
                                <div className="text-xs text-gray-600">CFA Institute</div>
                                <div className="text-xs text-gray-500">Investment Analysis & Ethics • 2025</div>
                              </div>
                            </button>

                            {/* GRE Exam */}
                            <button 
                              onClick={() => {
                                scrollToSection('#certifications');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">GRE Exam</div>
                                <div className="text-xs text-gray-600">Educational Testing Service</div>
                                <div className="text-xs text-gray-500">Score: 325 (Q: 165, V: 160) • 2024</div>
                              </div>
                            </button>

                            <div className="border-t border-gray-200/50 my-3"></div>
                            
                            {/* Certification Categories */}
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Certification Categories</div>

                            {/* Finance Certifications */}
                            <button 
                              onClick={() => {
                                scrollToSection('#certifications');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Finance Certifications</div>
                                <div className="text-xs text-gray-600">10 certifications</div>
                                <div className="text-xs text-gray-500">CFA, CSI, Bloomberg, WSP</div>
                              </div>
                            </button>

                            {/* Technology Certifications */}
                            <button 
                              onClick={() => {
                                scrollToSection('#certifications');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Technology Certifications</div>
                                <div className="text-xs text-gray-600">6 certifications</div>
                                <div className="text-xs text-gray-500">Coursera, Data Science</div>
                              </div>
                            </button>

                            {/* Analytics Certifications */}
                            <button 
                              onClick={() => {
                                scrollToSection('#certifications');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Analytics Certifications</div>
                                <div className="text-xs text-gray-600">5 certifications</div>
                                <div className="text-xs text-gray-500">Coursera, Advanced Analytics</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Community */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('community')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#community')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'community' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Community
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Community Dropdown */}
                    {openDropdown === 'community' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                          onMouseEnter={() => handleDropdownEnter('community')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {/* United Way */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Next Gen Ambassador</div>
                                <div className="text-xs text-gray-600">United Way</div>
                                <div className="text-xs text-gray-500">Kingston, ON • 2020-2023</div>
                              </div>
                            </button>

                            {/* RBC Student Ambassador */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Student Ambassador</div>
                                <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                                <div className="text-xs text-gray-500">Fredericton, NB • 2019-2020</div>
                              </div>
                            </button>

                            {/* Irving Oil Volunteer */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Volunteer Staff</div>
                                <div className="text-xs text-gray-600">Irving Oil Limited</div>
                                <div className="text-xs text-gray-500">Saint John, NB • 2018</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('contact')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'contact' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Contact
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Contact Dropdown */}
                    {openDropdown === 'contact' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                          onMouseEnter={() => handleDropdownEnter('contact')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-2">
                            
                            {/* Email */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Email</div>
                                <div className="text-xs text-gray-600">tylerbustard@hotmail.com</div>
                                <div className="text-xs text-gray-500">Professional Inquiries</div>
                              </div>
                            </button>

                            {/* Phone */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Phone</div>
                                <div className="text-xs text-gray-600">(613) 985-1223</div>
                                <div className="text-xs text-gray-500">Available 9AM-5PM EST</div>
                              </div>
                            </button>

                            {/* Location */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900">Location</div>
                                <div className="text-xs text-gray-600">Toronto, Ontario</div>
                                <div className="text-xs text-gray-500">Canada</div>
                              </div>
                            </button>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Home Page Navigation - With Dropdowns */}
              
              {/* Education */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('education')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#education')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'education' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Education
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Education Dropdown */}
                  {openDropdown === 'education' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        onMouseEnter={() => handleDropdownContentEnter('education')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-3">
                          <button 
                            onClick={() => {
                              scrollToSection('#education');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">University of New Brunswick</div>
                              <div className="text-xs text-gray-600">Bachelor of Business Administration, Finance Major</div>
                              <div className="text-xs text-gray-500">Saint John, NB • 2016-2020</div>
                            </div>
                          </button>
                          
                          <div className="border-t border-gray-200/50"></div>
                          
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Achievements</div>
                            <div className="text-xs text-gray-600">• 5 Academic Awards ($47,500)</div>
                            <div className="text-xs text-gray-600">• Accredited Co-op Program</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Leadership</div>
                            <div className="text-xs text-gray-600">• Student Investment Fund</div>
                            <div className="text-xs text-gray-600">• RBC Student Ambassador</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Coursework</div>
                            <div className="text-xs text-gray-600">• 40 Total Courses Completed</div>
                            <div className="text-xs text-gray-600">• 6 Course Categories</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('experience')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#experience')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'experience' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Experience
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Experience Dropdown */}
                  {openDropdown === 'experience' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        onMouseEnter={() => handleDropdownEnter('experience')}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {/* BMO Private Wealth */}
                          <button 
                            onClick={() => {
                              scrollToSection('#experience-bmo-private-wealth-portfolio-assistant');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Portfolio Assistant</div>
                              <div className="text-xs text-gray-600">BMO Private Wealth</div>
                              <div className="text-xs text-gray-500">Toronto, ON • 2022-2023</div>
                            </div>
                          </button>
                          
                          {/* TD Canada Trust */}
                          <button 
                            onClick={() => {
                              scrollToSection('#experience-td-canada-trust-financial-advisor');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Financial Advisor</div>
                              <div className="text-xs text-gray-600">TD Canada Trust</div>
                              <div className="text-xs text-gray-500">Kingston, ON • 2021-2022</div>
                            </div>
                          </button>
                          
                          {/* RBC Banking Advisor */}
                          <button 
                            onClick={() => {
                              scrollToSection('#experience-royal-bank-of-canada-banking-advisor');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Banking Advisor</div>
                              <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                              <div className="text-xs text-gray-500">Kingston, ON • 2020-2021</div>
                            </div>
                          </button>
                          
                          {/* RBC Client Advisor Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection('#experience-royal-bank-of-canada-client-advisor-intern');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Client Advisor Intern</div>
                              <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                              <div className="text-xs text-gray-500">Fredericton, NB • 2019-2020</div>
                            </div>
                          </button>
                          
                          {/* Irving Oil */}
                          <button 
                            onClick={() => {
                              scrollToSection('#experience-irving-oil-limited-marketing-intern');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Marketing Intern</div>
                              <div className="text-xs text-gray-600">Irving Oil Limited</div>
                              <div className="text-xs text-gray-500">Saint John, NB • 2018</div>
                            </div>
                          </button>
                          
                          {/* Grant Thornton */}
                          <button 
                            onClick={() => {
                              scrollToSection('#experience-grant-thornton-llp-tax-return-intern');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Tax Return Intern</div>
                              <div className="text-xs text-gray-600">Grant Thornton LLP</div>
                              <div className="text-xs text-gray-500">Saint John, NB • 2018</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certifications */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('certifications')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#certifications')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'certifications' || currentSection === 'skills' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Certifications
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Certifications Dropdown */}
                  {openDropdown === 'certifications' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          
                          {/* Financial Certifications Section */}
                          <div>
                            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 px-2">Financial Certifications</div>
                            <div className="space-y-1">
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">CFA Level I Candidate</div>
                                  <div className="text-xs text-gray-600">CFA Institute • 2025</div>
                            </div>
                          </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Discounted Cash Flow Analysis</div>
                                  <div className="text-xs text-gray-600">Training the Street • 2024</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Financial Planning 1</div>
                                  <div className="text-xs text-gray-600">Canadian Securities Institute • 2023</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Certificate in Financial Services Advice</div>
                                  <div className="text-xs text-gray-600">Canadian Securities Institute • 2022</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Personal Financial Service Advice</div>
                                  <div className="text-xs text-gray-600">Canadian Securities Institute • 2021</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Canadian Securities Course</div>
                                  <div className="text-xs text-gray-600">Canadian Securities Institute • 2021</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Financial & Valuation Modeling</div>
                                  <div className="text-xs text-gray-600">Wall Street Prep • 2020</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Investment Funds in Canada</div>
                                  <div className="text-xs text-gray-600">Canadian Securities Institute • 2020</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Bloomberg Market Concepts Certificate</div>
                                  <div className="text-xs text-gray-600">Bloomberg • 2020</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-financial-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Personal Finance Essentials</div>
                                  <div className="text-xs text-gray-600">McGill University • 2020</div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Data Science & Technology Certifications Section */}
                          <div>
                            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 px-2">Data Science & Technology Certifications</div>
                            <div className="space-y-1">
                              <button onClick={() => { scrollToSection('#certifications-data-science-technology-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Data Analytics Professional</div>
                                  <div className="text-xs text-gray-600">Google • 2023</div>
                            </div>
                          </button>
                              <button onClick={() => { scrollToSection('#certifications-data-science-technology-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                            <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Data Visualization with Tableau</div>
                                  <div className="text-xs text-gray-600">UC Davis • 2023</div>
                            </div>
                          </button>
                              <button onClick={() => { scrollToSection('#certifications-data-science-technology-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Python for Everybody</div>
                                  <div className="text-xs text-gray-600">University of Michigan • 2023</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-data-science-technology-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Machine Learning</div>
                                  <div className="text-xs text-gray-600">Stanford University • 2020</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-data-science-technology-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">SQL for Data Science</div>
                                  <div className="text-xs text-gray-600">UC Davis • 2020</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-data-science-technology-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Power BI Data Visualization</div>
                                  <div className="text-xs text-gray-600">Microsoft • 2020</div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Mathematical & Statistical Certifications Section */}
                          <div>
                            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 px-2">Mathematical & Statistical Certifications</div>
                            <div className="space-y-1">
                              <button onClick={() => { scrollToSection('#certifications-mathematical-statistical-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Econometrics: Methods & Applications</div>
                                  <div className="text-xs text-gray-600">Erasmus University • 2024</div>
                            </div>
                          </button>
                              <button onClick={() => { scrollToSection('#certifications-mathematical-statistical-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                            <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Matrix Algebra for Engineers</div>
                                  <div className="text-xs text-gray-600">HKUST • 2024</div>
                            </div>
                          </button>
                              <button onClick={() => { scrollToSection('#certifications-mathematical-statistical-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Introduction to Calculus</div>
                                  <div className="text-xs text-gray-600">University of Sydney • 2023</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-mathematical-statistical-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Inferential Statistics</div>
                                  <div className="text-xs text-gray-600">Duke University • 2020</div>
                                </div>
                              </button>
                              <button onClick={() => { scrollToSection('#certifications-mathematical-statistical-certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-gray-900">Excel Skills for Business</div>
                                  <div className="text-xs text-gray-600">Macquarie University • 2020</div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Standardized Exam Section */}
                          <div>
                            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 px-2">Standardized Exam</div>
                            <div className="space-y-1">
                              <button onClick={() => { scrollToSection('#certifications-standardized-exam'); setOpenDropdown(null); }} className="w-full text-left hover:bg-blue-50/50 rounded-lg p-2 transition-all duration-200">
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">GRE General Test</div>
                                  <div className="text-xs text-gray-600">ETS • 2024</div>
                            </div>
                          </button>
                            </div>
                          </div>
                          
                          {/* View All Button */}
                          <div className="pt-2 border-t border-gray-200">
                          <button onClick={() => { scrollToSection('#certifications'); setOpenDropdown(null); }} className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200">
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">View All Certifications</div>
                              <div className="text-xs text-gray-600">22 Professional Certifications</div>
                              <div className="text-xs text-gray-500">4 Categories</div>
                            </div>
                          </button>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Community */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('community')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#community')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'community' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Community
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Community Dropdown */}
                  {openDropdown === 'community' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        onMouseEnter={() => handleDropdownContentEnter('community')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          
                          {/* United Way */}
                          <button 
                            onClick={() => {
                              scrollToSection('#community-united-way');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Next Gen Ambassador</div>
                              <div className="text-xs text-gray-600">United Way</div>
                              <div className="text-xs text-gray-500">Kingston, ON • 2020-2023</div>
                            </div>
                          </button>
                          
                          {/* RBC Student Ambassador */}
                          <button 
                            onClick={() => {
                              scrollToSection('#community-royal-bank-of-canada');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Student Ambassador</div>
                              <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                              <div className="text-xs text-gray-500">Fredericton, NB • 2019-2020</div>
                            </div>
                          </button>
                          
                          {/* Irving Oil */}
                          <button 
                            onClick={() => {
                              scrollToSection('#community-irving-oil-limited');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Volunteer Staff</div>
                              <div className="text-xs text-gray-600">Irving Oil Limited</div>
                              <div className="text-xs text-gray-500">Saint John, NB • 2018</div>
                            </div>
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('contact')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'contact' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Contact
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Contact Dropdown */}
                  {openDropdown === 'contact' && (
                    <div className="absolute top-full left-0 -mt-1 w-72 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        <div className="space-y-2">
                          
                          {/* Email */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Email</div>
                              <div className="text-xs text-gray-600">tylerbustard@hotmail.com</div>
                              <div className="text-xs text-gray-500">Professional Inquiries</div>
                            </div>
                          </button>

                          {/* Phone */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Phone</div>
                              <div className="text-xs text-gray-600">(613) 985-1223</div>
                              <div className="text-xs text-gray-500">Available 9AM-5PM EST</div>
                            </div>
                          </button>

                          {/* Location */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">Location</div>
                              <div className="text-xs text-gray-600">Toronto, Ontario</div>
                              <div className="text-xs text-gray-500">Canada</div>
                            </div>
                          </button>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side */}
            {!isSignInPage && (
            <div className="flex items-center space-x-3">
              
              {/* Desktop Resume Button */}
              <div className="hidden lg:block">
                <button 
                  onClick={() => {
                    if (isResumePage) {
                      // Always go to home page, not back in history
                      window.location.href = basePath || '/';
                    } else if (isUploadPage || isSignInPage) {
                      // Go to home page for upload-resume and sign-in pages
                      window.location.href = basePath || '/';
                      } else {
                      window.location.href = `${basePath}/resume`;
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  {isResumePage ? 'Close' : isUploadPage ? 'Home' : 'Resume'}
                </button>
              </div>

              {/* Mobile Menu Button */}
              {(isResumePage || isUploadPage || isSignInPage) ? (
                <button
                  onClick={() => {
                    // Always go to home page, not back in history
                    window.location.href = basePath || '/';
                  }}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                  aria-label={isResumePage ? "Close resume" : "Go to home"}
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Clean Glass Effect */}
      {isMobileMenuOpen && !isResumePage && !isUploadPage && !isSignInPage && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="absolute inset-x-0 top-0 h-full overflow-y-auto animate-in slide-in-from-top duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)'
            }}
          >
            <div className="p-6 pt-20">
              {/* Close Button at top */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Mobile Navigation Links */}
                {isHomePage && (
                  <>
                    <button 
                      onClick={() => {
                        scrollToSection('#education');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Education
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#experience');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Experience
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#certifications');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Certifications
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#community');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      Community
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      Contact
                    </button>
                  </>
                )}
                
                {/* Resume Button */}
                <button 
                  onClick={() => {
                    if (isResumePage) {
                      // Always go to home page, not back in history
                      window.location.href = basePath || '/';
                    } else if (isUploadPage || isSignInPage) {
                      // Go to home page for upload-resume and sign-in pages
                      window.location.href = basePath || '/';
                      } else {
                      window.location.href = `${basePath}/resume`;
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-lg font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {isResumePage ? 'Close Resume' : isUploadPage ? 'Home' : 'Resume'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}