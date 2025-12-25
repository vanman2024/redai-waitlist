'use client';

import { useState, useRef, useEffect } from 'react';
import { WaitlistHeader } from '@/components/waitlist/WaitlistHeader';
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter';
import { HeroChat } from '@/components/landing/hero-chat';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { RotatingText } from '@/components/landing/RotatingText';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Building2,
  Users,
  Globe,
  CheckCircle2,
  MessageSquare,
  Target,
  Upload,
  TrendingUp,
  Sparkles,
  Briefcase,
  UserCheck,
  Award,
  MapPin,
  ArrowRight,
  ArrowDown,
  Mic,
  Zap,
  Smartphone,
  Calendar
} from 'lucide-react';

type UserType = 'student' | 'employer' | 'immigration_consultant' | 'international_worker' | 'mentor' | null;

export default function WaitlistPage() {
  const [selectedAudience, setSelectedAudience] = useState<UserType>(null);
  const benefitsSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to benefits section when audience is selected (mobile fix)
  useEffect(() => {
    if (selectedAudience && benefitsSectionRef.current) {
      // Small delay to let the content render first
      setTimeout(() => {
        benefitsSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [selectedAudience]);

  const audienceCards = [
    {
      type: 'student' as UserType,
      icon: GraduationCap,
      title: 'Challenge & Apprentices',
      description: 'Challenge exam or 1-4 year apprentice prep',
      color: 'from-red-600 to-red-500',
      benefits: [
        { icon: Target, title: 'Challenge Pathway', desc: 'Experienced tradesperson? Study for your Red Seal challenge exam with simulations for Year 1-4 levels plus the final Red Seal exam' },
        { icon: Calendar, title: 'Apprenticeship Pathway', desc: 'Study for Year 1, 2, 3, and 4 apprentice exams with unlimited practice quizzes and test prep - master every level' },
        { icon: MessageSquare, title: 'AI That Remembers You', desc: 'Red learns with you - remembers every conversation, quiz, and weak area over your entire journey' },
        { icon: TrendingUp, title: 'Smart Progress Tracking', desc: 'Tracks what you struggle with and recommends exactly what to study next based on YOUR performance' },
        { icon: Sparkles, title: 'Personalized Practice Exams', desc: 'Generate quizzes and practice tests from your own uploaded content or AI-generated questions - adapts to your weak areas and gets smarter the more you use it' },
        { icon: CheckCircle2, title: 'Full Exam Simulation', desc: '135-question practice exams that mirror the actual Red Seal exam format, timing, and difficulty - know exactly what to expect on test day' },
        { icon: Upload, title: 'Upload Any Materials', desc: 'Upload images, notes, PDFs, documents - Red turns them into personalized practice questions' },
        { icon: Mic, title: 'Voice AI', desc: 'Study hands-free while working - Red remembers your voice conversations too' },
        { icon: Smartphone, title: 'Study Anywhere', desc: 'Mobile-friendly platform - study on breaks, commutes, or at the shop whenever you have time' },
        { icon: Briefcase, title: 'Job Connections', desc: 'Get matched with employers looking for apprentices and certified workers in your trade' }
      ],
      pricing: { amount: 'Free - $49.99', period: '/month', note: 'Starts free, upgrade as you progress' }
    },
    {
      type: 'employer' as UserType,
      icon: Building2,
      title: 'Employers',
      description: 'Find verified skilled workers faster',
      color: 'from-blue-500 to-cyan-600',
      benefits: [
        { icon: UserCheck, title: 'Verified Candidates', desc: 'Browse workers with verified skills and exam scores - no more resume padding' },
        { icon: Award, title: 'Apprentice to Red Seal', desc: 'Access candidates at all levels - from apprentices to certified journeymen' },
        { icon: Target, title: 'Smart Matching', desc: 'AI matches candidates by trade, location, experience, and availability' },
        { icon: TrendingUp, title: 'Pipeline Management', desc: 'Track candidates from application to hire in one dashboard' },
        { icon: MessageSquare, title: 'Direct Messaging', desc: 'Connect directly with candidates and schedule interviews instantly' },
        { icon: Globe, title: 'International Talent', desc: 'Hire foreign workers ready to immigrate - immigration consultants help with paperwork' },
        { icon: Briefcase, title: 'Post Jobs Free', desc: 'Unlimited job postings to reach thousands of skilled trades workers' },
        { icon: CheckCircle2, title: 'Skills Assessment', desc: 'See real quiz scores and study progress - know exactly what they know' }
      ],
      pricing: null
    },
    {
      type: 'immigration_consultant' as UserType,
      icon: Users,
      title: 'Immigration Consultants',
      description: 'Support clients\' Canadian journey',
      color: 'from-orange-500 to-red-500',
      benefits: [
        { icon: CheckCircle2, title: 'Verified RCIC Profile', desc: 'Get verified badge so workers know you\'re legitimate - prevent fraud and build trust' },
        { icon: Globe, title: 'Pre-Qualified Leads', desc: 'Connect with workers serious about immigrating to Canada' },
        { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor client exam prep and credential recognition in real-time' },
        { icon: Briefcase, title: 'Job Matching', desc: 'Help clients secure job offers before arrival - critical for work permits' },
        { icon: Award, title: 'Referral Revenue', desc: 'Earn recurring commission for every student and worker you refer' },
        { icon: MessageSquare, title: 'Direct Client Portal', desc: 'Manage all clients in one dashboard with messaging and document sharing' },
        { icon: MapPin, title: 'Settlement Support', desc: 'Connect clients with housing, banking, and community resources' },
        { icon: Users, title: 'Employer Network', desc: 'Access employers actively sponsoring foreign workers in skilled trades' }
      ],
      pricing: null
    },
    {
      type: 'international_worker' as UserType,
      icon: Globe,
      title: 'International Students',
      description: 'Master Canadian terminology in your own language',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        { icon: Award, title: 'Study in Your Language', desc: 'Learn Red Seal material in your native language with side-by-side English/French terminology comparisons' },
        { icon: Mic, title: 'Audio Pronunciation', desc: 'Hear Canadian trade terms pronounced correctly - bridge the language gap with audio support for technical vocabulary' },
        { icon: Globe, title: 'Terminology Comparisons', desc: 'Side-by-side comparisons of trade terms from your country vs Canada - understand the differences clearly' },
        { icon: Target, title: 'Canadian Red Seal Prep', desc: 'Master Canadian trade certification exam in your own language, then test in English/French with confidence' },
        { icon: MapPin, title: 'Canadian Jobs', desc: 'Get matched with employers actively sponsoring foreign workers once you understand Canadian standards' },
        { icon: CheckCircle2, title: 'Verified Consultants', desc: 'Search verified RCICs specializing in trades - avoid immigration fraud and scams' },
        { icon: Briefcase, title: 'Credential Recognition', desc: 'Understand how your foreign credentials translate to Canadian Red Seal standards and requirements' },
        { icon: MessageSquare, title: 'Direct Employer Chat', desc: 'Message employers directly - negotiate job offers before you arrive in Canada' }
      ],
      pricing: { amount: '$39', period: '/month', note: 'Proper study support, not a shortcut' }
    },
    {
      type: 'mentor' as UserType,
      icon: Award,
      title: 'Mentors & Instructors',
      description: 'Share your knowledge with the next generation',
      color: 'from-yellow-500 to-amber-500',
      benefits: [
        { icon: Users, title: 'Connect with Apprentices', desc: 'Share your expertise with students learning your trade' },
        { icon: Award, title: 'Build Your Reputation', desc: 'Get recognized as an expert in the skilled trades community' },
        { icon: MessageSquare, title: 'Support & Guide', desc: 'Help the next generation succeed in their careers' },
        { icon: TrendingUp, title: 'Track Impact', desc: 'See how your guidance helps apprentices progress' }
      ],
      pricing: null
    }
  ];

  const selectedCard = audienceCards.find(card => card.type === selectedAudience);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <WaitlistHeader />

      <main className="flex-1">
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.1),transparent_50%)]" />

          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Decorative Circles */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 animate-pulse-red">
                <Zap className="w-4 h-4" />
                Launching Soon
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                Meet <span className="text-red-600">Red</span>, Your AI{' '}
                <span className="text-red-600">
                  <RotatingText />
                </span>
                <br />
                for the Skilled Trades
              </h1>

              <p className="text-2xl lg:text-3xl font-semibold text-muted-foreground mb-6">
                Your Complete Platform for Skilled Trades
              </p>

              <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Join the waitlist for AI-powered exam prep, job matching, and career support — all in one place
              </p>

              <Button
                size="lg"
                className="h-14 px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-gradient-to-b from-background via-muted/30 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Try <span className="text-red-600">Red</span> Right Now
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick your trade and ask a question — see how Red helps you learn
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
              <HeroChat showCTAButtons={false} />
            </div>

            {/* Trust Stats - Redesigned */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900/80 transition-all text-center">
                  <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-red-500 to-orange-600 bg-clip-text text-transparent mb-3">56</div>
                  <div className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Red Seal Trades Covered</div>
                </div>
                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all text-center">
                  <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-orange-500 to-amber-600 bg-clip-text text-transparent mb-3">99</div>
                  <div className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Languages Supported</div>
                </div>
                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900/80 transition-all text-center">
                  <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent mb-3">24/7</div>
                  <div className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">AI Tutor Available</div>
                </div>
                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/80 transition-all text-center">
                  <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-3">85%+</div>
                  <div className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Target Pass Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Get Your Red Seal Section */}
        <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                  Why Get Your <span className="text-red-600">Red Seal</span>?
                </h2>
                <p className="text-lg lg:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                  You might be thinking: "Why do I need this extra step?" Here's why it's worth it:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex-shrink-0 group-hover:scale-110 transition-all shadow-lg shadow-orange-500/20">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">Work Anywhere in Canada</h3>
                      <p className="text-zinc-400">
                        Interprovincial mobility means you can take jobs across all provinces and territories without re-certifying. No borders, no limitations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex-shrink-0 group-hover:scale-110 transition-all shadow-lg shadow-orange-500/20">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">Earn 15-25% More</h3>
                      <p className="text-zinc-400">
                        Red Seal certified workers command higher wages. That extra step pays for itself many times over throughout your career.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900/80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex-shrink-0 group-hover:scale-110 transition-all shadow-lg shadow-red-500/20">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">International Recognition</h3>
                      <p className="text-zinc-400">
                        Your Red Seal is recognized globally. Work opportunities in the US, Australia, and other countries open up with this credential.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900/80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex-shrink-0 group-hover:scale-110 transition-all shadow-lg shadow-pink-500/20">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">More Career Options</h3>
                      <p className="text-zinc-400">
                        Fly-in/fly-out jobs, major contractors, interprovincial projects — Red Seal opens doors you didn't know existed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex-shrink-0 group-hover:scale-110 transition-all shadow-lg shadow-orange-500/20">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">Job Security & Advancement</h3>
                      <p className="text-zinc-400">
                        Red Seal certification gives you leverage in negotiations, first pick of the best positions, and a clear path to supervisory roles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex-shrink-0 group-hover:scale-110 transition-all shadow-lg shadow-amber-500/20">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">Professional Credibility</h3>
                      <p className="text-zinc-400">
                        Even if you plan to stay in your province, Red Seal proves your expertise and gives you options when opportunities arise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-lg lg:text-xl font-semibold text-white mb-2">
                  Even if you plan to stay local, Red Seal opens doors you didn't know existed.
                </p>
                <p className="text-zinc-400">
                  It's not just about where you can work — it's about having the freedom to choose your best opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Selector */}
        <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                Who Is <span className="text-red-600">Red</span> For?
              </h2>
              <p className="text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto">
                Select your role to see how Red can help you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16 items-stretch">
              {audienceCards.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedAudience === card.type;

                return (
                  <button
                    key={card.type}
                    onClick={() => setSelectedAudience(card.type)}
                    className={`group relative p-8 rounded-2xl transition-all duration-300 text-left h-full flex flex-col ${
                      isSelected
                        ? 'bg-gradient-to-br ' + card.color + ' shadow-2xl scale-105'
                        : 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700 hover:shadow-xl'
                    }`}
                  >
                    <div className="relative flex flex-col h-full">
                      <div className={`inline-flex p-4 rounded-xl mb-4 transition-all ${
                        isSelected
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-gradient-to-br ' + card.color + ' shadow-lg'
                      }`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-white transition-colors">
                        {card.title}
                      </h3>

                      <p className="text-sm text-zinc-400 mb-4 flex-grow">
                        {card.description}
                      </p>

                      <div className={`flex items-center gap-2 font-medium text-sm transition-colors mt-auto ${
                        isSelected
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-white'
                      }`}>
                        <span>View Details</span>
                        <ArrowDown className={`w-4 h-4 transition-transform ${isSelected ? 'animate-bounce' : ''}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Benefits Section */}
            {selectedCard && (
              <div ref={benefitsSectionRef} className="max-w-5xl mx-auto animate-fade-in">
                <div className="relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedCard.color} shadow-lg`}>
                      <selectedCard.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{selectedCard.title}</h3>
                      <p className="text-zinc-400">{selectedCard.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {selectedCard.benefits.map((benefit, index) => {
                      const BenefitIcon = benefit.icon;
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors border border-zinc-800/50">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedCard.color} flex-shrink-0 shadow-md`}>
                            <BenefitIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1 text-white">{benefit.title}</h4>
                            <p className="text-sm text-zinc-400">{benefit.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedCard.pricing && (
                    <div className="p-6 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">{selectedCard.pricing.amount}</span>
                        <span className="text-lg text-zinc-400">{selectedCard.pricing.period}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{selectedCard.pricing.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Waitlist Form Section */}
        <div id="waitlist-form" className="bg-gradient-to-b from-background via-muted/20 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                  Join the Waitlist
                </h2>
                <p className="text-lg text-muted-foreground">
                  Be first to access Red. Early members get exclusive pricing.
                </p>
              </div>

              <WaitlistForm defaultUserType={selectedAudience} />

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  By joining, you'll receive launch updates and early access. We respect your privacy and won't spam.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <WaitlistFooter />
    </div>
  );
}
