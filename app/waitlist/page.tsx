'use client';

import { useState } from 'react';
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

  const audienceCards = [
    {
      type: 'student' as UserType,
      icon: GraduationCap,
      title: 'Students & Apprentices',
      description: 'Apprentice (4-5 years) or Challenge exam prep',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        { icon: MessageSquare, title: 'AI That Remembers You', desc: 'Red learns with you - remembers every conversation, quiz, and weak area over your entire journey' },
        { icon: TrendingUp, title: 'Smart Progress Tracking', desc: 'Tracks what you struggle with and recommends exactly what to study next based on YOUR performance' },
        { icon: Sparkles, title: 'Personalized Quizzes', desc: 'Auto-generated practice tests that adapt to your weak areas - gets smarter the more you use it' },
        { icon: Target, title: 'Real Exam Simulation', desc: 'Full 135-question practice exams that mirror actual Red Seal format and timing' },
        { icon: Upload, title: 'Upload Any Materials', desc: 'Upload images, notes, PDFs, documents - Red turns them into personalized practice questions' },
        { icon: Mic, title: 'Voice AI', desc: 'Study hands-free while working - Red remembers your voice conversations too' },
        { icon: Smartphone, title: 'Study Anywhere', desc: 'Mobile-friendly platform - study on breaks, commutes, or at the shop whenever you have time' },
        { icon: Briefcase, title: 'Job Connections', desc: 'Get matched with employers looking for your trade once you pass your Red Seal exam' }
      ],
      pricing: { amount: 'Free - $49.99', period: '/month', note: 'Starts free, upgrade as you progress' }
    },
    {
      type: 'employer' as UserType,
      icon: Building2,
      title: 'Employers',
      description: 'Find verified skilled workers faster',
      color: 'from-purple-500 to-pink-500',
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
      description: 'Your pathway to studying and working in Canada',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        { icon: Award, title: '99 Languages', desc: 'Study in your native language, test in English/French - Red Seal opens doors' },
        { icon: MapPin, title: 'Canadian Jobs', desc: 'Get matched with employers actively sponsoring foreign workers' },
        { icon: CheckCircle2, title: 'Verified Consultants', desc: 'Search verified RCICs specializing in trades - avoid immigration fraud and scams' },
        { icon: Users, title: 'Community Support', desc: 'Connect with other international workers who made the move successfully' },
        { icon: Briefcase, title: 'Credential Recognition', desc: 'Understand how your foreign credentials translate to Canadian Red Seal' },
        { icon: Target, title: 'Red Seal Prep', desc: 'Pass your Canadian trade certification exam - required for most provinces' },
        { icon: TrendingUp, title: 'Settlement Resources', desc: 'Housing, banking, healthcare guides for new immigrants' },
        { icon: MessageSquare, title: 'Direct Employer Chat', desc: 'Message employers directly - negotiate job offers before you arrive' }
      ],
      pricing: { amount: '$39', period: '/month', note: 'Fraction of traditional programs' }
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

              <h1 className="text-5xl lg:text-7xl font-bold mb-4 text-foreground leading-tight">
                Meet <span className="text-red-600">Red</span>, Your{' '}
                <span className="text-red-600">
                  <RotatingText />
                </span>
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
                Try Red Right Now
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick your trade and ask a question — see how Red helps you learn
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
              <HeroChat showCTAButtons={false} />
            </div>

            {/* Trust Stats - Moved Here */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-background border-2 border-primary/10">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">56</div>
                  <div className="text-sm font-medium text-muted-foreground">Red Seal Trades Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">99</div>
                  <div className="text-sm font-medium text-muted-foreground">Languages Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm font-medium text-muted-foreground">AI Tutor Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">85%+</div>
                  <div className="text-sm font-medium text-muted-foreground">Target Pass Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Selector */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Who Is Red For?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your role to see how Red can help you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16">
            {audienceCards.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedAudience === card.type;

              return (
                <button
                  key={card.type}
                  onClick={() => setSelectedAudience(card.type)}
                  className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xl shadow-primary/20 scale-105'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-lg'
                  }`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                  <div className="relative">
                    <div className={`inline-flex p-4 rounded-xl mb-4 transition-all ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4">
                      {card.description}
                    </p>

                    {isSelected ? (
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        <span>View Details</span>
                        <ArrowDown className="w-4 h-4 animate-bounce" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-primary/70 group-hover:text-primary font-medium text-sm transition-colors">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Benefits Section */}
          {selectedCard && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <div className={`relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br ${selectedCard.color} p-1`}>
                <div className="bg-background rounded-2xl p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <selectedCard.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-foreground">{selectedCard.title}</h3>
                      <p className="text-muted-foreground">{selectedCard.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {selectedCard.benefits.map((benefit, index) => {
                      const BenefitIcon = benefit.icon;
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <BenefitIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1 text-foreground">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedCard.pricing && (
                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-primary">{selectedCard.pricing.amount}</span>
                        <span className="text-lg text-muted-foreground">{selectedCard.pricing.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedCard.pricing.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
