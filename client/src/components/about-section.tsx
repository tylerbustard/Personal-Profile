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

// Counter component for course count
function CourseCounter() {
  const { count, elementRef } = useCounterAnimation({ end: 40, delay: 200, duration: 2000 });
  
  return (
    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2 sm:mb-3" ref={elementRef}>
      {count}
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
    major: "Major in Finance",
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
      category: "Achievements", 
      items: [
        { title: "5 Academic Awards", desc: "$47,500 in scholarships and alumni awards for merit and leadership" },
        { title: "Accredited Co-op Program", desc: "Professional work experience integrated with academic curriculum" }
      ],
      gradient: "from-gray-100/50 to-gray-200/50"
    },
    { 
      category: "Leadership", 
      items: [
        { title: "Student Investment Fund", desc: "Analyst and Portfolio Manager - Energy sector focus and analysis" },
        { title: "RBC Student Ambassador", desc: "Campus leadership and financial services representation role" }
      ],
      gradient: "from-gray-100/50 to-gray-200/50"
    }
  ];

  const courseCategories = [
    // CORE FINANCE & QUANTITATIVE COURSES
    {
      title: "Finance",
      courseCount: 6,
      courses: [
        {
          code: "BA 3425",
          title: "Managerial Finance",
          year: "2017",
          description: "Introduction to corporate financial management principles, including financial analysis, planning, and valuation techniques."
        },
        {
          code: "BA 3426",
          title: "Corporate Finance",
          year: "2018",
          description: "Advanced study of corporate financial decision-making, covering capital budgeting, capital structure, and dividend policy."
        },
        {
          code: "ADM 3435",
          title: "Financial Markets & Institutions",
          year: "2019",
          description: "Comprehensive analysis of Canadian financial markets, institutions, and their role in managing financial risks and opportunities."
        },
        {
          code: "ADM 4445",
          title: "Theory of Finance",
          year: "2019",
          description: "Theoretical foundations of modern finance, including portfolio theory, asset pricing models, and corporate financial policy."
        },
        {
          code: "ADM 4455",
          title: "International Financial Management",
          year: "2019",
          description: "Study of financial management in global markets, covering exchange rate risk, international capital budgeting, and cross-border investment decisions."
        },
        {
          code: "ADM 4451",
          title: "Student Investment Fund I",
          year: "2019",
          description: "Practical application of investment management principles through hands-on management of a multi-million-dollar student investment fund."
        }
      ]
    },
    {
      title: "Quantitative, Analytics & Statistics",
      courseCount: 6,
      courses: [
        {
          code: "BA 1605",
          title: "Business Decision Analysis I",
          year: "2016",
          description: "Introduction to quantitative methods for business decision-making, covering probability theory, statistical distributions, and decision analysis models."
        },
        {
          code: "BA 2606",
          title: "Business Decision Analysis II",
          year: "2017",
          description: "Advanced quantitative techniques for business applications, including forecasting methods, simulation modeling, and optimization tools."
        },
        {
          code: "BA 3623",
          title: "Management Science: Deterministic Models",
          year: "2016",
          description: "Study of deterministic optimization techniques including linear programming, integer programming, network analysis, and scheduling algorithms."
        },
        {
          code: "ADM 3628",
          title: "Advanced Statistics for Business",
          year: "2019",
          description: "Advanced statistical methods and their applications in business decision-making, including regression analysis, time series, and multivariate techniques."
        },
        {
          code: "MATH 1003",
          title: "Introduction to Calculus I",
          year: "2018",
          description: "Introduction to differential calculus of single variables with emphasis on business and economic applications."
        },
        {
          code: "MATH 1853",
          title: "Mathematics for Business",
          year: "2018",
          description: "Mathematical concepts and techniques specifically designed for business applications, including functions, calculus, and optimization methods."
        }
      ]
    },
    {
      title: "Economics",
      courseCount: 4,
      courses: [
        {
          code: "ECON 1013",
          title: "Introductory Microeconomics",
          year: "2014",
          description: "Introduction to microeconomic theory covering market mechanisms, supply and demand analysis, consumer behavior, and firm decision-making."
        },
        {
          code: "ECON 1023",
          title: "Introductory Macroeconomics",
          year: "2014",
          description: "Study of macroeconomic principles including national income, economic growth, inflation, unemployment, and monetary and fiscal policy."
        },
        {
          code: "ECON 2091",
          title: "Contemporary Issues in the Canadian Economy I",
          year: "2017",
          description: "Analysis of current economic issues affecting Canada, including unemployment, inflation, poverty, and regional economic development policies."
        },
        {
          code: "ECON 3013",
          title: "Intermediate Microeconomics",
          year: "2018",
          description: "Advanced microeconomic theory with applications to managerial decision-making, including pricing strategies, production optimization, and competitive strategy."
        }
      ]
    },
    {
      title: "Accounting",
      courseCount: 3,
      courses: [
        {
          code: "BA 1216",
          title: "Accounting for Managers I",
          year: "2016",
          description: "Introduction to financial accounting principles and practices for managerial decision-making and financial statement analysis."
        },
        {
          code: "BA 1218",
          title: "Accounting Lab",
          year: "2017",
          description: "Practical application of accounting principles through hands-on exercises and case studies in financial accounting."
        },
        {
          code: "BA 3235",
          title: "Intermediate Accounting I",
          year: "2017",
          description: "Advanced study of financial reporting standards, asset valuation, and revenue recognition principles in corporate accounting."
        }
      ]
    },
    // BUSINESS & MANAGEMENT COURSES
    {
      title: "Operations & Strategy",
      courseCount: 2,
      courses: [
        {
          code: "BA 4101",
          title: "Competitive Strategy",
          year: "2018",
          description: "Capstone course in strategic management focusing on industry analysis, competitive positioning, and the development of sustainable competitive advantages."
        },
        {
          code: "BA 3653",
          title: "Operations Management I",
          year: "2018",
          description: "Study of operations management principles including process design, capacity planning, quality control, and supply chain management in manufacturing and service organizations."
        }
      ]
    },
    {
      title: "Marketing",
      courseCount: 2,
      courses: [
        {
          code: "BA 2303",
          title: "Principles of Marketing",
          year: "2017",
          description: "Introduction to fundamental marketing concepts including consumer behavior analysis, market segmentation, and the strategic marketing mix framework."
        },
        {
          code: "BA 3304",
          title: "Marketing Management",
          year: "2017",
          description: "Advanced study of marketing strategy and management, focusing on analytical approaches to marketing decision-making and strategic planning."
        }
      ]
    },
    {
      title: "Information Systems",
      courseCount: 2,
      courses: [
        {
          code: "BA 3672",
          title: "Introduction to Management Information Systems",
          year: "2018",
          description: "Study of how information systems support business processes, decision-making, and competitive advantage in modern organizations."
        },
        {
          code: "CS 1073",
          title: "Introduction to Computer Programming I (Java)",
          year: "2014",
          description: "Introduction to computer programming fundamentals using Java, covering control structures, data types, arrays, object-oriented programming, and inheritance."
        }
      ]
    },
    // PROFESSIONAL & LEGAL COURSES
    {
      title: "Law & Ethics",
      courseCount: 2,
      courses: [
        {
          code: "PHIL 3153/3204",
          title: "Business Ethics",
          year: "2018",
          description: "Examination of ethical principles and moral reasoning in business contexts, covering corporate social responsibility and ethical decision-making frameworks."
        },
        {
          code: "BA 3705",
          title: "Business Law",
          year: "2017",
          description: "Introduction to Canadian business law covering contract law, tort law, and the legal framework governing business operations and commercial transactions."
        }
      ]
    },
    {
      title: "Communications & Languages",
      courseCount: 3,
      courses: [
        {
          code: "BA 2001",
          title: "Business Communications I",
          year: "2018",
          description: "Development of effective written and oral communication skills for professional business environments, including report writing and presentation techniques."
        },
        {
          code: "ADM 2166",
          title: "Business Communications II",
          year: "2019",
          description: "Advanced business communication strategies focusing on professional report writing, proposal development, and persuasive presentation skills."
        },
        {
          code: "FR 1203",
          title: "Communicating in French I",
          year: "2017",
          description: "Introduction to French language and communication skills, designed for students with limited prior French experience and aligned with CEFR A1 standards."
        }
      ]
    },
    // LIBERAL ARTS & GENERAL EDUCATION
    {
      title: "Political Science",
      courseCount: 3,
      courses: [
        {
          code: "POLS 1201",
          title: "Intro to Canadian Politics",
          year: "2014",
          description: "Introduction to Canadian political institutions, federalism, political parties, and electoral behavior in the Canadian political system."
        },
        {
          code: "POLS 1301",
          title: "Global Political Studies",
          year: "2014",
          description: "Comparative analysis of political systems, institutions, and processes across different countries and political regimes."
        },
        {
          code: "POLS 1603",
          title: "Politics of Globalization",
          year: "2019",
          description: "Examination of global political, economic, and social forces shaping international relations, including migration, climate change, and global health governance."
        }
      ]
    },
    {
      title: "Liberal Arts & Humanities",
      courseCount: 2,
      courses: [
        {
          code: "PHIL 1053",
          title: "Introduction to Logic, Reasoning & Critical Thinking",
          year: "2017",
          description: "Introduction to logical reasoning, argument analysis, and critical thinking skills essential for academic and professional decision-making."
        },
        {
          code: "CCS/COMS 1001",
          title: "History of Communication",
          year: "2014",
          description: "Historical survey of communication technologies and media evolution, examining their impact on society, culture, and human interaction."
        }
      ]
    },
    {
      title: "Academic & Professional Development",
      courseCount: 2,
      courses: [
        {
          code: "BA 2504",
          title: "Introduction to Organizational Behaviour",
          year: "2016",
          description: "Study of individual, group, and organizational behavior in business settings, covering motivation, leadership, team dynamics, and organizational culture."
        },
        {
          code: "UNIV 1003",
          title: "Everything I Need to Know in First Year",
          year: "2014",
          description: "First-year transition seminar focusing on academic success strategies, study skills, and campus engagement for new university students."
        }
      ]
    }
  ];

  return (
    <section 
      ref={sectionAnimation.ref}
      id="education" 
      className="py-20 sm:py-28 lg:py-36 relative overflow-hidden"
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={headerAnimation.ref}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            Education
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            Strategic business foundation with finance expertise
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] p-8 sm:p-10 lg:p-12 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
          {/* UNB Education Info - Inside main card */}
          <div 
            ref={heroCardAnimation.ref}
            className="mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
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
                  <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>University of New Brunswick</h3>
                  <p className="text-lg font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Bachelor of Business Administration</p>
                  <p className="text-base font-semibold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Finance Major</p>
                  <p className="text-base text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Saint John, New Brunswick</p>
                  <span className="text-base font-medium text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>2016-2020</span>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-0 sm:gap-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      {education.institution}
                    </h3>
                    <span className="text-base sm:text-lg font-medium text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>2016-2020</span>
                  </div>
                  <div className="space-y-0">
                    <p className="text-lg sm:text-xl font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{education.degree}</p>
                    <p className="text-base sm:text-lg font-semibold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{education.major}</p>
                    <p className="text-base text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{education.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Achievement Categories - Modern Flowing Layout */}
        <div ref={achievementsRef} className="space-y-8 sm:space-y-10">
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
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      {category.category}
                    </h4>
                    <div className="w-24 sm:w-12 h-1.5 sm:h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-auto sm:mx-0 mb-4 sm:mb-0" />
                  </div>

                  {/* Achievement Items */}
                  <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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

        {/* University Courses Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="space-y-8 sm:space-y-10">
            {courseCategories.map((category, categoryIndex) => (
              <div 
                key={categoryIndex} 
                className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-gradient-to-r from-gray-100/50 to-gray-200/50 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500"
                style={{ opacity: 1, visibility: 'visible' }}
              >
                <div className="absolute inset-0 bg-white/85" />
                <div className="relative p-6 sm:p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8">
                    {/* Category Title */}
                    <div className="lg:w-1/4 text-center sm:text-left">
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {category.title} Courses
                      </h4>
                      <div className="w-24 sm:w-12 h-1.5 sm:h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-auto sm:mx-0 mb-2" />
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                        {category.courseCount} {category.courseCount === 1 ? 'course' : 'courses'}
                      </p>
                    </div>

                    {/* Course Items */}
                    <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      {category.courses.map((course, courseIndex) => (
                        <div 
                          key={courseIndex} 
                          className="bg-white/90 backdrop-blur-xl rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-bold text-foreground text-lg flex-1 leading-tight pr-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                                {course.title}
                              </h5>
                              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                                {course.code}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                              {course.description}
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
        </div>

        {/* Academic Achievements & Education Summary - Modern Stats Grid */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <div className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 p-6 sm:p-8 lg:p-12">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                Academic Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <ScholarshipCounter />
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">Total Scholarships & Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3">1st Place</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">RBC Student Ambassador of the Month</div>
                </div>
                <div className="text-center">
                  <CourseCounter />
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">Total Courses Completed</div>
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