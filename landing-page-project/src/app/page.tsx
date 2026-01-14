'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  ChevronDown,
  Menu,
  X,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Loader2,
  AlertCircle,
  Play,
  Award,
  Lock,
  ShieldCheck,
  BadgeCheck,
  Send,
  Bell,
  Quote,
  TrendingUp,
  Clock,
  DollarSign,
  Users2,
  Building2,
  Download,
  FileText,
  BarChart3,
  Target,
  TrendingDown
} from 'lucide-react';
import Navbar from '../components/navbar';
import { analytics } from '../lib/analytics';
import { CompanyLogos } from '../components/logos/CompanyLogos';
import { ExitIntentModal } from '../components/ExitIntentModal';
import { useExitIntent } from '../hooks/useExitIntent';
import { PageLoadingSkeleton, LoadingSpinner } from '../components/LoadingSkeleton';

// Tooltip Component
const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
  );
};

// JSON-LD Structured Data Component
const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AutoFlowAI",
    "description": "AI-powered business automation platform helping companies streamline workflows and increase productivity",
    "url": "https://autoflowai.com",
    "logo": "https://autoflowai.com/logo.png",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "Customer Service",
      "email": "hello@autoflowai.com",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://twitter.com/autoflowai",
      "https://linkedin.com/company/autoflowai",
      "https://github.com/autoflowai"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AutoFlowAI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "99",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the free trial work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our free trial gives you full access to all Pro features for 14 days. No credit card required. You can cancel anytime during the trial period."
        }
      },
      {
        "@type": "Question",
        "name": "Can I change my plan anytime?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of support do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer email support for all plans, priority support for Pro users, and 24/7 phone support for Enterprise customers. Our average response time is under 2 hours."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We use enterprise-grade security with 256-bit SSL encryption, regular security audits, and comply with SOC 2 Type II standards."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

// Trust Badges Component
const TrustBadges = () => {
  const badges = [
    {
      icon: ShieldCheck,
      name: 'SOC 2 Type II',
      description: 'Certified',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-gradient-to-br dark:from-gray-800/90 dark:via-blue-900/20 dark:to-gray-800/90',
      borderColor: 'border-blue-200 dark:border-blue-500/40',
      glowColor: 'dark:shadow-blue-500/20 dark:shadow-2xl',
      iconGlow: 'dark:shadow-blue-500/30'
    },
    {
      icon: Lock,
      name: 'GDPR',
      description: 'Compliant',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-gradient-to-br dark:from-gray-800/90 dark:via-green-900/20 dark:to-gray-800/90',
      borderColor: 'border-green-200 dark:border-green-500/40',
      glowColor: 'dark:shadow-green-500/20 dark:shadow-2xl',
      iconGlow: 'dark:shadow-green-500/30'
    },
    {
      icon: BadgeCheck,
      name: 'ISO 27001',
      description: 'Certified',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-gradient-to-br dark:from-gray-800/90 dark:via-purple-900/20 dark:to-gray-800/90',
      borderColor: 'border-purple-200 dark:border-purple-500/40',
      glowColor: 'dark:shadow-purple-500/20 dark:shadow-2xl',
      iconGlow: 'dark:shadow-purple-500/30'
    },
    {
      icon: Award,
      name: 'G2 Crowd',
      description: '4.8/5 Rating',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-gradient-to-br dark:from-gray-800/90 dark:via-orange-900/20 dark:to-gray-800/90',
      borderColor: 'border-orange-200 dark:border-orange-500/40',
      glowColor: 'dark:shadow-orange-500/20 dark:shadow-2xl',
      iconGlow: 'dark:shadow-orange-500/30'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
    >
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05, 
              y: -8,
              rotateY: 5,
              rotateX: 5
            }}
            className={`${badge.bgColor} ${badge.borderColor} border rounded-xl p-3 sm:p-4 flex flex-col items-center text-center space-y-2 transition-all duration-500 hover:shadow-xl ${badge.glowColor} cursor-default backdrop-blur-sm group relative overflow-hidden`}
          >
            {/* Subtle animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Icon with enhanced glow */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg ${badge.iconGlow} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            
          {/* Content */}
            <div className="relative z-10">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                {badge.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {badge.description}
              </p>
            </div>
            
            {/* Subtle corner accent */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Security Features Component
const SecurityFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Level Encryption',
      description: '256-bit SSL encryption for all data transmission',
      color: 'from-blue-500 to-blue-600',
      glowColor: 'hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30',
      borderColor: 'dark:border-gray-700/60'
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'GDPR & CCPA compliant data handling',
      color: 'from-green-500 to-green-600',
      glowColor: 'hover:shadow-green-500/20 dark:hover:shadow-green-500/30',
      borderColor: 'dark:border-gray-700/60'
    },
    {
      icon: ShieldCheck,
      title: 'Regular Audits',
      description: 'Third-party security audits every quarter',
      color: 'from-purple-500 to-purple-600',
      glowColor: 'hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30',
      borderColor: 'dark:border-gray-700/60'
    },
    {
      icon: BadgeCheck,
      title: '99.99% Uptime',
      description: 'Enterprise SLA with guaranteed availability',
      color: 'from-indigo-500 to-indigo-600',
      glowColor: 'hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30',
      borderColor: 'dark:border-gray-700/60'
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-white dark:bg-gray-800/80 rounded-xl p-5 border border-gray-200 ${feature.borderColor} hover:shadow-xl ${feature.glowColor} transition-all duration-300 backdrop-blur-sm group`}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

// Newsletter Signup Component
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Newsletter signup:', email);
    analytics.trackNewsletterSignup(email);
    setSubmitStatus('success');
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setEmail('');
      setSubmitStatus('idle');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 dark:bg-black rounded-2xl p-6 sm:p-8 border border-gray-800 dark:border-gray-800"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full mb-4">
          <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Stay Updated
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Get the latest automation tips, product updates, and industry insights delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 dark:bg-gray-900 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center min-w-[120px] disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">Subscribing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span className="text-sm">Subscribe</span>
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-lg flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Thanks for subscribing! Check your email for confirmation.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </form>
    </motion.div>
  );
};

// Case Studies Component
const CaseStudiesSection = () => {
  const caseStudies = [
    {
      id: 1,
      company: "TechFlow Solutions",
      industry: "SaaS & Technology",
      logo: "TF",
      gradientColor: "from-blue-600 to-cyan-500",
      challenge: "Manual processes were slowing down product development and customer onboarding. The team spent 15+ hours per week on repetitive tasks.",
      solution: "Implemented AutoFlowAI's automation suite to streamline workflows, automate customer onboarding, and integrate with existing tools.",
      results: [
        { metric: "Time Saved", value: "75%", icon: Clock, description: "15 hours reduced to 4 hours per week" },
        { metric: "Cost Reduction", value: "$120K", icon: DollarSign, description: "Annual operational cost savings" },
        { metric: "Productivity", value: "3x", icon: TrendingUp, description: "Team productivity increase" },
        { metric: "Customer Satisfaction", value: "95%", icon: Target, description: "CSAT score improvement" }
      ],
      testimonial: {
        quote: "AutoFlowAI transformed how we operate. What used to take days now takes hours. The ROI was immediate and continues to grow.",
        author: "Sarah Chen",
        role: "CTO, TechFlow Solutions"
      },
      pdfUrl: "/case-studies/techflow-solutions.pdf"
    },
    {
      id: 2,
      company: "Global Retail Co",
      industry: "E-commerce & Retail",
      logo: "GR",
      gradientColor: "from-emerald-600 to-teal-500",
      challenge: "Inventory management and order processing were error-prone and time-consuming, leading to customer complaints and lost revenue.",
      solution: "Deployed AutoFlowAI's intelligent automation platform to synchronize inventory across 50+ locations and automate order fulfillment.",
      results: [
        { metric: "Error Reduction", value: "92%", icon: TrendingDown, description: "Inventory discrepancies eliminated" },
        { metric: "Revenue Growth", value: "$2.5M", icon: DollarSign, description: "Additional annual revenue" },
        { metric: "Processing Speed", value: "5x", icon: Zap, description: "Faster order fulfillment" },
        { metric: "Customer Retention", value: "87%", icon: Users2, description: "Repeat customer rate" }
      ],
      testimonial: {
        quote: "The automation capabilities are exceptional. We've eliminated virtually all inventory errors and our customers are happier than ever.",
        author: "Marcus Rodriguez",
        role: "Operations Director, Global Retail Co"
      },
      pdfUrl: "/case-studies/global-retail-co.pdf"
    },
    {
      id: 3,
      company: "FinTech Innovations",
      industry: "Financial Services",
      logo: "FI",
      gradientColor: "from-purple-600 to-pink-500",
      challenge: "Compliance reporting and data analysis required 40+ hours monthly, diverting resources from strategic initiatives.",
      solution: "Integrated AutoFlowAI's analytics and reporting automation to generate real-time compliance reports and financial insights.",
      results: [
        { metric: "Time Savings", value: "80%", icon: Clock, description: "40 hours reduced to 8 hours" },
        { metric: "Compliance Score", value: "100%", icon: Shield, description: "Perfect audit compliance" },
        { metric: "Data Accuracy", value: "99.9%", icon: Target, description: "Error-free reporting" },
        { metric: "Cost Savings", value: "$180K", icon: DollarSign, description: "Annual compliance cost reduction" }
      ],
      testimonial: {
        quote: "AutoFlowAI's automation platform gave us the confidence to scale rapidly while maintaining perfect compliance. It's a game-changer.",
        author: "Jennifer Kim",
        role: "Chief Compliance Officer, FinTech Innovations"
      },
      pdfUrl: "/case-studies/fintech-innovations.pdf"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-900">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-full mb-6">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Case Studies</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Real Results from Real Companies
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how industry leaders are transforming their businesses with AutoFlowAI. Detailed insights, metrics, and ROI calculations.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="space-y-12 sm:space-y-16">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Company Header */}
              <div className={`bg-gradient-to-r ${study.gradientColor} p-6 sm:p-8`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {study.logo}
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">
                        {study.company}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base">
                        {study.industry}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => analytics.trackEvent({ action: 'download_case_study', category: 'Case Studies', label: study.company })}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/30"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download PDF</span>
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Challenge & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                        <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      The Challenge
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                        <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      The Solution
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Results Metrics */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    Key Results
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {study.results.map((result, resultIndex) => {
                      const Icon = result.icon;
                      return (
                        <motion.div
                          key={resultIndex}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: resultIndex * 0.1 }}
                          className={`bg-gradient-to-br ${study.gradientColor} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 group/card`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="w-5 h-5 opacity-80" />
                          </div>
                          <div className="text-3xl font-bold mb-1 group-hover/card:scale-110 transition-transform duration-300">
                            {result.value}
                          </div>
                          <div className="text-sm font-medium opacity-90 mb-1">
                            {result.metric}
                          </div>
                          <div className="text-xs opacity-75">
                            {result.description}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-gray-100 dark:bg-gray-800/80 rounded-2xl p-6 border-l-4 border-blue-500 dark:border-blue-400">
                  <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-3 opacity-50" />
                  <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-4 leading-relaxed">
                    "{study.testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${study.gradientColor} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                      {study.testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {study.testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {study.testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-700/90 rounded-2xl p-8 border border-blue-200 dark:border-gray-600/50 shadow-xl dark:shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of companies already transforming their operations with AutoFlowAI. Start your free trial today.
            </p>
            <button
              onClick={() => analytics.trackTrialClick()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 inline-flex items-center"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
            </motion.div>
      </div>
    </section>
  );
};

// Product Showcase Component
const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const features = [
    {
      title: "AI-Powered Dashboard",
      description: "Intelligent workflow automation with real-time insights and predictive analytics",
      image: "dashboard",
      highlights: ["Real-time Analytics", "Predictive Insights", "Custom Dashboards"]
    },
    {
      title: "Workflow Builder",
      description: "Drag-and-drop interface to create complex automation workflows in minutes",
      image: "workflow",
      highlights: ["Visual Builder", "Drag & Drop", "No-Code Setup"]
    },
    {
      title: "Integration Hub",
      description: "Connect with 200+ tools and services through our comprehensive integration platform",
      image: "integrations",
      highlights: ["200+ Integrations", "API Access", "Custom Connectors"]
    },
    {
      title: "Analytics & Reports",
      description: "Comprehensive reporting and analytics to track performance and optimize workflows",
      image: "analytics",
      highlights: ["Performance Metrics", "Custom Reports", "Data Export"]
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            See AutoFlowAI in Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the power of intelligent automation with our intuitive interface and powerful features
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.title}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feature Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center"
        >
          {/* Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {features[activeTab].title}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {features[activeTab].description}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3">
              {features[activeTab].highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{highlight}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try This Feature
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Mock Dashboard Image */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6"
            >
              {/* Mock Dashboard Content */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">AutoFlowAI Dashboard</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Workflow Management</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Workflows</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">24</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Time Saved</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">156h</div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900 dark:text-white">Workflow Performance</h5>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded flex items-end justify-between px-2">
                    {[40, 60, 45, 80, 70, 90, 85].map((height, i) => (
                      <div
                        key={i}
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${height}%`, width: '12%' }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900 dark:text-white">Recent Activities</h5>
                  <div className="space-y-2">
                    {[
                      { action: "Email workflow completed", time: "2 min ago", status: "success" },
                      { action: "Data sync in progress", time: "5 min ago", status: "pending" },
                      { action: "New integration added", time: "1 hour ago", status: "success" }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                        <span className="text-gray-400 dark:text-gray-500 ml-auto">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              ✓ Automated
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              +24% Efficiency
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Customer Success Stories Component
const CustomerSuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Operations Director",
      company: "TechFlow Solutions",
      industry: "SaaS",
      avatar: "SC",
      avatarColor: "from-blue-500 to-blue-600",
      quote: "AutoFlowAI transformed our entire workflow. What used to take our team 8 hours now takes just 30 minutes. The ROI was immediate and incredible.",
      metrics: {
        timeSaved: "75%",
        costReduction: "$50K",
        teamSize: "25 people",
        industry: "SaaS"
      },
      rating: 5,
      results: [
        { icon: Clock, label: "Time Saved", value: "75%" },
        { icon: DollarSign, label: "Cost Reduction", value: "$50K/year" },
        { icon: Users2, label: "Team Size", value: "25 people" }
      ]
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "E-Commerce Plus",
      industry: "E-commerce",
      avatar: "MR",
      avatarColor: "from-green-500 to-green-600",
      quote: "The automation features are game-changing. Our order processing went from manual chaos to seamless automation. Customer satisfaction increased by 40%.",
      metrics: {
        timeSaved: "60%",
        costReduction: "$30K",
        teamSize: "15 people",
        industry: "E-commerce"
      },
      rating: 5,
      results: [
        { icon: Clock, label: "Time Saved", value: "60%" },
        { icon: DollarSign, label: "Cost Reduction", value: "$30K/year" },
        { icon: Users2, label: "Team Size", value: "15 people" }
      ]
    },
    {
      id: 3,
      name: "Jennifer Kim",
      role: "Head of Marketing",
      company: "GrowthCorp",
      industry: "Marketing",
      avatar: "JK",
      avatarColor: "from-purple-500 to-purple-600",
      quote: "Our marketing campaigns are now 3x more efficient. AutoFlowAI handles the complex workflows while we focus on strategy. It's been a game-changer.",
      metrics: {
        timeSaved: "80%",
        costReduction: "$25K",
        teamSize: "12 people",
        industry: "Marketing"
      },
      rating: 5,
      results: [
        { icon: Clock, label: "Time Saved", value: "80%" },
        { icon: DollarSign, label: "Cost Reduction", value: "$25K/year" },
        { icon: Users2, label: "Team Size", value: "12 people" }
      ]
    }
  ];

  return (
    <section id="customer-success-stories" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-transparent dark:border-green-500/30">
            <TrendingUp className="w-4 h-4" />
            <span>Customer Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Real Results from <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Real Customers</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how companies like yours are saving time, reducing costs, and scaling their operations with AutoFlowAI.
          </p>
        </motion.div>

        {/* Success Stories Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-600/60 shadow-xl hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 group backdrop-blur-sm"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${story.avatarColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-blue-500/20`}>
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Testimonial Quote */}
              <blockquote className="text-center mb-6">
                <p className="text-base sm:text-lg text-gray-700 dark:text-white italic leading-relaxed">
                  "{story.quote}"
                </p>
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center justify-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {story.avatar}
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {story.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {story.role}
                  </p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {story.company}
                  </p>
                </div>
              </div>

              {/* Results Metrics */}
              <div className="space-y-3">
                {story.results.map((result, resultIndex) => {
                  const Icon = result.icon;
                  return (
                    <div key={resultIndex} className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gradient-to-r dark:${story.avatarColor} dark:opacity-20 rounded-lg group-hover:bg-gray-100 dark:group-hover:opacity-30 transition-all duration-300 border border-gray-200/50 dark:border-gray-500/40`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${story.avatarColor} rounded-lg flex items-center justify-center shadow-lg`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-white">
                          {result.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {result.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Star Rating */}
              <div className="flex items-center justify-center mt-6">
                <div className="flex space-x-1">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-white font-medium">
                  {story.rating}/5
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div id="success-stories-cta" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-700/90 rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-gray-600/50 shadow-xl dark:shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Ready to Join These Success Stories?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start your free trial today and see how AutoFlowAI can transform your business.
            </p>
            <button
              onClick={() => {
                analytics.trackTrialClick();
                // This would trigger the trial modal
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Start Your Success Story
              <ArrowRight className="ml-2 w-5 h-5 inline" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Company Logo Components
const ZapierLogo = ({ className = "h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <path d="M60 0L48 12h24L60 0zm0 30l12-12H48l12 12zM30 15L18 3v24l12-12zm60 0l12-12v24L90 15z"/>
    <text x="35" y="20" fontSize="16" fontWeight="bold" fill="currentColor">Zapier</text>
  </svg>
);

const AsanaLogo = ({ className = "h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <circle cx="15" cy="10" r="7"/>
    <circle cx="8" cy="22" r="7"/>
    <circle cx="22" cy="22" r="7"/>
    <text x="35" y="20" fontSize="16" fontWeight="bold" fill="currentColor">Asana</text>
  </svg>
);

const MondayLogo = ({ className = "h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <rect x="5" y="5" width="5" height="20" rx="2.5"/>
    <rect x="13" y="8" width="5" height="17" rx="2.5"/>
    <rect x="21" y="3" width="5" height="22" rx="2.5"/>
    <text x="32" y="20" fontSize="14" fontWeight="bold" fill="currentColor">monday.com</text>
  </svg>
);

const NotionLogo = ({ className = "h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <path d="M8 5h8l8 15L32 5h8v20h-6V12l-6 11h-4L20 12v13h-6V5h-6z"/>
    <text x="45" y="20" fontSize="16" fontWeight="bold" fill="currentColor">Notion</text>
  </svg>
);

// Integration Partner Logos
const SlackLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <rect x="5" y="5" width="8" height="8" rx="2"/>
    <rect x="15" y="5" width="8" height="8" rx="2"/>
    <rect x="5" y="15" width="8" height="8" rx="2"/>
    <rect x="15" y="15" width="8" height="8" rx="2"/>
    <text x="30" y="20" fontSize="14" fontWeight="bold">Slack</text>
  </svg>
);

const GoogleLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <circle cx="12" cy="15" r="8"/>
    <text x="25" y="20" fontSize="14" fontWeight="bold">Google</text>
  </svg>
);

const SalesforceLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <path d="M8 10c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z"/>
    <text x="22" y="20" fontSize="12" fontWeight="bold">Salesforce</text>
  </svg>
);

const DropboxLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <path d="M12 5l8 5-8 5-8-5 8-5zm0 12l8 5-8 5-8-5 8-5z"/>
    <text x="25" y="20" fontSize="14" fontWeight="bold">Dropbox</text>
  </svg>
);

const TrelloLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <rect x="5" y="5" width="6" height="18" rx="1"/>
    <rect x="13" y="5" width="6" height="12" rx="1"/>
    <text x="24" y="20" fontSize="14" fontWeight="bold">Trello</text>
  </svg>
);

const HubspotLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 110 30" fill="currentColor">
    <circle cx="10" cy="15" r="6"/>
    <circle cx="20" cy="15" r="3"/>
    <text x="28" y="20" fontSize="13" fontWeight="bold">HubSpot</text>
  </svg>
);

const MailchimpLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <path d="M10 15c0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5s-2 5-5 5c-2 0-3-1-4-2-1 1-2 2-4 2-3 0-5-2-5-5z"/>
    <text x="32" y="20" fontSize="12" fontWeight="bold">Mailchimp</text>
  </svg>
);

const ZendeskLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 110 30" fill="currentColor">
    <path d="M5 5h12v12H5V5zm0 14h12l-12 6V19z"/>
    <text x="22" y="20" fontSize="13" fontWeight="bold">Zendesk</text>
  </svg>
);

const JiraLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <path d="M12 8l4 4-4 4-4-4 4-4z"/>
    <path d="M12 16l4 4-4 4-4-4 4-4z" opacity="0.7"/>
    <text x="22" y="20" fontSize="14" fontWeight="bold">Jira</text>
  </svg>
);

const GithubLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <circle cx="12" cy="15" r="7"/>
    <path d="M12 10v10M8 15h8" stroke="white" strokeWidth="1.5"/>
    <text x="24" y="20" fontSize="14" fontWeight="bold">GitHub</text>
  </svg>
);

const ShopifyLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="currentColor">
    <path d="M10 5h8v15h-8V5zm0 17h8v3h-8v-3z"/>
    <text x="22" y="20" fontSize="14" fontWeight="bold">Shopify</text>
  </svg>
);

// Video Demo Modal Component
const VideoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Interactive Demo - Always Available */}
              <div className="relative w-full bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 p-4 sm:p-8 flex items-center justify-center">
                  {/* Workflow Demo Interface */}
                  <div className="w-full max-w-3xl space-y-6">
                    {/* Demo Header */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">AutoFlowAI Demo</h4>
                          <p className="text-gray-300 text-sm">Live Workflow Automation</p>
                        </div>
                      </div>

                      {/* Animated Workflow Steps */}
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 4 }}
                          className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
                        >
                          <Mail className="w-8 h-8 text-blue-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">Email Received</p>
                            <p className="text-gray-400 text-xs">Trigger activated</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 1.2, repeat: Infinity, repeatDelay: 4 }}
                          className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3"
                        >
                          <Zap className="w-8 h-8 text-purple-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">AI Analysis</p>
                            <p className="text-gray-400 text-xs">Processing content...</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 2.4, repeat: Infinity, repeatDelay: 4 }}
                          className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3"
                        >
                          <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">Task Created</p>
                            <p className="text-gray-400 text-xs">Team notified ✓</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center border border-white/20">
                        <div className="text-xl sm:text-2xl font-bold text-white">2.5s</div>
                        <div className="text-xs text-gray-400">Processing</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center border border-white/20">
                        <div className="text-xl sm:text-2xl font-bold text-white">200+</div>
                        <div className="text-xs text-gray-400">Integrations</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center border border-white/20">
                        <div className="text-xl sm:text-2xl font-bold text-white">99.9%</div>
                        <div className="text-xs text-gray-400">Uptime</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-6 py-3 text-white font-medium shadow-xl cursor-pointer hover:shadow-2xl transition-shadow">
                          <div className="flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            <span>See Full Demo</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Play className="w-6 h-6 text-blue-400" />
                      AutoFlowAI Platform Demo
                    </h3>
                    <p className="text-gray-300 text-base mb-4">
                      See how our AI-powered automation platform can transform your business workflow in just 5 minutes. Build custom workflows, integrate with 200+ tools, and automate your entire business process.
                    </p>
                  </div>
                </div>
                
                {/* Video Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">No-code workflow builder</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">200+ integrations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">AI-powered automation</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Trial Signup Modal Component
const TrialModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Trial signup:', email);
    analytics.trackTrialSignup(email);
    setSubmitStatus('success');
    setIsSubmitting(false);

    // Auto-close after success
    setTimeout(() => {
      onClose();
      setSubmitStatus('idle');
      setEmail('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submitStatus === 'success' ? (
                // Success State
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    You're all set!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Check your email for next steps to start your free trial.
                  </p>
                </div>
              ) : (
                // Form State
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Start Your Free Trial
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      No credit card required. Get full access to all Pro features for 14 days.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="trial-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Email
                      </label>
                      <input
                        id="trial-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="you@company.com"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting Trial...
                        </>
                      ) : (
                        <>
                          Start Free Trial
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By signing up, you agree to our{' '}
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </form>

                  {/* Features List */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      What's included:
                    </p>
                    <ul className="space-y-2">
                      {['All Pro features', 'Unlimited projects', '24/7 support', 'No credit card'].map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hero Section Component
const HeroSection = ({ onTrialClick, onDemoClick }: { onTrialClick: () => void; onDemoClick: () => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex items-center transition-colors duration-300 pt-24 sm:pt-28 md:pt-32 lg:pt-36">
      {/* Background decorative elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
        />
        <motion.div 
          style={{ y: y2, animationDelay: '2s' }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
        />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 order-2 lg:order-1 text-center lg:text-left"
          >
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight"
              >
                <span className="block text-gray-900 dark:text-gray-100 mb-2">The Future of</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Business Automation
                </span>
                <span className="block text-gray-900 dark:text-gray-100 mt-2 relative">
                  is Here
                  <motion.span
                    className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: '6rem' }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto lg:mx-0"
              >
                Revolutionize your workflow with AI-powered automation, real-time analytics, and seamless integrations. Join thousands of companies already scaling with our enterprise-grade platform.
              </motion.p>
            </div>

            {/* Trust Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center justify-center lg:justify-start space-x-3 py-4 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Trusted by 10,000+ companies worldwide</span>
            </motion.div>

            {/* Company Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="w-full max-w-4xl mx-auto lg:mx-0"
            >
              <CompanyLogos />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              <button 
                onClick={() => {
                  analytics.trackTrialClick();
                  onTrialClick();
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 min-h-[56px] flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <span className="text-lg">Start Free Trial</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button 
                onClick={() => {
                  analytics.trackDemoClick();
                  onDemoClick();
                }}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 min-h-[56px] flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg">Watch Demo</span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="pt-4"
            >
              <TrustBadges />
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 sm:pt-8 pb-8 sm:pb-12"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">A</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">T</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">S</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">+</div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-semibold">
                  Trusted by <span className="text-blue-600 dark:text-blue-400">10,000+</span> industry leaders
                </p>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-6 sm:space-x-8 lg:space-x-10 opacity-70 hover:opacity-100 transition-opacity">
                {/* Real automation & AI company logos */}
                <div className="flex items-center justify-center group cursor-pointer">
                  <ZapierLogo className="h-6 sm:h-8 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-center group cursor-pointer">
                  <AsanaLogo className="h-6 sm:h-8 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-center hidden sm:flex group cursor-pointer">
                  <MondayLogo className="h-6 sm:h-8 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-center hidden lg:flex group cursor-pointer">
                  <NotionLogo className="h-6 sm:h-8 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:scale-110" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 dark:bg-blue-500 rounded-lg"></div>
                    <div className="w-16 h-3 sm:w-24 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Navigation */}
                <div className="flex space-x-2 sm:space-x-4">
                  <div className="w-12 h-2 sm:w-16 h-3 bg-blue-200 dark:bg-blue-700 rounded"></div>
                  <div className="w-16 h-2 sm:w-20 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="w-14 h-2 sm:w-18 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                
                {/* Main content grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-lg"></div>
                    <div className="w-full h-12 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-full h-12 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 rounded-lg"></div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <div className="w-12 h-2 sm:w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-8 h-4 sm:w-12 h-6 bg-blue-100 dark:bg-blue-800 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-bounce-gentle"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-indigo-500 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Statistics Section Component
const StatisticsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const stats = [
    {
      value: 10000,
      suffix: '+',
      label: 'Active Users',
      icon: <Users className="w-8 h-8" />
    },
    {
      value: 99.9,
      suffix: '%',
      label: 'Uptime Guaranteed',
      icon: <Shield className="w-8 h-8" />
    },
    {
      value: 200,
      suffix: '+',
      label: 'Integrations',
      icon: <Globe className="w-8 h-8" />
    },
    {
      value: 24,
      suffix: '/7',
      label: 'Customer Support',
      icon: <Zap className="w-8 h-8" />
    }
  ];

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                {stat.icon}
              </div>

              {/* Counter */}
              <div className="mb-2">
                {inView ? (
                  <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      decimals={stat.value === 99.9 ? 1 : 0}
                      separator=","
                    />
                    <span>{stat.suffix}</span>
                  </div>
                ) : (
                  <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    0{stat.suffix}
                  </div>
                )}
              </div>

              {/* Label */}
              <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-600 dark:text-gray-300">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Security & Trust Section
const SecurityTrustSection = () => {
  const [cardBg, setCardBg] = useState('white');

  useEffect(() => {
    const updateCardBg = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setCardBg(isDark ? 'rgba(31, 41, 55, 0.9)' : 'white');
    };

    // Initial check
    updateCardBg();

    // Watch for dark mode changes
    const observer = new MutationObserver(updateCardBg);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-950">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-transparent dark:border-blue-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise-Grade Security</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Your Data is <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Safe & Secure</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We take security seriously. Our platform is built with industry-leading standards and certified by top security organizations.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="mb-12 sm:mb-16">
          <SecurityFeatures />
        </div>

        {/* Certifications & Awards */}
        <motion.div
          id="certifications-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 sm:p-10 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-2xl dark:shadow-blue-500/5 backdrop-blur-sm"
          style={{
            backgroundColor: cardBg,
            transition: 'background-color 0.3s ease'
          }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Certified & Recognized
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Trusted by industry leaders and certified by top security organizations
            </p>
          </div>
          <TrustBadges />
          
          {/* Money-Back Guarantee */}
          <motion.div
            id="money-back-guarantee"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800/80 dark:to-gray-700/80 rounded-xl border-2 border-green-200 dark:border-gray-600/50 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <BadgeCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  30-Day Money-Back Guarantee
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Try AutoFlowAI risk-free. If you're not satisfied, we'll refund your money—no questions asked.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Automation",
      description: "Intelligent workflows that adapt and optimize your processes automatically, reducing manual work by 80%."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant with end-to-end encryption, SSO, and advanced threat protection."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Seamless team coordination with live editing, instant messaging, and project management tools."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Infrastructure",
      description: "99.9% uptime with 200+ data centers worldwide, ensuring lightning-fast performance everywhere."
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-6 sm:mb-8"
          >
            Enterprise-Grade Features for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-4xl mx-auto"
          >
            Built for scale, security, and performance. Our comprehensive suite of tools empowers teams to collaborate, automate, and innovate at unprecedented speed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl group"
            >
              <Tooltip content={feature.title}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                {feature.icon}
              </div>
              </Tooltip>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = ({ onTrialClick }: { onTrialClick: () => void }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Calculate price based on billing cycle (20% discount for yearly)
  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return billingCycle === 'yearly' 
      ? Math.floor(monthlyPrice * 10) // Yearly = monthly * 10 (20% off from 12 months)
      : monthlyPrice;
  };

  const getPeriod = () => {
    return billingCycle === 'yearly' ? 'year' : 'month';
  };

  const plans = [
    {
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "Email support",
        "1GB storage",
        "Standard templates"
      ],
      ctaText: "Get Started",
      variant: "secondary"
    },
    {
      name: "Pro",
      price: 29,
      period: "month",
      description: "Ideal for growing businesses and professional teams",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "100GB storage",
        "Premium templates",
        "Team collaboration",
        "API access",
        "Custom integrations"
      ],
      ctaText: "Start Pro Trial",
      variant: "primary",
      popular: true
    },
    {
      name: "Enterprise",
      price: 99,
      period: "month",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "24/7 phone support",
        "Custom branding",
        "Advanced security",
        "Dedicated account manager",
        "SLA guarantee",
        "On-premise deployment"
      ],
      ctaText: "Contact Sales",
      variant: "secondary"
    }
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gray-50 dark:bg-gray-800">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Choose the plan that's right for your business. No hidden fees, no surprises.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <span className={`text-sm sm:text-base font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              Monthly
            </span>
            
            <button
              onClick={() => {
                const newCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly';
                analytics.trackPricingToggle(newCycle);
                setBillingCycle(newCycle);
              }}
              className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-gray-400 dark:hover:bg-gray-500"
              style={{ backgroundColor: billingCycle === 'yearly' ? '#2563eb' : undefined }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: billingCycle === 'yearly' ? 'translateX(28px)' : 'translateX(0)' }}
              />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base font-medium transition-colors ${
                billingCycle === 'yearly' 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                Yearly
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                rotateY: 2,
                rotateX: -2,
                transition: { duration: 0.3 }
              }}
              className={`relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
                    ${plan.price === 0 ? plan.price : getPrice(plan.price)}
                  </span>
                  <span className="text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-300 ml-1">
                    /{plan.price === 0 ? plan.period : getPeriod()}
                  </span>
                </div>
                {plan.price !== 0 && billingCycle === 'yearly' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    ${plan.price}/month billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  analytics.trackPricingClick(plan.name);
                  if (plan.ctaText === 'Start Pro Trial' || plan.ctaText === 'Get Started') {
                    onTrialClick();
                  } else if (plan.ctaText === 'Contact Sales') {
                    analytics.trackNavClick('contact');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 ${
                  plan.variant === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-gray-500 hover:shadow-md'
                }`}
              >
                {plan.ctaText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Comparison Table Section
const ComparisonTableSection = ({ onTrialClick }: { onTrialClick: () => void }) => {
  const featureCategories = [
    {
      category: "Core Features",
      features: [
        { name: "Projects", free: "5 projects", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Team Members", free: "1 user", pro: "10 users", enterprise: "Unlimited users" },
        { name: "Storage", free: "1GB", pro: "100GB", enterprise: "Unlimited" },
        { name: "API Access", free: false, pro: true, enterprise: true },
        { name: "Custom Branding", free: false, pro: false, enterprise: true },
      ]
    },
    {
      category: "Automation & AI",
      features: [
        { name: "Workflow Automation", free: "Basic", pro: "Advanced", enterprise: "Enterprise" },
        { name: "AI-Powered Insights", free: false, pro: true, enterprise: true },
        { name: "Custom Workflows", free: false, pro: "50/month", enterprise: "Unlimited" },
        { name: "Scheduled Tasks", free: "10/month", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Webhooks", free: false, pro: "100/month", enterprise: "Unlimited" },
      ]
    },
    {
      category: "Analytics & Reporting",
      features: [
        { name: "Basic Analytics", free: true, pro: true, enterprise: true },
        { name: "Advanced Reports", free: false, pro: true, enterprise: true },
        { name: "Custom Dashboards", free: false, pro: "3 dashboards", enterprise: "Unlimited" },
        { name: "Export Data", free: "CSV", pro: "CSV, Excel", enterprise: "All formats + API" },
        { name: "Real-time Analytics", free: false, pro: false, enterprise: true },
      ]
    },
    {
      category: "Integrations",
      features: [
        { name: "Pre-built Integrations", free: "10 apps", pro: "200+ apps", enterprise: "All apps" },
        { name: "Custom Integrations", free: false, pro: "Limited", enterprise: "Unlimited" },
        { name: "API Rate Limits", free: "100/hour", pro: "1000/hour", enterprise: "Unlimited" },
        { name: "Webhook Events", free: false, pro: true, enterprise: true },
      ]
    },
    {
      category: "Support & Security",
      features: [
        { name: "Email Support", free: true, pro: true, enterprise: true },
        { name: "Priority Support", free: false, pro: true, enterprise: true },
        { name: "Phone Support", free: false, pro: false, enterprise: "24/7" },
        { name: "Dedicated Manager", free: false, pro: false, enterprise: true },
        { name: "SLA Guarantee", free: false, pro: "99.5%", enterprise: "99.9%" },
        { name: "SSO / SAML", free: false, pro: false, enterprise: true },
        { name: "Advanced Security", free: false, pro: false, enterprise: true },
        { name: "Audit Logs", free: false, pro: "30 days", enterprise: "Unlimited" },
      ]
    }
  ];

  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>;
  };

  return (
    <section id="comparison" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
          >
            Compare Plans & Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Find the perfect plan for your needs. All plans include our core features.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-4"></div>
              {['Free', 'Pro', 'Enterprise'].map((plan, index) => (
                <div
                  key={plan}
                  className={`p-4 rounded-t-xl text-center ${
                    plan === 'Pro'
                      ? 'bg-gray-50 dark:bg-gray-900/50 border-2 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50'
                  }`}
                >
                  <h3 className={`text-lg font-bold mb-2 ${
                    plan === 'Pro' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {plan}
                  </h3>
                  <div className={`text-3xl font-bold mb-2 ${
                    plan === 'Pro' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    ${plan === 'Free' ? '0' : plan === 'Pro' ? '29' : '99'}
                    <span className="text-sm font-normal">/mo</span>
                  </div>
                  <button
                    onClick={() => {
                      analytics.trackPricingClick(`${plan} - Comparison Table`);
                      if (plan !== 'Free') {
                        onTrialClick();
                      }
                    }}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                      plan === 'Pro'
                        ? 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 shadow-lg'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-600'
                    }`}
                  >
                    {plan === 'Free' ? 'Get Started' : plan === 'Pro' ? 'Start Trial' : 'Contact Sales'}
                  </button>
                </div>
              ))}
            </div>

            {/* Feature Categories */}
            {featureCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="mb-6"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 px-4 py-3 rounded-lg mb-2 border-l-4 border-blue-600 dark:border-blue-500">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    {category.category}
                  </h4>
                </div>

                {/* Features in Category */}
                {category.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200 dark:border-gray-700/30 transition-colors group"
                  >
                    <div className="p-4 flex items-center bg-transparent dark:bg-transparent group-hover:bg-blue-50/30 dark:group-hover:bg-gray-800/20 transition-colors">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {feature.name}
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-center bg-transparent dark:bg-transparent group-hover:bg-blue-50/50 dark:group-hover:bg-gray-800/20 transition-colors">
                      {renderCell(feature.free)}
                    </div>
                    <div className="p-4 flex items-center justify-center bg-blue-50/50 dark:bg-gray-800/30 group-hover:bg-blue-100/60 dark:group-hover:bg-gray-800/50 transition-colors">
                      {renderCell(feature.pro)}
                    </div>
                    <div className="p-4 flex items-center justify-center bg-transparent dark:bg-transparent group-hover:bg-blue-50/50 dark:group-hover:bg-gray-800/20 transition-colors">
                      {renderCell(feature.enterprise)}
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}

            {/* Bottom CTA */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="p-4"></div>
              {['Free', 'Pro', 'Enterprise'].map((plan) => (
                <div key={plan} className="p-4 text-center">
                  <button
                    onClick={() => {
                      analytics.trackPricingClick(`${plan} - Bottom CTA`);
                      if (plan !== 'Free') {
                        onTrialClick();
                      } else {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                      plan === 'Pro'
                        ? 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700/50'
                    }`}
                  >
                    {plan === 'Free' ? 'Get Started' : plan === 'Pro' ? 'Start Free Trial' : 'Contact Sales'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile-friendly note */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
          💡 Scroll horizontally to see all features on mobile devices
        </p>
      </div>
    </section>
  );
};

// Integration Partners Section
const IntegrationSection = () => {
  const integrations = [
    { name: 'Slack', logo: SlackLogo, category: 'Communication' },
    { name: 'Google', logo: GoogleLogo, category: 'Productivity' },
    { name: 'Salesforce', logo: SalesforceLogo, category: 'CRM' },
    { name: 'Dropbox', logo: DropboxLogo, category: 'Storage' },
    { name: 'Trello', logo: TrelloLogo, category: 'Project Management' },
    { name: 'HubSpot', logo: HubspotLogo, category: 'Marketing' },
    { name: 'Mailchimp', logo: MailchimpLogo, category: 'Email' },
    { name: 'Zendesk', logo: ZendeskLogo, category: 'Support' },
    { name: 'Jira', logo: JiraLogo, category: 'Development' },
    { name: 'GitHub', logo: GithubLogo, category: 'Development' },
    { name: 'Shopify', logo: ShopifyLogo, category: 'E-commerce' },
    { name: 'Notion', logo: NotionLogo, category: 'Productivity' },
  ];

  // Duplicate for seamless infinite scroll
  const allIntegrations = [...integrations, ...integrations];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
          >
            Integrate with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">200+ Tools</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Connect AutoFlowAI with your favorite tools and services. Build powerful workflows that work for you.
          </motion.p>
        </div>

        {/* Infinite Scroll Carousel */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Container */}
          <div className="flex space-x-8 sm:space-x-12 animate-scroll-left">
            {allIntegrations.map((integration, index) => {
              const LogoComponent = integration.logo;
              return (
                <div
                  key={`${integration.name}-${index}`}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg min-w-[140px] group-hover:scale-110">
                    <LogoComponent className="h-8 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      {integration.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 sm:mt-16"
        >
          {[
            { value: '200+', label: 'Integrations' },
            { value: '5 min', label: 'Setup Time' },
            { value: '99.9%', label: 'API Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View All Integrations
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechCorp",
      role: "CEO",
      content: "This platform has completely transformed how we manage our projects. The productivity gains have been incredible, and our team loves the intuitive interface.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "StartupXYZ",
      role: "CTO",
      content: "The automation features have saved us countless hours. What used to take days now takes minutes. The ROI has been phenomenal.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      company: "GrowthCo",
      role: "Operations Manager",
      content: "The analytics and reporting capabilities give us insights we never had before. It's like having a business intelligence team built right into our workflow.",
      rating: 5
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
          >
            Loved by thousands of teams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            See what our customers have to say about their experience with our platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "Our free trial gives you full access to all Pro features for 14 days. No credit card required. You can cancel anytime during the trial period."
    },
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer email support for all plans, priority support for Pro users, and 24/7 phone support for Enterprise customers. Our average response time is under 2 hours."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with 256-bit SSL encryption, regular security audits, and comply with SOC 2 Type II standards."
    }
  ];

  const toggleFaq = (index: number) => {
    const isOpening = openIndex !== index;
    if (isOpening) {
      analytics.trackFaqClick(faqs[index].question);
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gray-50 dark:bg-gray-900/50">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Everything you need to know about our platform and pricing.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 sm:px-8 sm:py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                  {faq.question}
                </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
              </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: 'easeOut' },
                          opacity: { duration: 0.25, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: 'easeIn' },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 sm:px-8 sm:pb-6 pt-2">
                        <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Contact Form Schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Contact Section
const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      console.log('Form submitted:', data);
      setSubmitStatus('success');
      analytics.trackContactFormSubmit(true);
      reset(); // Clear form on success
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      analytics.trackContactFormSubmit(false);
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Join thousands of teams who trust our platform to streamline their workflow.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Get in touch
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      hello@example.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Success/Error Messages - Desktop */}
                <div className="mt-6 hidden md:block">
                  <AnimatePresence mode="wait">
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                            Message sent successfully!
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                            We'll get back to you within 24 hours.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                            Failed to send message
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                            Please try again or email us directly.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                      errors.name 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                      errors.email 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors resize-none ${
                      errors.message 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Tell us about your project..."
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.message.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {/* Success/Error Messages - Mobile */}
                <div className="md:hidden">
                  <AnimatePresence mode="wait">
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                            Message sent successfully!
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                            We'll get back to you within 24 hours.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                            Failed to send message
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                            Please try again or email us directly.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Blog/Resources Section Component
const BlogResourcesSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All', count: 12 },
    { id: 'automation', name: 'Automation', count: 5 },
    { id: 'integrations', name: 'Integrations', count: 4 },
    { id: 'tutorials', name: 'Tutorials', count: 3 }
  ];

  const resources = [
    {
      id: 1,
      title: "Complete Guide to Workflow Automation in 2024",
      excerpt: "Learn how to build powerful automation workflows that save time and increase productivity across your organization.",
      category: 'automation',
      readTime: '8 min read',
      date: 'Dec 15, 2024',
      image: 'guide-automation',
      featured: true,
      tags: ['Automation', 'Productivity', 'Workflow']
    },
    {
      id: 2,
      title: "Integrating AutoFlowAI with Salesforce: A Step-by-Step Tutorial",
      excerpt: "Connect your CRM with AutoFlowAI to automate lead management and follow-up processes seamlessly.",
      category: 'integrations',
      readTime: '6 min read',
      date: 'Dec 12, 2024',
      image: 'tutorial-salesforce',
      featured: false,
      tags: ['Salesforce', 'CRM', 'Integration']
    },
    {
      id: 3,
      title: "10 Automation Ideas for Small Businesses",
      excerpt: "Discover practical automation strategies that can transform your small business operations and boost efficiency.",
      category: 'automation',
      readTime: '5 min read',
      date: 'Dec 10, 2024',
      image: 'small-business',
      featured: false,
      tags: ['Small Business', 'Efficiency', 'Strategy']
    },
    {
      id: 4,
      title: "API Documentation: Building Custom Integrations",
      excerpt: "Comprehensive guide to using AutoFlowAI's API to build custom integrations and extend functionality.",
      category: 'integrations',
      readTime: '12 min read',
      date: 'Dec 8, 2024',
      image: 'api-docs',
      featured: false,
      tags: ['API', 'Development', 'Custom']
    },
    {
      id: 5,
      title: "Video Tutorial: Setting Up Your First Workflow",
      excerpt: "Watch our step-by-step video guide to create your first automation workflow in under 10 minutes.",
      category: 'tutorials',
      readTime: '10 min watch',
      date: 'Dec 5, 2024',
      image: 'video-tutorial',
      featured: false,
      tags: ['Video', 'Tutorial', 'Getting Started']
    },
    {
      id: 6,
      title: "Case Study: How TechCorp Saved 40 Hours Per Week",
      excerpt: "Real-world example of how a mid-size company automated their entire customer onboarding process.",
      category: 'automation',
      readTime: '7 min read',
      date: 'Dec 3, 2024',
      image: 'case-study',
      featured: false,
      tags: ['Case Study', 'ROI', 'Customer Onboarding']
    }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Resources & Insights
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest automation trends, tutorials, and best practices from our experts
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setIsLoading(true);
                setActiveCategory(category.id);
                // Simulate loading delay
                setTimeout(() => setIsLoading(false), 500);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </motion.button>
          ))}
        </div>

        {/* Featured Article */}
        {activeCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-blue-100">Featured Article</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Complete Guide to Workflow Automation in 2024
                  </h3>
                  <p className="text-lg text-blue-100 mb-6">
                    Learn how to build powerful automation workflows that save time and increase productivity across your organization.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm text-blue-200">8 min read</span>
                    <span className="text-sm text-blue-200">•</span>
                    <span className="text-sm text-blue-200">Dec 15, 2024</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Automation', 'Productivity', 'Workflow'].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">AutoFlowAI Guide</h4>
                          <p className="text-sm text-blue-200">Automation Tutorial</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-3 rounded-lg">
                          <div className="text-2xl font-bold">75%</div>
                          <div className="text-sm text-blue-200">Time Saved</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                          <div className="text-2xl font-bold">200+</div>
                          <div className="text-sm text-blue-200">Integrations</div>
                        </div>
                      </div>
                      <div className="h-16 bg-white/10 rounded-lg flex items-end justify-between px-2">
                        {[30, 50, 40, 70, 60, 80, 75].map((height, i) => (
                          <div
                            key={i}
                            className="bg-white/30 rounded-t"
                            style={{ height: `${height}%`, width: '12%' }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resources Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {isLoading ? (
            // Show skeleton loading
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-6 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            filteredResources.map((resource, index) => (
            <motion.article
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Mock Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">Article</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{resource.readTime}</span>
                  </div>
                </div>
                {resource.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
                    {resource.category}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{resource.date}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {resource.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {resource.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.button
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:gap-3 transition-all duration-200"
                  whileHover={{ x: 5 }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.article>
          ))
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated with Our Latest Content
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest automation insights, tutorials, and case studies delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Signup Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 mb-8">
          <NewsletterSignup />
        </div>
        
        {/* Trust Badges in Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="mb-8">
            <h4 className="text-center text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">
              Trusted & Certified
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400 font-medium">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400 font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400 font-medium">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-gray-400 font-medium">G2 Leader 2024</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
          <p className="text-gray-400">
              © 2024 <span className="font-semibold text-white">Auto<span className="text-blue-400">Flow</span>AI</span>. All rights reserved.
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function LandingPage() {
  // Clear session storage if requested (for testing purposes)
  if (typeof window !== 'undefined' && window.location.search.includes('clearSession=true')) {
    sessionStorage.removeItem('exitIntentShown');
  }

  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Exit Intent (called AFTER session storage is cleared)
  const { showExitIntent, setShowExitIntent } = useExitIntent(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleTrialClick = () => {
    setIsTrialModalOpen(true);
  };

  const handleDemoClick = () => {
    setIsVideoModalOpen(true);
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData />
      
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
        <HeroSection onTrialClick={handleTrialClick} onDemoClick={handleDemoClick} />
        <StatisticsSection />
        <SecurityTrustSection />
      <FeaturesSection />
        <ProductShowcase />
        <PricingSection onTrialClick={handleTrialClick} />
        <ComparisonTableSection onTrialClick={handleTrialClick} />
        <IntegrationSection />
        <CaseStudiesSection />
        <CustomerSuccessStories />
      <TestimonialsSection />
        <BlogResourcesSection />
      <FAQSection />
      <ContactSection />
      <Footer />
        
        {/* Modals */}
        <TrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} />
        <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
        <ExitIntentModal isOpen={showExitIntent} onClose={() => setShowExitIntent(false)} />
    </div>
    </>
  );
}