import { Card, CardContent } from "@/components/ui/card";
import { FaTrophy, FaStar, FaGraduationCap } from "react-icons/fa";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import universityLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import mcgillLogo from "@assets/mcgill_university_logo.jpeg";
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

interface CounterStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
  delay?: number;
}

function EducationCounter({ end, suffix = '', prefix = '', label, className = '', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });
  
  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${className}`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm sm:text-base text-muted-foreground font-medium">{label}</div>
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

interface EducationSectionProps {
  variation?: 'universityoftoronto' | 'queensuniversity' | 'profile' | null;
}

export default function EducationSection({ variation = null }: EducationSectionProps = {}) {
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const heroCardAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true, delay: 200 });
  const { ref: achievementsRef, visibleItems } = useStaggeredScrollAnimation(2, { threshold: 0.15, triggerOnce: true, delay: 200 });
  const { ref: mcgillAchievementsRef, visibleItems: mcgillAchievementsItems } = useStaggeredScrollAnimation(2, { threshold: 0.15, triggerOnce: true, delay: 200 });
  const { ref: courseRef, visibleItems: courseVisibleItems } = useStaggeredScrollAnimation(6, { threshold: 0.15, triggerOnce: true, delay: 300 });
  const { ref: unbCourseRef, visibleItems: unbCourseVisibleItems } = useStaggeredScrollAnimation(12, { threshold: 0.15, triggerOnce: true, delay: 300 });

  // Base education data
  const unbEducation = {
    institution: "University of New Brunswick",
    location: "Saint John, New Brunswick", 
    degree: "Bachelor of Business Administration",
    major: "Major in Finance",
    year: "2016-2020",
    achievements: [
      "Analyst and Portfolio Manager – University of New Brunswick Student Investment Fund",
      "UNB Finance Club, RBC Student Ambassador, Accredited Co-op Program",
      "Recipient of 5 Scholarship and Alumni Awards for academic merit and leadership skills, Total $47,500"
    ]
  };

  // Queen's University education for profile variation
  const queensEducation = {
    institution: "Desautels Faculty of Management",
    location: "Toronto, Ontario",
    degree: "McGill University",
    major: "Master of Management in Finance Candidate",
    year: "2026-2027",
    achievements: [
      "Peter Christoffersen MMF Award Recipient - Academic Excellence in Finance",
      "Financial Times #1 North America MMF Program - Class of 2026-2027"
    ],
    leadership: [
      "Desautels Capital Management - Student Investment Fund Analyst",
      "McGill MMF Student Ambassador - Program Recruitment and Mentorship"
    ]
  };

  // Create education array based on variation
  const educationEntries = variation === 'profile' 
    ? [queensEducation, unbEducation]
    : [unbEducation];

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

        {/* Education Cards */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {educationEntries.map((education, index) => (
          <div 
              key={index}
              id={education.institution.includes('Desautels') ? 'mcgill-education' : 'unb-education'}
              ref={index === 0 ? heroCardAnimation.ref : undefined}
              className={`bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] p-8 sm:p-10 lg:p-12 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group ${index === 0 ? `scroll-scale-in scroll-stagger-${index + 1} ${heroCardAnimation.isVisible ? 'visible' : ''}` : 'visible'}`}
          >
              {/* Education Header */}
              <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              {/* Logo on left */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 flex-shrink-0 overflow-hidden">
                    {education.institution.includes('Desautels') ? (
                      <img 
                        src={mcgillLogo} 
                        alt="McGill University Logo" 
                        className="w-full h-full object-cover rounded-3xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center">
                <img 
                  src={universityLogo} 
                  alt="University Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
                      </div>
                    )}
              </div>
              
              {/* Content on right */}
              <div className="flex-1">
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-1">
                      <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {education.institution}
                      </h3>
                      <p className="text-lg font-semibold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                        {education.degree}
                      </p>
                      <p className="text-base font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                        {education.major}
                      </p>
                      <p className="text-base text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                        {education.location}
                      </p>
                      <span className="text-base font-medium text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                        {education.year}
                      </span>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-0 sm:gap-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      {education.institution}
                    </h3>
                        <span className="text-base sm:text-lg font-medium text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {education.year}
                        </span>
                  </div>
                  <div className="space-y-0">
                        <p className="text-lg sm:text-xl font-semibold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {education.degree}
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {education.major}
                        </p>
                        <p className="text-base text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {education.location}
                        </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* University-specific content based on institution */}
              {education.institution.includes('Desautels') ? (
                // McGill University specific content
                <>
                  {/* Queen's Achievement Categories */}
                  <div ref={achievementsRef} className="space-y-8 sm:space-y-10">
                    {[
                      { 
                        category: "Achievements", 
                        items: [
                          { title: "Peter Christoffersen Award Recipient", desc: "Awarded $5,000 for outstanding academic performance and leadership potential in the Master of Management in Finance program" },
                          { title: "McGill Entrance Scholarship Recipient", desc: "Received $8,000 entrance scholarship for exceptional academic credentials and leadership potential in finance" }
                        ],
                        gradient: "from-gray-100/50 to-gray-200/50"
                      },
                      { 
                        category: "Leadership", 
                        items: [
                          { title: "Head of Risk Management", desc: "Managing $2.5M student investment portfolio, calculating market risk metrics, and implementing risk management strategies for DCM's equity fund" },
                          { title: "Chief Sustainability Officer", desc: "Leading ESG integration initiatives, assessing 50+ investments through environmental and social lenses, and building network across Montreal, Toronto, and New York" }
                        ],
                        gradient: "from-gray-100/50 to-gray-200/50"
                      }
                    ].map((category, categoryIndex) => (
                      <div 
                        key={categoryIndex} 
                        ref={categoryIndex === 0 ? mcgillAchievementsRef : undefined}
                        className={`relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-gradient-to-r ${category.gradient} backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 scroll-scale-in scroll-stagger-${categoryIndex + 1} ${mcgillAchievementsItems.has(categoryIndex) ? 'visible' : ''}`}
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
                                  className="rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-full"
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

                  {/* McGill MMF Courses Section */}
                  <div className="mt-12 sm:mt-16 lg:mt-20">
                    <div ref={courseRef} className="space-y-8 sm:space-y-10">
                      {[
                        {
                          title: "Core Foundation",
                          courseCount: 2,
                          courses: [
                            {
                              code: "ACCT 604",
                              title: "Financial Statements 1",
                              year: "2025",
                              description: "Introduction to financial accounting, including the objectives of financial statement analysis."
                            },
                            {
                              code: "FINE 670",
                              title: "Fundamentals of Financial Research",
                              year: "2025",
                              description: "Research methodology, where a research project will be carried out under the supervision of the Faculty supervisor."
                            }
                          ]
                        },
                        {
                          title: "Theoretical Finance",
                          courseCount: 3,
                          courses: [
                            {
                              code: "FINE 678",
                              title: "Financial Economics",
                              year: "2025",
                              description: "Theoretical foundations of modern financial economics, including portfolio decisions under uncertainty and security valuation."
                            },
                            {
                              code: "FINE 679",
                              title: "Corporate Finance Theory",
                              year: "2025",
                              description: "Fund raising for companies: The choice between long-term debt and equity. The basic concepts of valuing a company."
                            },
                            {
                              code: "FINE 680",
                              title: "Investments",
                              year: "2025",
                              description: "Financial markets, portfolio theory, and portfolio management."
                            }
                          ]
                        },
                        {
                          title: "Advanced Corporate Finance",
                          courseCount: 2,
                          courses: [
                            {
                              code: "FINE 683",
                              title: "Advanced Corporate Finance",
                              year: "2026",
                              description: "Financial tools required for good business decisions, focusing on the relation between finance and corporate strategy."
                            },
                            {
                              code: "FINE 688",
                              title: "Mergers and Acquisitions",
                              year: "2025",
                              description: "M&A activities and processes used to successfully accomplish and create shareholder value from these activities."
                            }
                          ]
                        },
                        {
                          title: "Financial Markets & Instruments",
                          courseCount: 3,
                          courses: [
                            {
                              code: "FINE 681",
                              title: "International Capital Markets",
                              year: "2025",
                              description: "International finance, including comprehensive analysis of institutions and theoretical models that characterize open economies."
                            },
                            {
                              code: "FINE 682",
                              title: "Derivatives",
                              year: "2026",
                              description: "Introduction to the valuation and hedging of derivatives contracts such as options, futures and forwards."
                            },
                            {
                              code: "FINE 684",
                              title: "Fixed Income Analysis",
                              year: "2026",
                              description: "Fixed income financial instruments and their uses for financial engineering and risk management."
                            }
                          ]
                        },
                        {
                          title: "Technology & Innovation",
                          courseCount: 1,
                          courses: [
                            {
                              code: "FINE 674",
                              title: "Fintech",
                              year: "2025",
                              description: "Exploration of the impact of information technologies on financial systems and digitalization of payments."
                            }
                          ]
                        },
                        {
                          title: "Advanced Topics & Research",
                          courseCount: 3,
                          courses: [
                            {
                              code: "FINE 690",
                              title: "Advanced Topics in Finance 1",
                              year: "2025",
                              description: "Comprehensive review of current and emerging topics in finance, examining recent developments in financial markets, innovative investment strategies, and contemporary financial theory."
                            },
                            {
                              code: "FINE 691",
                              title: "Advanced Topics in Finance 2",
                              year: "2026",
                              description: "Advanced exploration of current and emerging topics in finance, covering cutting-edge research, innovative financial instruments, and contemporary market developments."
                            },
                            {
                              code: "FINE 671",
                              title: "Applied Finance Project",
                              year: "2026",
                              description: "Integrative finance project with three stages: DCM analyst role managing real investment funds, professional seminar series with industry experts, and independent research project under faculty supervision."
                            }
                          ]
                        }
                      ].map((category, categoryIndex) => (
                        <div
                          key={categoryIndex}
                          className={`relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group scroll-scale-in scroll-stagger-${categoryIndex + 1} visible`}
                        >
                          {/* App-like gradient overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(237, 27, 47, 0.05) 0%, transparent 50%, rgba(59, 130, 246, 0.05) 100%)' }}></div>
                          {/* Subtle inner glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/70" />
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
                                    className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 border border-white/30 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-full relative overflow-hidden group"
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
                      
                      {/* Academic Highlights Section - Within McGill Card */}
                      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 p-8 lg:p-12">
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-12 text-center">
                            Desautels Highlights
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                            <EducationCounter 
                              end={13000} 
                              prefix="$" 
                              label="Total MMF Scholarships & Awards" 
                              className="text-foreground"
                              delay={0}
                            />
                            <EducationCounter 
                              end={2500000} 
                              prefix="$" 
                              label="Student Investment Fund Stewardship" 
                              className="text-green-600"
                              delay={200}
                            />
                            <EducationCounter 
                              end={15} 
                              label="ESG Investment Assessments Conducted" 
                              className="text-blue-600"
                              delay={400}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // UNB specific content - Original layout restored
                <>
                  {/* UNB Achievement Categories - Modern Flowing Layout */}
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
                                  className="rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-full"
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

                  {/* UNB University Courses Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="space-y-8 sm:space-y-10">
                      {[
                        {
                          title: "Finance",
                          courseCount: 6,
                          courses: [
                            {
                              code: "BA 3425",
                              title: "Managerial Finance",
                              description: "Introduction to corporate financial management principles, including financial analysis, planning, and valuation techniques."
                            },
                            {
                              code: "BA 3426",
                              title: "Corporate Finance",
                              description: "Advanced study of corporate financial decision-making, covering capital budgeting, capital structure, and dividend policy."
                            },
                            {
                              code: "ADM 3435",
                              title: "Financial Markets & Institutions",
                              description: "Comprehensive analysis of Canadian financial markets, institutions, and their role in managing financial risks and opportunities."
                            },
                            {
                              code: "ADM 4445",
                              title: "Theory of Finance",
                              description: "Theoretical foundations of modern finance, including portfolio theory, asset pricing models, and corporate financial policy."
                            },
                            {
                              code: "ADM 4455",
                              title: "International Financial Management",
                              description: "Study of financial management in global markets, covering exchange rate risk, international capital budgeting, and cross-border investment decisions."
                            },
                            {
                              code: "ADM 4451",
                              title: "Student Investment Fund I",
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
                              description: "Introduction to quantitative methods for business decision-making, covering probability theory, statistical distributions, and decision analysis models."
                            },
                            {
                              code: "BA 2606",
                              title: "Business Decision Analysis II",
                              description: "Advanced quantitative techniques for business applications, including forecasting methods, simulation modeling, and optimization tools."
                            },
                            {
                              code: "BA 3623",
                              title: "Management Science: Deterministic Models",
                              description: "Study of deterministic optimization techniques including linear programming, integer programming, network analysis, and scheduling algorithms."
                            },
                            {
                              code: "ADM 3628",
                              title: "Advanced Statistics for Business",
                              description: "Advanced statistical methods and their applications in business decision-making, including regression analysis, time series, and multivariate techniques."
                            },
                            {
                              code: "MATH 1003",
                              title: "Introduction to Calculus I",
                              description: "Introduction to differential calculus of single variables with emphasis on business and economic applications."
                            },
                            {
                              code: "MATH 1853",
                              title: "Mathematics for Business",
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
                              description: "Introduction to microeconomic theory covering market mechanisms, supply and demand analysis, consumer behavior, and firm decision-making."
                            },
                            {
                              code: "ECON 1023",
                              title: "Introductory Macroeconomics",
                              description: "Study of macroeconomic principles including national income, economic growth, inflation, unemployment, and monetary and fiscal policy."
                            },
                            {
                              code: "ECON 2091",
                              title: "Contemporary Issues in the Canadian Economy I",
                              description: "Analysis of current economic issues affecting Canada, including unemployment, inflation, poverty, and regional economic development policies."
                            },
                            {
                              code: "ECON 3013",
                              title: "Intermediate Microeconomics",
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
                              description: "Introduction to financial accounting principles and practices for managerial decision-making and financial statement analysis."
                            },
                            {
                              code: "BA 1218",
                              title: "Accounting Lab",
                              description: "Practical application of accounting principles through hands-on exercises and case studies in financial accounting."
                            },
                            {
                              code: "BA 3235",
                              title: "Intermediate Accounting I",
                              description: "Advanced study of financial reporting standards, asset valuation, and revenue recognition principles in corporate accounting."
                            }
                          ]
                        },
                        {
                          title: "Operations & Strategy",
                          courseCount: 2,
                          courses: [
                            {
                              code: "BA 4101",
                              title: "Competitive Strategy",
                              description: "Capstone course in strategic management focusing on industry analysis, competitive positioning, and the development of sustainable competitive advantages."
                            },
                            {
                              code: "BA 3653",
                              title: "Operations Management I",
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
                              description: "Introduction to fundamental marketing concepts including consumer behavior analysis, market segmentation, and the strategic marketing mix framework."
                            },
                            {
                              code: "BA 3304",
                              title: "Marketing Management",
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
                              description: "Study of how information systems support business processes, decision-making, and competitive advantage in modern organizations."
                            },
                            {
                              code: "CS 1073",
                              title: "Introduction to Computer Programming I (Java)",
                              description: "Introduction to computer programming fundamentals using Java, covering control structures, data types, arrays, object-oriented programming, and inheritance."
                            }
                          ]
                        },
                        {
                          title: "Law & Ethics",
                          courseCount: 2,
                          courses: [
                            {
                              code: "PHIL 3153/3204",
                              title: "Business Ethics",
                              description: "Examination of ethical principles and moral reasoning in business contexts, covering corporate social responsibility and ethical decision-making frameworks."
                            },
                            {
                              code: "BA 3705",
                              title: "Business Law",
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
                              description: "Development of effective written and oral communication skills for professional business environments, including report writing and presentation techniques."
                            },
                            {
                              code: "ADM 2166",
                              title: "Business Communications II",
                              description: "Advanced business communication strategies focusing on professional report writing, proposal development, and persuasive presentation skills."
                            },
                            {
                              code: "FR 1203",
                              title: "Communicating in French I",
                              description: "Introduction to French language and communication skills, designed for students with limited prior French experience and aligned with CEFR A1 standards."
                            }
                          ]
                        },
                        {
                          title: "Political Science",
                          courseCount: 3,
                          courses: [
                            {
                              code: "POLS 1201",
                              title: "Intro to Canadian Politics",
                              description: "Introduction to Canadian political institutions, federalism, political parties, and electoral behavior in the Canadian political system."
                            },
                            {
                              code: "POLS 1301",
                              title: "Global Political Studies",
                              description: "Comparative analysis of political systems, institutions, and processes across different countries and political regimes."
                            },
                            {
                              code: "POLS 1603",
                              title: "Politics of Globalization",
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
                              description: "Introduction to logical reasoning, argument analysis, and critical thinking skills essential for academic and professional decision-making."
                            },
                            {
                              code: "CCS/COMS 1001",
                              title: "History of Communication",
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
                              description: "Study of individual, group, and organizational behavior in business settings, covering motivation, leadership, team dynamics, and organizational culture."
                            },
                            {
                              code: "UNIV 1003",
                              title: "Everything I Need to Know in First Year",
                              description: "First-year transition seminar focusing on academic success strategies, study skills, and campus engagement for new university students."
                            }
                          ]
                        }
                      ].map((category, categoryIndex) => (
              <div 
                key={categoryIndex} 
                          ref={categoryIndex === 0 ? unbCourseRef : undefined}
                          className={`relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-gradient-to-r from-gray-100/50 to-gray-200/50 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 scroll-scale-in scroll-stagger-${categoryIndex + 1} ${unbCourseVisibleItems.has(categoryIndex) ? 'visible' : ''}`}
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
                                    className="rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-full"
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
                      
                      {/* Academic Highlights Section - Within UNB Card */}
                      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 p-8 lg:p-12">
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-12 text-center">
                            UNB Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <EducationCounter 
                  end={47500} 
                  prefix="$" 
                  label="Total Scholarships & Awards" 
                  className="text-foreground"
                  delay={0}
                />
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3">1st Place</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">RBC Student Ambassador of the Month</div>
                </div>
                <EducationCounter 
                  end={40} 
                  label="Total Courses Completed" 
                  className="text-blue-600"
                  delay={400}
                />
                </div>
              </div>
            </div>
          </div>
        </div>

                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}