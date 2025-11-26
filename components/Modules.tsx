import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FEATURED_JOBS, TOP_UNIVERSITIES, COUNTRIES, AI_TOOLS, COURSES, FREELANCE_GIGS, CONSULTANTS_LIST } from '../constants';
import { Button, Card, Badge, Input, TextArea } from './ui';
import { checkStudyAbroadEligibility, analyzeResume, generateSOP, submitAIAccessRequest } from '../services/geminiService';
import { 
  MapPin, IndianRupee, BookOpen, Star, 
  ArrowRight, ShieldCheck, Sparkles, Upload, 
  FileText, Copy, CheckCircle, GraduationCap,
  Globe2, TrendingUp, Briefcase,
  Cpu, LibraryBig, LayoutGrid, Handshake,
  UserCheck, Bot, MapPinned, Search, User, Send,
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Lock, FileQuestion, HelpCircle,
  X, Globe
} from 'lucide-react';
import { AppRoute } from '../types';

// --- DASHBOARD COMPONENT ---
const Dashboard = () => {
  const navigate = useNavigate();

  // Updated workflow steps with links
  const JOURNEY_STEPS = [
    {
      step: "01",
      title: "Sign Up",
      desc: "Create your unified profile.",
      icon: User,
      link: AppRoute.CONSULTANTS,
    },
    {
      step: "02",
      title: "Browse",
      desc: "Explore curated opportunities.",
      icon: Search,
      link: AppRoute.JOBS,
    },
    {
      step: "03",
      title: "Connect",
      desc: "Directly apply or reach out.",
      icon: Send,
      link: AppRoute.CONSULTANTS,
    },
    {
      step: "04",
      title: "Grow",
      desc: "Get hired & earn badges.",
      icon: TrendingUp,
      link: AppRoute.LEARNING,
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* 1. HERO SECTION - DARK GREY WITH VIDEO */}
<section className="relative min-h-[650px] flex items-center justify-center px-4 lg:px-8 py-12 overflow-hidden bg-gray-800">
  {/* Background video */}
  <video
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
  >
    <source
      src="/assets/hero_bg.mp4"
      type="video/mp4"
    />
    {/* Optional fallback text */}
    Your browser does not support the video tag.
  </video>

  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/60" />
        {/* Dark Grey Glass Container */}
        <div className="relative z-10 max-w-5xl w-full bg-gray-900/80 backdrop-blur-[20px] rounded-[3rem] border border-gray-700/60 shadow-2xl p-10 lg:p-16 text-center overflow-hidden">
          
          <Badge color="orange" className="mb-6 inline-flex mx-auto bg-orange-500/20 backdrop-blur-md text-orange-300 border-orange-500/30 px-4 py-1.5 text-sm font-bold shadow-sm">
            An Global Career Platform
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
            Empowering Your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9500] to-orange-400">Career, Globally.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Jobs, Internships, Study Abroad, Freelancing, AI Tools & Learning 
            Your unified ecosystem to bridge the gap between ambition and achievement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => navigate(AppRoute.JOBS)} variant="primary" className="px-8 py-4 text-base rounded-2xl shadow-xl shadow-orange-500/30 hover:scale-105">
              Explore Opportunities
            </Button>
            <Button onClick={() => navigate(AppRoute.LEARNING)} variant="glass" className="px-8 py-4 text-base rounded-2xl bg-white/20 text-white hover:bg-white/30 border-white/30 hover:scale-105">
              Upskill & Learn
            </Button>
            <Button onClick={() => navigate(AppRoute.AI_MARKETPLACE)} variant="ghost" className="px-8 py-4 text-base font-bold text-gray-300 hover:bg-white/10 rounded-2xl">
              AI-Agents & Products
            </Button>
          </div>

          {/* Decorative Floating Elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 -right-10 w-40 h-40 bg-[#FF9500]/30 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW SECTION - SLATE GREY */}
      <section className="relative min-h-[650px] flex items-center justify-center px-4 lg:px-8 py-12 overflow-hidden bg-gray-800">
        <div className="bg-gradient-to-br from-[#FF9500] to-orange-700 rounded-[2.5rem] p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-400/30">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-slate-200 font-medium">
              One platform, endless possibilities. Choose your path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: "Study Abroad", icon: Globe2, path: AppRoute.STUDY_ABROAD, desc: "Universities, SOPs & Visa.", color: "text-blue-300 bg-blue-900/40" },
              { title: "Jobs & Internships", icon: Briefcase, path: AppRoute.JOBS, desc: "Remote & Local Roles.", color: "text-green-300 bg-green-900/40" },
              { title: "Freelancing", icon: Handshake, path: AppRoute.FREELANCE, desc: "Gigs & Buyer Requests.", color: "text-purple-300 bg-purple-900/40" },
              { title: "Learning", icon: BookOpen, path: AppRoute.LEARNING, desc: "Courses & Certs.", color: "text-pink-300 bg-pink-900/40" },
              { title: "AI Tools", icon: Cpu, path: AppRoute.AI_MARKETPLACE, desc: "SaaS & Automation.", color: "text-orange-300 bg-orange-900/40" }
            ].map((service, i) => (
              <Card
                key={i}
                className="p-6 text-center group cursor-pointer bg-gray-900/60 hover:bg-gray-900/70 border-slate-400/70 backdrop-blur-sm hover:-translate-y-2 transition-transform text-white"
                onClick={() => navigate(service.path)}
              >
                <div
                  className={`h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm ${service.color}`}
                >
                  <service.icon size={32} />
                </div>
                <h3 className="font-bold text-white mb-1">{service.title}</h3>
                <p className="text-xs text-slate-400 font-medium">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WORKFLOW SECTION WITH LINKS */}
      <section className="px-4 lg:px-8 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/60 to-slate-600/60 -skew-y-3 transform origin-top-left scale-110 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="blue" className="mb-3 bg--700/80 text-slate-700 border-slate-500">How It Works</Badge>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Your Journey to Success</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 z-0"></div>

            {JOURNEY_STEPS.map((item) => (
              <div
                key={item.step}
                className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                onClick={() => navigate(item.link)}
              >
                <div className="h-24 w-24 bg-slate-100/80 backdrop-blur-xl rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon
                    size={32}
                    className="text-gray-700 group-hover:text-[#FF9500] transition-colors"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF9500] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 px-4 underline decoration-dotted group-hover:text-[#FF9500]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES */}
      <section className="px-4 lg:px-8 py-16 max-w-7xl mx-auto space-y-12">
        
        {/* Featured Jobs */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Trending Jobs</h3>
              <p className="text-gray-500 text-sm">Top verified roles curated for you.</p>
            </div>
          
            <Button variant="ghost" onClick={() => navigate(AppRoute.JOBS)} className="text-[#FF9500]">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_JOBS.slice(0, 3).map(job => (
              <Card key={job.id} className="p-6 hover:shadow-xl transition-all border border-slate-200 hover:border-orange-200 bg-slate-50/50 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-gray-700 border border-slate-300">
                    {job.company.charAt(0)}
                  </div>
                  <Badge color={job.type === 'Remote' ? 'green' : 'blue'}>{job.type}</Badge>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h4>
                <p className="text-xs text-gray-500 mb-4">{job.company} • {job.location}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="font-bold text-gray-900 text-sm">{job.salary}</span>
                  <Button variant="primary" className="py-1.5 px-4 text-xs h-auto rounded-lg">Apply</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Courses - ORANGE CONTAINER */}
        <div className="bg-orange-500 rounded-3xl p-8 lg:p-10 border border-orange-100 shadow-sm">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-orange-50">Popular Courses</h3>
              <p className="text-orange-300 text-sm">
                Upskill with industry-recognized certifications.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(AppRoute.LEARNING)}
              className="text-[#FF9500] bg-white hover:bg-orange-100 rounded-full px-5 py-2"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.slice(0, 3).map((course) => (
              <Card
                key={course.id}
                className="p-0 overflow-hidden border border-orange-100 shadow-lg hover:shadow-2xl transition-all bg-white/70 backdrop-blur-sm"
              >
                <div className="h-32 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 bg-black/20"></div>
                   <LibraryBig className="text-white/20" size={48} />
                   <Badge color="purple" className="absolute top-3 right-3">{course.level}</Badge>
                </div>
                <div className="p-5">
                   <h4 className="font-bold text-gray-900 mb-1 truncate">{course.title}</h4>
                   <p className="text-xs text-gray-500 mb-4">{course.instructor}</p>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
                        <Star size={12} fill="currentColor"/> {course.rating}
                      </div>
                      <span className="text-xs font-bold text-gray-400">{course.duration}</span>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-20 bg-gray-900/70 backdrop-blur-lg border-y border-gray-700/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-200">Join thousands of professionals growing with Sunshine.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah J.", role: "Software Engineer", quote: "Sunshine helped me land my dream remote job in London within 2 weeks! The AI resume tool is a lifesaver.", image: "https://picsum.photos/100/100?random=20" },
              { name: "Mike T.", role: "Masters Student", quote: "The SOP generator gave me a perfect draft for my application to Germany. Highly recommended for students!", image: "https://picsum.photos/100/100?random=21" },
              { name: "Priya K.", role: "Freelance Designer", quote: "I found my first 3 international clients here. The platform is secure and the leads are genuine.", image: "https://picsum.photos/100/100?random=22" }
            ].map((story, i) => (
              <Card key={i} className="p-8 bg-slate-50/60 hover:bg-slate-100/80 transition-colors border-slate-200/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <img src={story.image} alt={story.name} className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{story.name}</h4>
                    <p className="text-xs text-[#FF9500] font-bold uppercase">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed text-sm">"{story.quote}"</p>
                <div className="mt-6 flex gap-1">
                  {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-yellow-400" fill="currentColor" />)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER / CTA */}
      <section className="px-4 lg:px-8 py-20 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#FF9500] to-orange-700 rounded-[2.5rem] p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/30">
           <div className="relative z-10">
             <h2 className="text-3xl lg:text-4xl font-black mb-4">Stay Ahead of the Curve</h2>
             <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">Get the latest remote jobs, scholarships, and AI tools delivered to your inbox weekly.</p>
             <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
               <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-200 focus:outline-none focus:bg-white/20 backdrop-blur-md" />
               <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-lg">Subscribe</button>
             </div>
           </div>
           
           {/* Decorative */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>
      
      {/* 7. FOOTER */}
      <footer className="bg-gray-900 text-white/60 pt-16 pb-8 rounded-t-[3rem] mt-10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              {/* Logo without glass background */}
              <div className="h-32 w-38 flex items-center justify-center mb-4">
                <img 
                  src="/assets/logo_footer.png" 
                  alt="Sunshine Careers" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    console.log('Logo failed to load');
                    e.target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'h-full w-full bg-gradient-to-br from-[#FF9500] to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl';
                    placeholder.innerHTML = `
                      <div class="text-center">
                        <div class="text-3xl font-bold">SC</div>
                        <div class="text-sm mt-2 font-medium">Sunshine Careers</div>
                      </div>
                    `;
                    e.target.parentNode.appendChild(placeholder);
                  }}
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">Empowering global careers through technology and verified opportunities.</p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-[#FF9500] transition-colors"><Icon size={20} /></a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><NavLink to={AppRoute.STUDY_ABROAD} className="hover:text-white transition-colors">Study Abroad</NavLink></li>
              <li><NavLink to={AppRoute.JOBS} className="hover:text-white transition-colors">Jobs & Internships</NavLink></li>
              <li><NavLink to={AppRoute.FREELANCE} className="hover:text-white transition-colors">Freelance Market</NavLink></li>
              <li><NavLink to={AppRoute.AI_MARKETPLACE} className="hover:text-white transition-colors">AI Tools</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><NavLink to={AppRoute.ABOUT} className="hover:text-white transition-colors">About Us</NavLink></li>
              <li><NavLink to={AppRoute.SUCCESS_STORIES} className="hover:text-white transition-colors">Success Stories</NavLink></li>
              <li><NavLink to={AppRoute.CONSULTANTS} className="hover:text-white transition-colors">Consultants</NavLink></li>
              <li><NavLink to={AppRoute.PARTNER_WITH_US} className="hover:text-white transition-colors">Partner With Us</NavLink></li>
              <li><NavLink to={AppRoute.CONTACT} className="hover:text-white transition-colors">Contact</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><NavLink to={AppRoute.HELP} className="hover:text-white transition-colors">Help Center</NavLink></li>
              <li><NavLink to={AppRoute.PRIVACY} className="hover:text-white transition-colors">Privacy Policy</NavLink></li>
              <li><NavLink to={AppRoute.TERMS} className="hover:text-white transition-colors">Terms of Service</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-xs font-medium">
          &copy; 2024 Sunshine Careers & Consulting Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// --- STUDY ABROAD COMPONENT ---
const StudyAbroad = () => {
  // Eligibility State
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // SOP State
  const [sopData, setSopData] = useState({ university: '', course: '', background: '' });
  const [generatedSop, setGeneratedSop] = useState('');
  const [loadingSop, setLoadingSop] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCheckEligibility = async () => {
    setLoading(true);
    const result = await checkStudyAbroadEligibility({
      gpa: "3.6",
      country: "UK",
      degree: "Masters in Computer Science",
      englishScore: "IELTS 7.5"
    });
    setEligibilityResult(JSON.parse(result));
    setLoading(false);
  };

  const handleGenerateSop = async () => {
    if (!sopData.university || !sopData.course || !sopData.background) return;
    setLoadingSop(true);
    const result = await generateSOP(sopData);
    setGeneratedSop(result);
    setLoadingSop(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSop);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section - Updated Visuals */}
      <section className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-10 lg:p-14 text-white shadow-2xl shadow-orange-900/10 relative overflow-hidden border border-white/10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge color="orange" className="mb-6 inline-flex items-center gap-1.5 bg-[#FF9500]/20 text-[#FF9500] border-[#FF9500]/30 px-3 py-1 backdrop-blur-md">
              <Sparkles size={14}/> AI Powered Analysis
            </Badge>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              Your Global Education <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9500] to-orange-400">Journey Starts Here</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
              Analyze your profile, generate SOPs, and find your dream university with the power of Gemini AI.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <div className="p-2 rounded-lg bg-[#FF9500]/20 text-[#FF9500]"><CheckCircle size={20}/></div>
               Instant Eligibility Check
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</label>
                  <input type="text" defaultValue="United Kingdom" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF9500] focus:ring-1 focus:ring-[#FF9500] transition-all backdrop-blur-md" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">GPA / Score</label>
                  <input type="text" defaultValue="8.5 CGPA" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF9500] focus:ring-1 focus:ring-[#FF9500] transition-all backdrop-blur-md" />
               </div>
             </div>
             <Button onClick={handleCheckEligibility} disabled={loading} className="w-full bg-[#FF9500] hover:bg-orange-600 border-none text-white shadow-lg shadow-orange-500/20 py-3 text-sm">
               {loading ? 'Analyzing Profile...' : 'Calculate Admission Chances'}
             </Button>

             {eligibilityResult && (
                <div className="mt-6 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in slide-in-from-bottom-2 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-green-500/30">
                      {eligibilityResult.eligibilityScore}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Excellent Profile!</h4>
                      <p className="text-sm text-green-200/80">You have a high chance of admission.</p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-[#FF9500]/10 rounded-full blur-[120px]" />
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </section>

      {/* SOP Generator Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 flex items-center justify-center shadow-lg shadow-purple-200/50">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900">AI SOP Writer</h3>
            <p className="text-gray-500 font-medium">Generate a professional Statement of Purpose in seconds.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 space-y-6 bg-white/60 backdrop-blur-xl border-white/60">
             <div>
               <h4 className="font-bold text-gray-900 mb-6 text-lg flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-[#FF9500] rounded-full"></div>
                 Enter Details
               </h4>
               <div className="space-y-5">
                 <Input 
                   label="Target University" 
                   placeholder="e.g. Oxford University" 
                   value={sopData.university}
                   onChange={(e) => setSopData({...sopData, university: e.target.value})}
                 />
                 <Input 
                   label="Target Course" 
                   placeholder="e.g. MSc Data Science" 
                   value={sopData.course}
                   onChange={(e) => setSopData({...sopData, course: e.target.value})}
                 />
                 <TextArea 
                   label="Your Background" 
                   placeholder="Briefly describe your academics, work experience, and motivations..." 
                   rows={5}
                   className="resize-none"
                   value={sopData.background}
                   onChange={(e) => setSopData({...sopData, background: e.target.value})}
                 />
               </div>
             </div>
             <Button 
               onClick={handleGenerateSop} 
               disabled={loadingSop || !sopData.university} 
               className="w-full py-3.5 shadow-xl shadow-orange-500/20"
               variant="primary"
             >
               {loadingSop ? (
                 <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Writing...
                 </span>
               ) : (
                 <span className="flex items-center gap-2"><Sparkles size={16}/> Generate Statement of Purpose</span>
               )}
             </Button>
          </Card>

          <Card className="p-8 bg-white/40 border border-white/60 relative flex flex-col min-h-[500px] shadow-inner backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
               <h4 className="font-bold text-gray-800 text-lg">Generated Draft</h4>
               {generatedSop && (
                 <Button variant="glass" onClick={copyToClipboard} className="text-xs h-9 bg-white/50 text-gray-700 hover:text-[#FF9500]">
                   {copied ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Copied</span> : <span className="flex items-center gap-2"><Copy size={14}/> Copy Text</span>}
                 </Button>
               )}
            </div>
            {generatedSop ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line animate-in fade-in bg-white/50 p-6 rounded-xl border border-white/60 shadow-sm h-full overflow-y-auto custom-scrollbar">
                {generatedSop}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium">Fill the form to let AI write your SOP</p>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Universities Grid */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Top Rated Universities</h3>
            <p className="text-gray-500 mt-1">Curated institutions for your next big step.</p>
          </div>
          <Button variant="ghost" className="text-[#FF9500] font-bold">View All Universities</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOP_UNIVERSITIES.map((uni) => (
            <Card key={uni.id} className="overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 border-0 ring-1 ring-gray-200/50 bg-white/70 backdrop-blur-md">
              <div className="h-52 relative overflow-hidden">
                <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Star size={10} className="text-[#FF9500] fill-[#FF9500]"/> Rank #{uni.ranking}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                   <p className="flex items-center gap-1.5 text-xs font-bold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                     <MapPin size={10}/> {uni.country}
                   </p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#FF9500] transition-colors">{uni.name}</h4>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Tuition</p>
                    <span className="text-sm font-bold text-gray-900">{uni.tuition}</span>
                  </div>
                  <Button variant="secondary" className="h-9 w-9 p-0 rounded-full flex items-center justify-center bg-gray-900 text-white hover:bg-[#FF9500] transition-colors shadow-lg">
                    <ArrowRight size={14}/>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- JOBS & INTERNSHIPS COMPONENT ---
const JobPortal = ({ isInternship = false }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsAnalyzing(true);
      const fakeResumeText = "Experienced React developer with 5 years experience in TypeScript...";
      const result = await analyzeResume(fakeResumeText, "Looking for Senior React Developer with Redux experience");
      setAnalysis(JSON.parse(result));
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {isInternship ? 'Kickstart Your Career' : 'Find Your Next Role'}
          </h2>
          <p className="text-gray-500 font-medium">Explore thousands of {isInternship ? 'internships' : 'jobs'} curated for you.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <Input placeholder="Search role, skill, or company..." className="min-w-[300px]" />
          <Button className="px-8 shadow-lg shadow-orange-500/20">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <Card className="p-6">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
               <TrendingUp size={18} className="text-[#FF9500]" /> Filters
            </h4>
            <div className="space-y-4">
              {['Remote', '₹10L+ Salary', 'Full Time', 'Startup'].map((filter, i) => (
                <label key={i} className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FF9500] focus:ring-[#FF9500]" /> 
                  <span className="group-hover:translate-x-1 transition-transform">{filter}</span>
                </label>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-blue-100/50">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Upload size={18} /> Resume Matcher
            </h4>
            <p className="text-xs text-blue-700 mb-4 leading-relaxed font-medium">AI analyzes your CV against these job listings to find your best fit.</p>
            <label className="block w-full cursor-pointer group">
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center group-hover:border-blue-500 group-hover:bg-blue-100/50 transition-all bg-white/50">
                 <p className="text-xs font-bold text-blue-600">Click to Upload PDF</p>
              </div>
              <input 
                type="file" 
                accept=".pdf,.txt"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>
            {isAnalyzing && (
              <div className="mt-4 flex items-center gap-2 text-xs text-blue-800 font-bold justify-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
                Analyzing via Gemini...
              </div>
            )}
            {analysis && (
              <div className="mt-4 pt-4 border-t border-blue-200 animate-in fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-900">Match Score</span>
                  <Badge color={analysis.score > 70 ? 'green' : 'orange'}>{analysis.score}%</Badge>
                </div>
                <p className="text-xs text-blue-800 italic bg-white/50 p-3 rounded-lg border border-blue-100">"{analysis.advice}"</p>
              </div>
            )}
          </Card>
        </div>

        {/* Listings */}
        <div className="lg:col-span-3 space-y-5">
          {FEATURED_JOBS.map(job => (
            <Card key={job.id} className="p-6 cursor-pointer group hover:bg-orange-50/10 transition-all border border-transparent hover:border-orange-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-5">
                   <div className="h-16 w-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl font-bold text-gray-800 group-hover:scale-105 transition-transform">
                      {job.company.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF9500] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mb-3">{job.company}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100/80 px-2.5 py-1 rounded-md font-medium"><MapPin size={12} /> {job.location}</span>
                        <span className="flex items-center gap-1 bg-green-50/80 text-green-700 px-2.5 py-1 rounded-md border border-green-100 font-medium">{job.salary}</span>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                   <Badge color="blue">{job.type}</Badge>
                   <Button variant="primary" className="text-xs px-6 w-full md:w-auto shadow-none hover:shadow-lg py-2">Apply Now</Button>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100/50 flex gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-gray-500 border border-gray-200/60 bg-gray-50/50 px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COUNTRY EXPLORER ---
const CountryExplorer = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-extrabold text-gray-900">Explore Destinations</h2>
      <div className="flex gap-3">
        <Button variant="outline" className="bg-white/50">Compare</Button>
        <Button variant="primary">Filter</Button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {COUNTRIES.map(country => (
        <Card key={country.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 ring-1 ring-gray-100">
          <div className="h-72 overflow-hidden relative">
            <img 
              src={country.image} 
              alt={country.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-bold">{country.name}</h3>
              <p className="text-white/80 text-sm font-medium flex items-center gap-1.5 mt-1"><MapPin size={12}/> {country.capital}</p>
            </div>
          </div>
          <div className="p-6 space-y-4 bg-white/80 backdrop-blur-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Cost</span>
              <span className="font-bold text-gray-900 text-sm">{country.avgCostOfLiving}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Safety</span>
              <Badge color="green" className="text-xs font-bold">{country.safetyIndex}/100</Badge>
            </div>
            <div className="pt-2">
              <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-widest">POPULAR FOR</p>
              <div className="flex flex-wrap gap-2">
                {country.topIndustries.map(ind => (
                  <span key={ind} className="text-[10px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-1 rounded-md font-bold">{ind}</span>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2 group-hover:bg-[#FF9500] group-hover:text-white group-hover:border-[#FF9500] font-bold">View Full Guide</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// --- AI MARKETPLACE ---
const AiMarketplace = () => {
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [accessForm, setAccessForm] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
    phone: ''
  });

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit access request to admin
      await submitAIAccessRequest(accessForm);
      alert('Thank you for your request! Our team will contact you within 24 hours at +91-9290597779');
      setShowAccessForm(false);
      setAccessForm({
        name: '',
        email: '',
        company: '',
        useCase: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error submitting access request:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white p-12 rounded-[2rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">AI Tools & SaaS Marketplace</h2>
          <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
            Discover the latest AI tools to supercharge your workflow, categorized and reviewed by experts.
          </p>
          <div className="mt-8 flex gap-3">
            <Input placeholder="Search AI tools..." className="bg-white/10 border-white/10 text-white placeholder-gray-500 max-w-md focus:bg-white/20" />
            <Button variant="primary" className="px-8">Search</Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#FF9500]/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Access Request Modal */}
      {showAccessForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Request AI Tool Access</h3>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => setShowAccessForm(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <form onSubmit={handleAccessRequest} className="space-y-4">
              <Input
                label="Name"
                value={accessForm.name}
                onChange={(e) => setAccessForm({ ...accessForm, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={accessForm.email}
                onChange={(e) => setAccessForm({ ...accessForm, email: e.target.value })}
                required
              />
              <Input
                label="Company/Organization"
                value={accessForm.company}
                onChange={(e) => setAccessForm({ ...accessForm, company: e.target.value })}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={accessForm.phone}
                onChange={(e) => setAccessForm({ ...accessForm, phone: e.target.value })}
                required
              />
              <TextArea
                label="Use Case"
                value={accessForm.useCase}
                onChange={(e) => setAccessForm({ ...accessForm, useCase: e.target.value })}
                placeholder="Please describe how you plan to use this AI tool..."
                rows={3}
                required
              />
              <div className="text-sm text-gray-600">
                For immediate assistance, please call: <strong>+91-9290597779</strong>
              </div>
              <Button type="submit" className="w-full">
                Submit Access Request
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AI_TOOLS.map(tool => (
          <Card key={tool.id} className="p-7 hover:shadow-xl transition-all border border-white/60">
            <div className="flex justify-between items-start mb-6">
              <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-bold shadow-inner border border-purple-100">
                <Cpu size={24} />
              </div>
              <Badge color={tool.pricing === 'Free' ? 'green' : 'purple'}>{tool.pricing}</Badge>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">{tool.name}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">{tool.category}</p>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed h-10 line-clamp-2">{tool.description}</p>
            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} fill="currentColor" /> {tool.rating}
              </div>
              <Button 
                variant="ghost" 
                className="text-sm hover:text-purple-600 font-bold"
                onClick={() => setShowAccessForm(true)}
              >
                Request Access
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- LEARNING ---
const Learning = () => (
  <div className="space-y-8 animate-in fade-in">
    <div className="flex justify-between items-center">
       <h2 className="text-3xl font-extrabold text-gray-900">Upskill & Grow</h2>
       <div className="flex gap-2 bg-white/50 p-1 rounded-full border border-white/50 backdrop-blur-md">
         {['All', 'Development', 'Design', 'Data'].map((cat, i) => (
           <button key={cat} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-white shadow-sm text-[#FF9500]' : 'text-gray-500 hover:text-gray-900'}`}>{cat}</button>
         ))}
       </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {COURSES.map(course => (
        <Card key={course.id} className="p-0 overflow-hidden group border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
           <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-300 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <LibraryBig size={56} className="relative z-10 text-white/20 group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
               <p className="text-[10px] text-white font-bold uppercase tracking-wider">{course.level}</p>
             </div>
           </div>
           <div className="p-7">
             <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-[#FF9500] transition-colors">{course.title}</h3>
             <p className="text-xs text-gray-500 mb-6 flex items-center gap-2 font-medium">
               <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-600">IN</span>
               {course.instructor} • {course.duration}
             </p>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-yellow-500 text-sm font-bold">
                  <Star size={14} fill="currentColor" /> {course.rating}
                </div>
                <Button variant="primary" className="text-xs px-5 h-9 shadow-lg shadow-orange-500/20">Enroll Now</Button>
             </div>
           </div>
        </Card>
      ))}
    </div>
  </div>
);

// --- ABOUT US ---
const AboutUs = () => (
  <div className="max-w-5xl mx-auto space-y-20 py-12 animate-in fade-in">
    <div className="text-center space-y-6">
      <Badge color="orange" className="mb-2 bg-orange-100 text-orange-700 px-4 py-1.5 text-sm">Our Story</Badge>
      <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Illuminating Your <br/><span className="text-[#FF9500]">Path to Success</span></h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
        Sunshine Careers is your unified ecosystem for global opportunities. We bridge the gap between ambition and achievement with AI-driven guidance.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <div className="space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            We aim to democratize access to international education and global careers. By leveraging 
            <span className="font-bold text-[#FF9500] px-1"> Gemini AI </span> 
            and verified networks, we remove the uncertainty from studying abroad and finding remote work.
          </p>
        </div>
        <div className="space-y-5">
          {[
            { title: "Unified Platform", desc: "One login for jobs, study, and freelance.", icon: LayoutGrid, color: "bg-orange-100 text-orange-600" },
            { title: "AI Powered", desc: "Smart matching & SOP generation.", icon: Sparkles, color: "bg-blue-100 text-blue-600" },
            { title: "Verified Listings", desc: "100% authentic opportunities.", icon: ShieldCheck, color: "bg-green-100 text-green-600" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-white/60 border border-white/50 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
               <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                 <item.icon size={28} />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                 <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
         <div className="absolute inset-0 bg-[#FF9500] rounded-[2.5rem] rotate-6 opacity-20 blur-2xl"></div>
         <div className="h-[600px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border-4 border-white/50">
           <img src="https://picsum.photos/800/1000?random=10" alt="Team" className="w-full h-full object-cover" />
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-10 text-white">
             <p className="font-bold text-2xl mb-2">"Empowering 10,000+ students globally"</p>
             <p className="text-white/80 text-sm font-medium">Join the community today.</p>
           </div>
         </div>
      </div>
    </div>
  </div>
);

// --- PARTNER WITH US COMPONENT ---
const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  const partnershipTypes = [
    'University Partnership',
    'Corporate Training',
    'Technology Partnership',
    'Content Partnership',
    'Marketing Partnership',
    'Other'
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600">
          We've received your partnership request and will get back to you within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Partner With Us
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join us in our mission to empower global careers. Let's create something amazing together.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Partner With Sunshine Careers?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Global Reach</h3>
                <p className="text-gray-600">Access to thousands of students and professionals worldwide.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Growing Platform</h3>
                <p className="text-gray-600">Rapidly expanding user base with high engagement rates.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">AI-Powered</h3>
                <p className="text-gray-600">Cutting-edge technology for personalized career guidance.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <div>
              <label className="text-sm font-semibold text-gray-700">Partnership Type</label>
              <select
                value={formData.partnershipType}
                onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
                required
              >
                <option value="">Select Partnership Type</option>
                {partnershipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <TextArea
              label="Message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your partnership proposal..."
              required
            />
            <Button type="submit" className="w-full">
              Submit Partnership Request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

// --- NEW PAGES ---

const FreelanceMarketplace = () => (
  <div className="space-y-8 animate-in fade-in">
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-purple-600 text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <Badge color="purple" className="mb-3 bg-white/20 text-white border-white/30">Gig Economy</Badge>
          <h2 className="text-4xl font-extrabold mb-2">Freelance Marketplace</h2>
          <p className="text-purple-100 font-medium max-w-lg">Find expert freelancers or list your services to a global audience.</p>
        </div>
        <div className="relative z-10 flex gap-3 w-full md:w-auto">
           <Button className="bg-white text-purple-700 hover:bg-purple-50 border-none font-bold">Post a Request</Button>
        </div>
        <div className="absolute right-0 bottom-0 h-64 w-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       {FREELANCE_GIGS.map(gig => (
         <Card key={gig.id} className="p-0 overflow-hidden group hover:shadow-lg transition-all border-purple-100">
            <div className="h-40 overflow-hidden relative">
               <img src={gig.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={gig.title} />
               <Badge className="absolute top-3 left-3 bg-black/50 text-white border-none backdrop-blur-md">{gig.category}</Badge>
            </div>
            <div className="p-5">
               <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">{gig.freelancer.charAt(0)}</div>
                  <span className="text-xs font-bold text-gray-500">{gig.freelancer}</span>
                  <span className="ml-auto text-xs font-bold text-yellow-500 flex items-center gap-1"><Star size={10} fill="currentColor"/> {gig.rating}</span>
               </div>
               <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 leading-tight h-10">{gig.title}</h3>
               <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">{gig.price}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Starting at</span>
               </div>
            </div>
         </Card>
       ))}
    </div>
  </div>
);

const ConsultantConnect = () => (
  <div className="space-y-8 animate-in fade-in">
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-4xl font-black text-gray-900 mb-4">Connect with Verified Experts</h2>
      <p className="text-gray-500 text-lg">Get personalized guidance for study abroad, career planning, and visas from top-rated consultants.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {CONSULTANTS_LIST.map(consultant => (
        <Card key={consultant.id} className="p-6 text-center hover:border-orange-200 transition-all">
           <div className="h-24 w-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-orange-400 to-red-500 mb-4 shadow-lg shadow-orange-200">
             <img src={consultant.image} alt={consultant.name} className="w-full h-full rounded-full object-cover border-4 border-white" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
             {consultant.name} 
             {consultant.verified && <CheckCircle size={16} className="text-blue-500" fill="currentColor" color="white"/>}
           </h3>
           <p className="text-sm text-gray-500 font-medium mb-4">{consultant.expertise}</p>
           
           <div className="flex justify-center gap-4 text-sm font-bold text-gray-700 mb-6 bg-gray-50 py-3 rounded-xl">
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" fill="currentColor"/> {consultant.rating}</span>
              <span className="w-px bg-gray-300"></span>
              <span>{consultant.rate}</span>
           </div>
           <Button variant="primary" className="w-full">Book Consultation</Button>
        </Card>
      ))}
    </div>
  </div>
);

const SuccessStoriesPage = () => (
  <div className="max-w-6xl mx-auto py-12 animate-in fade-in">
    <h1 className="text-4xl font-black text-center mb-16">Global Success Stories</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       {[1, 2, 3, 4].map((i) => (
         <div key={i} className="flex flex-col md:flex-row gap-6 bg-white/60 p-8 rounded-3xl border border-white/50 shadow-lg items-center">
            <img src={`https://picsum.photos/200/200?random=${50+i}`} className="h-32 w-32 rounded-2xl object-cover shadow-md" alt="User" />
            <div>
               <p className="text-lg italic text-gray-600 mb-4">"Sunshine Careers streamlined my entire application process. I wouldn't be studying in Berlin without their AI tools and consultant network."</p>
               <h4 className="font-bold text-gray-900">Alex Johnson</h4>
               <p className="text-sm text-[#FF9500] font-bold">Masters in Data Science, Germany</p>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const ContactPage = () => (
  <div className="max-w-4xl mx-auto py-12 animate-in fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">Have questions about our platform or need support? Fill out the form or reach us directly.</p>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-gray-700">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-[#FF9500]"><Mail size={20}/></div>
            <span className="font-medium">support@sunshinecareers.com</span>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-[#FF9500]"><Phone size={20}/></div>
            <span className="font-medium">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-[#FF9500]"><MapPin size={20}/></div>
            <span className="font-medium">San Francisco, CA</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Input label="Name" placeholder="John Doe" />
        <Input label="Email" placeholder="john@example.com" />
        <TextArea label="Message" rows={4} placeholder="How can we help?" />
        <Button className="w-full shadow-lg shadow-orange-500/20">Send Message</Button>
      </div>
    </div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="max-w-3xl mx-auto py-12 animate-in fade-in space-y-8">
    <div className="text-center mb-10">
      <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock size={32}/></div>
      <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
      <p className="text-gray-500">Last Updated: October 2024</p>
    </div>
    <Card className="p-10 prose prose-gray max-w-none bg-white/70">
      <h3>1. Information Collection</h3>
      <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>
      <h3>2. Use of Information</h3>
      <p>We use your information to provide, maintain, and improve our services, including analyzing user behavior to enhance our AI recommendations.</p>
      <h3>3. Data Security</h3>
      <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access or disclosure.</p>
    </Card>
  </div>
);

const HelpCenter = () => (
  <div className="max-w-3xl mx-auto py-12 animate-in fade-in space-y-8">
    <div className="text-center mb-10">
      <div className="h-16 w-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><HelpCircle size={32}/></div>
      <h1 className="text-3xl font-black text-gray-900">Help Center</h1>
      <p className="text-gray-500">Frequently Asked Questions</p>
    </div>
    
    <div className="space-y-4">
      {[
        { q: "How do I apply for jobs?", a: "Navigate to the Job Portal, upload your resume, and click 'Apply Now' on any listing." },
        { q: "Is the SOP generator free?", a: "Yes, basic AI tools are free for all registered users." },
        { q: "How are consultants verified?", a: "We manually verify certifications and track records of all consultants listed." }
      ].map((faq, i) => (
        <Card key={i} className="p-6 bg-white/70">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileQuestion size={18} className="text-[#FF9500]"/> {faq.q}</h4>
          <p className="text-gray-600 text-sm ml-7">{faq.a}</p>
        </Card>
      ))}
    </div>
  </div>
);

const TermsOfService = () => (
  <div className="max-w-3xl mx-auto py-12 animate-in fade-in space-y-8">
    <div className="text-center mb-10">
      <h1 className="text-3xl font-black text-gray-900">Terms of Service</h1>
      <p className="text-gray-500">Please read carefully before using our platform.</p>
    </div>
    <Card className="p-10 prose prose-gray max-w-none bg-white/70">
      <p>By accessing or using Sunshine Careers, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
      <h3>User Accounts</h3>
      <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times.</p>
      <h3>Content</h3>
      <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.</p>
    </Card>
  </div>
);

// Export all components at the end
export {
  Dashboard,
  StudyAbroad,
  JobPortal,
  CountryExplorer,
  AiMarketplace,
  Learning,
  AboutUs,
  PartnerWithUs,
  FreelanceMarketplace,
  ConsultantConnect,
  SuccessStoriesPage,
  ContactPage,
  PrivacyPolicy,
  HelpCenter,
  TermsOfService
};