// Analytics utility for tracking events and conversions

// Google Analytics 4 Event Types
export type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Track custom events
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', { action, category, label, value });
  }
};

// Predefined event trackers
export const analytics = {
  // CTA Button Clicks
  trackTrialClick: () => {
    trackEvent({
      action: 'click_start_trial',
      category: 'CTA',
      label: 'Start Free Trial Button',
    });
  },

  trackDemoClick: () => {
    trackEvent({
      action: 'click_watch_demo',
      category: 'CTA',
      label: 'Watch Demo Button',
    });
  },

  trackPricingClick: (plan: string) => {
    trackEvent({
      action: 'click_pricing_cta',
      category: 'Pricing',
      label: plan,
    });
  },

  // Form Submissions
  trackContactFormSubmit: (success: boolean) => {
    trackEvent({
      action: success ? 'submit_contact_form_success' : 'submit_contact_form_error',
      category: 'Form',
      label: 'Contact Form',
      value: success ? 1 : 0,
    });
  },

  trackTrialSignup: (email: string) => {
    trackEvent({
      action: 'signup_trial',
      category: 'Conversion',
      label: 'Trial Signup',
      value: 1,
    });

    // Track conversion in GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual Google Ads conversion ID
        value: 1.0,
        currency: 'USD',
      });
    }
  },

  trackNewsletterSignup: (email: string) => {
    trackEvent({
      action: 'signup_newsletter',
      category: 'Lead Capture',
      label: 'Newsletter Signup',
      value: 1,
    });
  },

  // Navigation Events
  trackNavClick: (section: string) => {
    trackEvent({
      action: 'click_navigation',
      category: 'Navigation',
      label: section,
    });
  },

  trackDropdownOpen: (dropdown: string) => {
    trackEvent({
      action: 'open_dropdown',
      category: 'Navigation',
      label: dropdown,
    });
  },

  // Engagement Events
  trackFaqClick: (question: string) => {
    trackEvent({
      action: 'click_faq',
      category: 'Engagement',
      label: question,
    });
  },

  trackPricingToggle: (cycle: 'monthly' | 'yearly') => {
    trackEvent({
      action: 'toggle_pricing_cycle',
      category: 'Engagement',
      label: cycle,
    });
  },

  trackSocialClick: (platform: string) => {
    trackEvent({
      action: 'click_social',
      category: 'Social',
      label: platform,
    });
  },

  trackIntegrationHover: (integration: string) => {
    trackEvent({
      action: 'hover_integration',
      category: 'Engagement',
      label: integration,
    });
  },

  // Video Events
  trackVideoPlay: () => {
    trackEvent({
      action: 'play_demo_video',
      category: 'Video',
      label: 'Product Demo',
    });
  },

  trackVideoComplete: () => {
    trackEvent({
      action: 'complete_demo_video',
      category: 'Video',
      label: 'Product Demo',
      value: 1,
    });
  },

  // Scroll Depth Tracking
  trackScrollDepth: (percentage: number) => {
    trackEvent({
      action: 'scroll_depth',
      category: 'Engagement',
      label: `${percentage}%`,
      value: percentage,
    });
  },

  // Page Views
  trackPageView: (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: url,
      });
    }
  },
};

// Scroll depth tracker hook
export const useScrollDepthTracking = () => {
  if (typeof window === 'undefined') return;

  const scrollDepths = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollDepths.forEach((depth) => {
      if (scrollPercentage >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        analytics.trackScrollDepth(depth);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
};


