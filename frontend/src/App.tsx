import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ContactPage from './ContactPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import EmployeeLayout from './components/employee/EmployeeLayout';
import Dashboard from './pages/employee/Dashboard';
import MyRequests from './pages/employee/MyRequests';
import AtRisk from './pages/employee/AtRisk';
import RequestDetails from './pages/employee/RequestDetails';
import Notifications from './pages/employee/Notifications';
import Profile from './pages/employee/Profile';
import { useTheme } from './ThemeContext';
import { 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Gauge, 
  Lightbulb, 
  ListOrdered, 
  Target,
  CheckCircle2,
  ChevronDown,
  Users,
  Monitor,
  Headset,
  Settings,
  PieChart,
  Scale,
  ShoppingCart,
  Building2,
  Sun,
  Moon
} from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] text-gray-900 dark:text-gray-200 font-sans selection:bg-fuchsia-500/30 overflow-x-hidden">
      
      {/* Intro Star Animation Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 w-32 h-32 text-fuchsia-500 animate-star-zoom drop-shadow-[0_0_100px_rgba(217,70,239,1)]">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 bg-white/70 dark:bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 dark:bg-white p-1 rounded-md">
              <ShieldAlert size={20} className="text-white dark:text-[#0a0c10]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">DelayGuard</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4 text-sm font-medium">
            <ThemeToggle />
            <Link to="/login" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">Login</Link>
            <Link to="/signup" className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-fuchsia-500/25">
              Start for Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto z-10 flex flex-col items-center animate-hero-entry">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 dark:bg-white/5 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300 mb-8 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></span>
            New: Predictive Engine v2.0
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6 max-w-4xl">
            Never Miss a <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">Deadline Again.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Stop reacting to missed deadlines. DelayGuard predicts risks, explains why, and tells your team exactly what to fix first.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full mt-4">
            <Link to="/signup" className="w-full sm:w-auto bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-semibold px-8 py-3.5 rounded-full flex items-center justify-center transition-all shadow-lg shadow-indigo-500/25">
              Start for Free
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-gradient-to-r from-[#d946ef] to-[#a855f7] hover:from-[#c026d3] hover:to-[#9333ea] text-white font-semibold px-8 py-3.5 rounded-full flex items-center justify-center transition-all shadow-lg shadow-fuchsia-500/25">
              Book a Demo
            </Link>
          </div>
        </div>

      </section>

      {/* Integration Stripe Section */}
      <IntegrationStripe />

      {/* Departments Network Section */}
      <DepartmentNetwork />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-transparent border-t border-gray-200 dark:border-white/5 relative">
        <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Intelligence at Every Step</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Powerful AI tools designed for proactive SLA management.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Activity size={20} />} 
              title="SLA Risk Prediction" 
              desc="Predict the probability of a breach before it happens." 
            />
            <FeatureCard 
              icon={<MapPin size={20} />} 
              title="Explainable AI" 
              desc="Get clear, human-readable reasons for every risk score." 
            />
            <FeatureCard 
              icon={<Gauge size={20} />} 
              title="Bottleneck Detection" 
              desc="Identify exactly where processes are slowing down." 
            />
            <FeatureCard 
              icon={<Lightbulb size={20} />} 
              title="Smart Recommendations" 
              desc="Receive actionable steps to prevent delays." 
            />
            <FeatureCard 
              icon={<ListOrdered size={20} />} 
              title="Priority Ranking" 
              desc="Focus on what matters most based on risk and impact." 
            />
            <FeatureCard 
              icon={<Target size={20} />} 
              title="What-If Analysis" 
              desc="Simulate interventions to see their predicted effect." 
            />
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-transparent border-t border-gray-200 dark:border-white/5 relative">
        <ScrollReveal>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Transparent Pricing for Every Scale</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/5 flex flex-col h-full hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">Starter</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$49</span>
                <span className="text-gray-500 text-sm"> /mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Up to 1,000 requests/mo" />
                <PricingFeature text="Basic Risk Prediction" />
                <PricingFeature text="Email Support" />
              </ul>
              <button className="w-full py-3 rounded-lg bg-gray-100 dark:bg-[#1e2430] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-[#2a3140] transition-colors text-sm">
                Get Started
              </button>
            </div>

            {/* Professional (Highlighted) */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#161a22] border border-blue-500 dark:border-blue-500/50 shadow-xl shadow-blue-900/10 dark:shadow-2xl dark:shadow-blue-900/20 relative flex flex-col h-[105%] z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/30 dark:shadow-blue-900/50">
                Recommended
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">Professional</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$149</span>
                <span className="text-gray-500 text-sm"> /mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Up to 10,000 requests/mo" />
                <PricingFeature text="Advanced Explainable AI" />
                <PricingFeature text="Smart Recommendations" />
                <PricingFeature text="Priority Support" />
              </ul>
              <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-sm">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/5 flex flex-col h-full hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">Enterprise</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Unlimited requests" />
                <PricingFeature text="Custom AI Models" />
                <PricingFeature text="What-If Analysis" />
                <PricingFeature text="24/7 Dedicated Support" />
              </ul>
              <button className="w-full py-3 rounded-lg bg-gray-100 dark:bg-[#1e2430] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-[#2a3140] transition-colors text-sm">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-transparent border-t border-gray-200 dark:border-white/5">
        <ScrollReveal>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            <FAQItem 
              question="How does DelayGuard predict SLA breaches before they happen?" 
              answer="Our AI engine analyzes historical ticket data, current workload volumes, team capacity, and behavioral patterns to assign a real-time risk score to every open request."
            />
            <FAQItem 
              question="What systems does DelayGuard integrate with?" 
              answer="DelayGuard offers native integrations with ServiceNow, Jira Service Management, Zendesk, and Salesforce, along with a robust REST API for custom internal systems."
            />
            <FAQItem 
              question="Is our sensitive data secure?" 
              answer="Yes. DelayGuard is designed for enterprise and government use, featuring end-to-end encryption, SOC 2 Type II compliance, and options for on-premise or dedicated private cloud deployments."
            />
            <FAQItem 
              question="How do you provide 'Explainable AI'?" 
              answer="Unlike 'black box' AI, every risk prediction in DelayGuard comes with a breakdown of exactly which factors contributed to the score (e.g., 'Assigned agent has 40% higher backlog than average', or 'Historical data shows this request type takes 3 days longer in Q4')."
            />
            <FAQItem 
              question="How long does it take to see value from DelayGuard?" 
              answer="Most organizations begin seeing highly accurate predictions within 7-14 days after connecting their historical data, allowing the model to quickly adapt to your specific operational patterns."
            />
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 bg-transparent pt-16 pb-12 px-6">
        <ScrollReveal>
        <div className="max-w-6xl mx-auto mb-16 bg-white/50 dark:bg-[#161a22]/50 backdrop-blur-md border border-fuchsia-300 dark:border-fuchsia-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-lg dark:shadow-[0_0_40px_rgba(217,70,239,0.1)]">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Request info or schedule a demo</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">See how DelayGuard can transform your SLA management.</p>
          </div>
          <Link to="/contact" className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg shadow-fuchsia-500/25 whitespace-nowrap">
            Contact Us
          </Link>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-900 dark:bg-white p-1 rounded-md">
                <ShieldAlert size={20} className="text-white dark:text-[#0a0c10]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">DelayGuard</span>
            </div>
            <p className="text-xs text-gray-500">&copy; 2026 DelayGuard AI. All rights reserved.</p>
          </div>
          
          <div className="flex gap-16 md:gap-24">
            <div className="space-y-4 flex flex-col">
              <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Product</h5>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">SLA Guide</a>
            </div>
            <div className="space-y-4 flex flex-col">
              <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Documentation</h5>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <div className="space-y-4 flex flex-col">
              <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Terms of Service</h5>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}

// Subcomponents

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/5 hover:border-fuchsia-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-md">
      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
      <span className="leading-snug">{text}</span>
    </li>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="px-6 py-5 rounded-xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/5 cursor-pointer hover:border-gray-300 dark:hover:border-white/10 transition-all flex flex-col group shadow-sm dark:shadow-md"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center w-full">
        <h4 className="font-medium text-gray-900 dark:text-gray-300 group-hover:text-fuchsia-600 dark:group-hover:text-white transition-colors text-sm pr-4">{question}</h4>
        <ChevronDown size={18} className={`flex-shrink-0 text-gray-500 group-hover:text-fuchsia-600 dark:group-hover:text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

function DepartmentNetwork() {
  const departments = [
    { name: 'IT Support', icon: <Monitor className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', delay: '0s' },
    { name: 'HR Services', icon: <Users className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-[15%] left-[85%] -translate-x-1/2 -translate-y-1/2', delay: '0.2s' },
    { name: 'Customer Service', icon: <Headset className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-1/2 left-full -translate-x-1/2 -translate-y-1/2', delay: '0.4s' },
    { name: 'Operations', icon: <Settings className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-[85%] left-[85%] -translate-x-1/2 -translate-y-1/2', delay: '0.6s' },
    { name: 'Finance', icon: <PieChart className="w-5 h-5 md:w-6 md:h-6" />, pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', delay: '0.8s' },
    { name: 'Legal', icon: <Scale className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-[85%] left-[15%] -translate-x-1/2 -translate-y-1/2', delay: '1s' },
    { name: 'Procurement', icon: <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', delay: '1.2s' },
    { name: 'Revenue', icon: <Building2 className="w-5 h-5 md:w-6 md:h-6" />, pos: 'top-[15%] left-[15%] -translate-x-1/2 -translate-y-1/2', delay: '1.4s' },
  ];

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <ScrollReveal>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Your Organization on a <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">Single Intelligent Platform</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-24 max-w-2xl mx-auto">
          DelayGuard integrates seamlessly across all your departments, providing proactive SLA intelligence and bottleneck detection enterprise-wide.
        </p>

        <div className="relative w-full max-w-[280px] md:max-w-[500px] aspect-square mx-auto mt-10">
          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#d946ef" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Draw lines from center 50%,50% to the 8 points */}
            <line x1="50%" y1="50%" x2="50%" y2="0%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite]" />
            <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_0.2s]" />
            <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_0.4s]" />
            <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_0.6s]" />
            <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_0.8s]" />
            <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_1s]" />
            <line x1="50%" y1="50%" x2="0%" y2="50%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_1.2s]" />
            <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite_1.4s]" />
          </svg>

          {/* Center Logo/Platform */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 rounded-full bg-white dark:bg-gradient-to-br dark:from-[#1a103c] dark:to-[#0b0c20] border border-fuchsia-300 dark:border-fuchsia-500/40 flex items-center justify-center shadow-lg dark:shadow-[0_0_50px_rgba(217,70,239,0.3)] z-10">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-white p-2 md:p-3 rounded-xl inline-block mb-1 md:mb-2 shadow-md dark:shadow-white/10">
                <ShieldAlert className="text-gray-900 dark:text-[#0a0c10] w-5 h-5 md:w-8 md:h-8" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-[9px] md:text-sm tracking-wide">DelayGuard<br/>Engine</p>
            </div>
            
            {/* Center Ping */}
            <div className="absolute inset-0 rounded-full border border-fuchsia-400/50 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>

          {/* Department Nodes */}
          {departments.map((dept, i) => (
            <div key={i} className={`absolute ${dept.pos} flex flex-col items-center gap-2 group transition-all duration-500 hover:scale-110 z-20`}>
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:border-fuchsia-400 dark:group-hover:border-fuchsia-500/80 group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-300 shadow-md dark:shadow-xl relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] dark:group-hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
                {/* Subtle pulse behind icon */}
                <div className="absolute inset-0 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 transform group-hover:scale-110 transition-transform">{dept.icon}</div>
              </div>
              <span className="text-[9px] md:text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-fuchsia-100 transition-colors bg-white/90 dark:bg-[#0f0c29]/90 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-gray-200 dark:border-transparent group-hover:border-fuchsia-300 dark:group-hover:border-fuchsia-500/30 backdrop-blur-md whitespace-nowrap shadow-sm dark:shadow-lg">
                {dept.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      
      const percentage = Math.min(progress / duration, 1);
      const currentCount = Math.floor(end * easeOutExpo(percentage));
      
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function StatsSection() {
  const stats = [
    { end: 5, suffix: 'M+', label: 'SLAs Predicted', color: 'from-[#a855f7] to-[#ec4899]' },
    { end: 50, suffix: 'k+', label: 'Bottlenecks Resolved', color: 'from-[#6366f1] to-[#8b5cf6]' },
    { end: 120, suffix: '+', label: 'Enterprise Integrations', color: 'from-[#d946ef] to-[#8b5cf6]' },
    { end: 99, suffix: '%', label: 'Prediction Accuracy', color: 'from-[#ec4899] to-[#f43f5e]' },
  ];

  return (
    <section className="py-20 px-6 border-t border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#0f0c29]/50 relative z-10 backdrop-blur-sm">
      <ScrollReveal>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-12">
          Trusted by leading Operations & Service teams worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center">
              <span className={`text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-3 drop-shadow-sm`}>
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function IntegrationStripe() {
  const logos = [
    { name: 'DigiLocker', icon: 'https://www.google.com/s2/favicons?domain=digilocker.gov.in&sz=128' },
    { name: 'UMANG', icon: 'https://www.google.com/s2/favicons?domain=umang.gov.in&sz=128' },
    { name: 'Parivahan', icon: 'https://www.google.com/s2/favicons?domain=parivahan.gov.in&sz=128' },
    { name: 'CPGRAMS', icon: 'https://www.google.com/s2/favicons?domain=pgportal.gov.in&sz=128' },
    { name: 'MyGov', icon: 'https://www.google.com/s2/favicons?domain=mygov.in&sz=128' },
    { name: 'Digital India', icon: 'https://www.google.com/s2/favicons?domain=digitalindia.gov.in&sz=128' }
  ];

  return (
    <div className="w-full bg-gray-100/40 dark:bg-[#0a0c10]/40 border-y border-gray-200 dark:border-white/5 py-16 md:py-24 overflow-hidden relative z-10 backdrop-blur-sm flex flex-col items-center">
      <h3 className="text-gray-500 dark:text-gray-400 font-medium text-base md:text-lg mb-12 uppercase tracking-widest text-center">
        The world works with DelayGuard™
      </h3>
      <div className="w-full relative flex items-center">
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-gray-50 dark:from-[#0f0c29] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-gray-50 dark:from-[#24243e] to-transparent z-20 pointer-events-none"></div>
        
        <div className="flex animate-marquee whitespace-nowrap w-max items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              {logos.map((logo, idx) => (
                <div key={idx} className="flex items-center gap-5 mx-12 md:mx-20 group cursor-pointer">
                  <img 
                    src={logo.icon} 
                    alt={logo.name} 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-contain bg-white dark:bg-white/5 p-2 border border-gray-200 dark:border-white/10 group-hover:border-fuchsia-400 dark:group-hover:border-fuchsia-500/50 shadow-sm dark:shadow-lg transition-all duration-300" 
                  />
                  <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-200 uppercase tracking-widest transition-colors group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Employee Routes */}
      <Route element={<EmployeeLayout />}>
        <Route path="/employee/dashboard" element={<Dashboard />} />
        <Route path="/employee/requests" element={<MyRequests />} />
        <Route path="/employee/requests/:id" element={<RequestDetails />} />
        <Route path="/employee/at-risk" element={<AtRisk />} />
        <Route path="/employee/notifications" element={<Notifications />} />
        <Route path="/employee/profile" element={<Profile />} />
      </Route>

      {/* Admin Redirect */}
      <Route path="/admin/*" element={<Navigate to="/employee/dashboard" replace />} />
    </Routes>
  );
}
