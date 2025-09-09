import { Card, CardContent } from "@/components/ui/card";
import { FaTrophy, FaStar, FaGraduationCap } from "react-icons/fa";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import universityLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";

// Counter component for scholarship amount
function ScholarshipCounter() {
  const { count, elementRef } = useCounterAnimation({ end: 47500, delay: 0, duration: 2500 });
  
  return (
    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3" ref={elementRef}>
      ${count.toLocaleString()}
    </div>
  );
}

export default function EducationSection() {
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const heroCardAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true, delay: 200 });
  const { ref: achievementsRef, visibleItems } = useStaggeredScrollAnimation(3, { threshold: 0.15, triggerOnce: true, delay: 200 });

  const education = {
    institution: "University of New Brunswick",
    location: "Saint John, New Brunswick", 
    degree: "Bachelor of Business Administration",
    major: "Finance Major",
    year: "2020",
    achievements: [
      "Analyst and Portfolio Manager – University of New Brunswick Student Investment Fund",
      "UNB Finance Club, RBC Student Ambassador, Accredited Co-op Program",
      "Recipient of 5 Scholarship and Alumni Awards for academic merit and leadership skills, Total $47,500"
    ]
  };

  const highlights = [
    { title: "$47,500", subtitle: "Total Scholarships & Awards", iconType: "award" },
    { title: "Student Ambassador", subtitle: "RBC Student Ambassador of the Month - February 2020", iconType: "image", logoSrc: rbcLogo }
  ];

  const renderIcon = (highlight: any) => {
    if (highlight.iconType === "image" && highlight.logoSrc) {
      return (
        <img 
          src={highlight.logoSrc} 
          alt="Logo" 
          className="w-10 h-10 object-contain"
        />
      );
    }
    
    switch (highlight.iconType) {
      case "trophy":
        return <FaTrophy className="w-8 h-8 text-primary" />;
      case "award":
        return <FaStar className="w-8 h-8 text-primary" />;
      case "graduation":
        return <FaGraduationCap className="w-8 h-8 text-primary" />;
      default:
        return null;
    }
  };

  const achievements = [
    { 
      category: "Academic Excellence", 
      items: [
        { title: "Finance Specialization", desc: "Bachelor of Business Administration with Finance Major focus" },
        { title: "5 Academic Awards", desc: "$47,500 in scholarships and alumni awards for merit and leadership" },
        { title: "Accredited Co-op Program", desc: "Professional work experience integrated with academic curriculum" }
      ],
      gradient: "from-gray-100/50 to-gray-200/50"
    },
    { 
      category: "Leadership & Professional", 
      items: [
        { title: "Student Investment Fund", desc: "Analyst and Portfolio Manager - Energy sector focus and analysis" },
        { title: "RBC Student Ambassador", desc: "Campus leadership and financial services representation role" },
        { title: "UNB Finance Club", desc: "Active member in professional development and networking activities" }
      ],
      gradient: "from-gray-100/50 to-gray-200/50"
    }
  ];

  return (
    <section 
      ref={sectionAnimation.ref}
      id="education" 
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        <div className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
          {/* Header */}
          <div 
            ref={headerAnimation.ref}
            className={`text-center mb-8 sm:mb-10 lg:mb-12 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Education
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Strategic business foundation with finance expertise
            </p>
          </div>

        {/* Hero Education Card - Modern Apple Layout */}
        <div 
          ref={heroCardAnimation.ref}
          className={`mb-10 sm:mb-12 lg:mb-14 scroll-scale-in scroll-stagger-1 ${heroCardAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="relative bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 sm:p-8 lg:p-16 min-h-[200px]">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 h-full text-center sm:text-left">
              {/* Logo on left */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 flex-shrink-0">
                <img 
                  src={universityLogo} 
                  alt="University Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
              
              {/* Content on right */}
              <div className="flex-1">
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-1">
                  <h3 className="text-xl font-bold text-foreground">University of New Brunswick</h3>
                  <p className="text-lg font-semibold text-primary">Bachelor of Business Administration</p>
                  <p className="text-base font-semibold text-foreground">Finance Major</p>
                  <p className="text-base text-muted-foreground">Saint John, New Brunswick</p>
                  <span className="text-base font-medium text-gray-500">2016-2020</span>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-0 sm:gap-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {education.institution}
                    </h3>
                    <span className="text-base sm:text-lg font-medium text-gray-500">2016-2020</span>
                  </div>
                  <div className="space-y-0">
                    <p className="text-lg sm:text-xl font-semibold text-primary">{education.degree}</p>
                    <p className="text-base sm:text-lg font-semibold text-foreground">{education.major}</p>
                    <p className="text-base text-muted-foreground">{education.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Categories - Modern Flowing Layout */}
        <div ref={achievementsRef} className="space-y-6 sm:space-y-8">
          {achievements.map((category, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-gradient-to-r ${category.gradient} backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 scroll-scale-in scroll-stagger-${index + 2} ${visibleItems.has(index) ? 'visible' : ''}`}
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />
              <div className="relative p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8">
                  {/* Category Title */}
                  <div className="lg:w-1/4 text-center sm:text-left">
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-2">
                      {category.category}
                    </h4>
                    <div className="w-24 sm:w-12 h-1.5 sm:h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-auto sm:mx-0 mb-4 sm:mb-0" />
                  </div>

                  {/* Achievement Items */}
                  <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="bg-white/90 backdrop-blur-xl rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-full"
                      >
                        <div>
                          <h5 className="font-semibold text-foreground mb-3 text-base sm:text-lg min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
                            {item.title}
                          </h5>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Excellence Summary - Modern Stats Grid */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <div className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 p-6 sm:p-8 lg:p-12">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                Academic Excellence Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="text-center">
                  <ScholarshipCounter />
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">Total Scholarships & Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3">1st Place</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">RBC Student Ambassador of the Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}