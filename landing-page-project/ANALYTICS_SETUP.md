# 📊 Analytics Setup Guide - AutoFlowAI Landing Page

This guide will help you set up analytics tracking for your landing page.

---

## 🚀 **Quick Start**

### **1. Google Analytics 4 Setup**

#### **Step 1: Create GA4 Property**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" → "Create Property"
3. Name: "AutoFlowAI Landing Page"
4. Set timezone and currency
5. Click "Create"

#### **Step 2: Get Measurement ID**
1. In your new property, go to "Data Streams"
2. Click "Add Stream" → "Web"
3. Enter your website URL
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

#### **Step 3: Add to Your Project**
Create a file `.env.local` in `landing-page-project/`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Replace with your actual ID
```

#### **Step 4: Verify Installation**
1. Start your dev server: `npm run dev`
2. Open browser → F12 → Console
3. You should see analytics events logging in development
4. In production, check GA4 Real-Time reports

---

## 📈 **Events Being Tracked**

### **CTA Buttons** (Hero Section)
- ✅ `click_start_trial` - When "Start Free Trial" is clicked
- ✅ `click_watch_demo` - When "Watch Demo" is clicked

### **Pricing Section**
- ✅ `click_pricing_cta` - When any pricing button is clicked
  - Label: "Free", "Pro", or "Enterprise"
- ✅ `toggle_pricing_cycle` - When billing toggle is switched
  - Label: "monthly" or "yearly"

### **Contact Form**
- ✅ `submit_contact_form_success` - Form submitted successfully
- ✅ `submit_contact_form_error` - Form submission failed

### **FAQ Engagement**
- ✅ `click_faq` - When FAQ question is expanded
  - Label: Actual question text

### **Trial Signup**
- ✅ `signup_trial` - When trial signup is completed
- ✅ `conversion` - Sent to Google Ads (if configured)

### **Navigation**
- ✅ `click_navigation` - When nav links are clicked
  - Label: "features", "pricing", "contact", etc.

### **Social Links**
- ✅ `click_social` - When social icons are clicked
  - Label: "twitter", "linkedin", "github"

### **Scroll Depth** (Auto-tracked)
- ✅ `scroll_depth` - At 25%, 50%, 75%, 100%

---

## 🔧 **Advanced Configuration**

### **Google Ads Conversion Tracking**

If you're running Google Ads, track conversions:

1. Go to [Google Ads](https://ads.google.com/)
2. Tools → "Conversions"
3. Click "+ New Conversion Action"
4. Choose "Website"
5. Copy the Conversion ID and Label

Add to `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXX
```

Update `src/lib/analytics.ts` line 58:
```typescript
send_to: 'AW-YOUR_ID/YOUR_LABEL',
```

---

### **Microsoft Clarity (Free Heatmaps)**

Get visual insights with heatmaps and session recordings:

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign up for free
3. Create new project
4. Copy the Project ID

Update `src/components/analytics/GoogleAnalytics.tsx` line 35:
```typescript
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "YOUR_CLARITY_ID");
```

**Features:**
- ✅ Heatmaps (where users click)
- ✅ Session recordings (watch user sessions)
- ✅ Scroll maps (how far users scroll)
- ✅ 100% free, unlimited recordings

---

### **Facebook Pixel (Optional)**

Track conversions from Facebook Ads:

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create Pixel
3. Copy Pixel ID

Add to `GoogleAnalytics.tsx`:
```typescript
<Script
  id="facebook-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    `,
  }}
/>
```

---

## 📊 **Custom Events You Can Add**

### **Example: Track Video Play**

Add to the VideoModal component:
```typescript
// In VideoModal, add to iframe
onPlay={() => analytics.trackVideoPlay()}
```

### **Example: Track Integration Hover**

Add to IntegrationSection logos:
```typescript
onMouseEnter={() => analytics.trackIntegrationHover(integration.name)}
```

### **Example: Track Testimonial Clicks**

Add to testimonial cards:
```typescript
onClick={() => trackEvent({
  action: 'click_testimonial',
  category: 'Engagement',
  label: testimonial.company
})}
```

---

## 🎯 **Key Metrics to Monitor**

### **Conversion Funnel:**
1. **Page Views** - Total visitors
2. **CTA Clicks** - How many click "Start Trial"
3. **Trial Signups** - How many complete signup
4. **Conversion Rate** = Signups / Page Views

**Target:** 3-5% conversion rate

### **Engagement Metrics:**
- **Scroll Depth** - Are users scrolling to pricing?
  - Target: 70%+ reach pricing section
- **FAQ Engagement** - Which questions are clicked most?
- **Pricing Toggle** - Do users prefer monthly or yearly?
- **Demo Video** - How many watch the demo?

### **Form Performance:**
- **Contact Form Starts** - Users who start typing
- **Contact Form Completions** - Users who submit
- **Completion Rate** - Completions / Starts
  - Target: 60%+ completion rate

---

## 🔍 **GA4 Reports to Create**

### **1. Conversion Report**
Track trial signups over time:
- Events: `signup_trial`
- Chart: Line graph, last 30 days
- Compare: Month over month

### **2. CTA Performance**
Compare which CTAs work best:
- Events: `click_start_trial`, `click_watch_demo`
- Chart: Bar chart
- Metric: Click-through rate

### **3. Pricing Analysis**
Which plan gets most attention:
- Events: `click_pricing_cta`
- Breakdown: By plan (Free/Pro/Enterprise)
- Breakdown: By billing cycle (monthly/yearly)

### **4. User Journey**
See typical user path:
- Path Exploration report
- Start: Landing page view
- End: Trial signup

### **5. Form Funnel**
Track contact form completion:
- Step 1: Form view
- Step 2: Form start (first field filled)
- Step 3: Form submit
- Step 4: Success

---

## 🧪 **Testing Analytics**

### **Development Mode:**
Events are logged to console:
```
📊 Analytics Event: {
  action: 'click_start_trial',
  category: 'CTA',
  label: 'Start Free Trial Button'
}
```

### **Production Mode:**

**1. Real-Time Reports:**
- GA4 → Reports → Realtime
- Perform actions on your site
- See events appear in real-time (10-30 second delay)

**2. Debug View:**
- Install [Google Analytics Debugger](https://chrome.google.com/webstore) Chrome extension
- Open site, perform actions
- Check console for detailed GA events

**3. GA4 Debug Mode:**
Add to URL: `?debug_mode=true`
- Example: `https://autoflowai.com/?debug_mode=true`
- Events show in DebugView in GA4

---

## 📱 **Additional Tracking Pixels**

### **LinkedIn Insight Tag**
```html
<Script
  id="linkedin-insight"
  dangerouslySetInnerHTML={{
    __html: `
      _linkedin_partner_id = "YOUR_PARTNER_ID";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `,
  }}
/>
```

### **Twitter Pixel**
```html
<Script
  id="twitter-pixel"
  dangerouslySetInnerHTML={{
    __html: `
      !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
      },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
      a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
      twq('config','YOUR_PIXEL_ID');
    `,
  }}
/>
```

---

## 🎯 **Privacy & GDPR Compliance**

### **Cookie Consent**
Before going live, add cookie consent banner:

**Recommended libraries:**
- `react-cookie-consent`
- `cookie-consent-box`
- `@cookiehub/cookie-consent`

**Must include:**
- ✅ Cookie policy link
- ✅ Opt-in for analytics cookies
- ✅ Opt-out mechanism
- ✅ Cookie settings page

### **IP Anonymization**
Already configured in `GoogleAnalytics.tsx`:
```typescript
anonymize_ip: true,  // GDPR compliant
```

### **Data Retention**
In GA4:
1. Admin → Data Settings → Data Retention
2. Set to 14 months (recommended)
3. Enable "Reset user data on new activity"

---

## 📊 **Sample Dashboard Setup**

### **GA4 Custom Dashboard:**

**Card 1: Key Metrics**
- Total Users (last 30 days)
- Trial Signups
- Conversion Rate
- Average Engagement Time

**Card 2: Top Events**
- click_start_trial
- click_pricing_cta
- submit_contact_form_success
- click_faq

**Card 3: User Acquisition**
- Traffic sources (Organic, Direct, Social, Referral)
- Top landing pages
- Top exit pages

**Card 4: Engagement**
- Scroll depth distribution
- FAQ most clicked
- Pricing toggle usage (monthly vs yearly)

---

## 🚀 **Going Live Checklist**

Before launching to production:

**Analytics:**
- [ ] Replace `G-XXXXXXXXXX` with real GA4 Measurement ID
- [ ] Test all events in GA4 DebugView
- [ ] Set up conversion goals in GA4
- [ ] Create custom dashboard
- [ ] Set up email alerts for conversions

**Privacy:**
- [ ] Add cookie consent banner
- [ ] Create Privacy Policy page
- [ ] Update Privacy Policy with analytics disclosure
- [ ] Add opt-out mechanism
- [ ] Test GDPR compliance

**Verification:**
- [ ] Verify Google Analytics is tracking
- [ ] Verify Microsoft Clarity (if using)
- [ ] Verify conversion pixels (if using Ads)
- [ ] Test in incognito mode
- [ ] Test on mobile devices

---

## 📖 **Resources**

- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Microsoft Clarity Docs](https://docs.microsoft.com/en-us/clarity/)
- [GDPR Compliance Guide](https://gdpr.eu/cookies/)

---

## 💡 **Pro Tips**

1. **Start Simple** - Focus on key conversions first (trial signups)
2. **Test Everything** - Use DebugView before going live
3. **Set Goals** - Define what success looks like (e.g., 5% trial signup rate)
4. **Review Weekly** - Check analytics every week, optimize based on data
5. **A/B Test** - Use data to test different headlines, CTAs, pricing

---

**Your analytics tracking is now ready!** 🎉

Just add your GA4 Measurement ID to start collecting data.





