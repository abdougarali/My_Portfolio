'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Professional Company Logo Components (SVG)
const ZapierLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="zapier-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4A00"/>
        <stop offset="100%" stopColor="#FF6B35"/>
      </linearGradient>
    </defs>
    <path d="M15 5h-5v5h5V5zm0 10h-5v5h5v-5zM5 15H0v5h5v-5zm10 0h-5v5h5v-5zM5 5H0v5h5V5zm15 7.5L10 22.5 0 12.5h20z" fill="url(#zapier-gradient)"/>
    <text x="30" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Zapier</text>
  </svg>
);

const AsanaLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="asana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F06A6A"/>
        <stop offset="100%" stopColor="#C13C37"/>
      </linearGradient>
    </defs>
    <circle cx="8" cy="8" r="4" fill="url(#asana-gradient)"/>
    <circle cx="3" cy="18" r="4" fill="url(#asana-gradient)"/>
    <circle cx="13" cy="18" r="4" fill="url(#asana-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Asana</text>
  </svg>
);

const MondayLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="monday-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF3D71"/>
        <stop offset="100%" stopColor="#C2185B"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="3" height="18" rx="1.5" fill="url(#monday-gradient)"/>
    <rect x="8" y="5" width="3" height="15" rx="1.5" fill="url(#monday-gradient)"/>
    <rect x="14" y="8" width="3" height="12" rx="1.5" fill="url(#monday-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">monday</text>
  </svg>
);

const NotionLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="notion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000000"/>
        <stop offset="100%" stopColor="#373737"/>
      </linearGradient>
    </defs>
    <path d="M6 2h10l5 10-5 10H6l-2.5-10L6 2zm4 8v8l2.5-4-2.5-4z" fill="url(#notion-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Notion</text>
  </svg>
);

const SlackLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="slack-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E01E5A"/>
        <stop offset="25%" stopColor="#36C5F0"/>
        <stop offset="50%" stopColor="#2EB67D"/>
        <stop offset="75%" stopColor="#ECB22E"/>
        <stop offset="100%" stopColor="#E01E5A"/>
      </linearGradient>
    </defs>
    <rect x="2" y="10" width="5" height="5" rx="1" fill="url(#slack-gradient)"/>
    <rect x="2" y="3" width="5" height="5" rx="1" fill="url(#slack-gradient)"/>
    <rect x="9" y="10" width="5" height="5" rx="1" fill="url(#slack-gradient)"/>
    <rect x="16" y="10" width="5" height="5" rx="1" fill="url(#slack-gradient)"/>
    <rect x="9" y="17" width="5" height="5" rx="1" fill="url(#slack-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Slack</text>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="google-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4"/>
        <stop offset="25%" stopColor="#34A853"/>
        <stop offset="50%" stopColor="#FBBC05"/>
        <stop offset="75%" stopColor="#EA4335"/>
        <stop offset="100%" stopColor="#4285F4"/>
      </linearGradient>
    </defs>
    <circle cx="10" cy="10" r="7" fill="none" stroke="url(#google-gradient)" strokeWidth="1.5"/>
    <path d="M10 3v7h7" stroke="url(#google-gradient)" strokeWidth="1.5" fill="none"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Google</text>
  </svg>
);

const SalesforceLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="salesforce-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00A1E0"/>
        <stop offset="100%" stopColor="#1798C1"/>
      </linearGradient>
    </defs>
    <circle cx="6" cy="10" r="3" fill="url(#salesforce-gradient)"/>
    <circle cx="12" cy="12" r="4" fill="url(#salesforce-gradient)"/>
    <circle cx="8" cy="17" r="2.5" fill="url(#salesforce-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Salesforce</text>
  </svg>
);

const HubSpotLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="hubspot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7A59"/>
        <stop offset="100%" stopColor="#FF5722"/>
      </linearGradient>
    </defs>
    <circle cx="10" cy="10" r="5" fill="url(#hubspot-gradient)"/>
    <circle cx="4" cy="10" r="1.5" fill="url(#hubspot-gradient)"/>
    <circle cx="16" cy="10" r="1.5" fill="url(#hubspot-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">HubSpot</text>
  </svg>
);

const DropboxLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="dropbox-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0061FF"/>
        <stop offset="100%" stopColor="#0041CC"/>
      </linearGradient>
    </defs>
    <polygon points="10,6 6,10 10,14 14,10" fill="url(#dropbox-gradient)"/>
    <polygon points="10,14 6,18 10,22 14,18" fill="url(#dropbox-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Dropbox</text>
  </svg>
);

const TrelloLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="trello-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0079BF"/>
        <stop offset="100%" stopColor="#005A8B"/>
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="4" height="12" rx="1" fill="url(#trello-gradient)"/>
    <rect x="10" y="4" width="4" height="8" rx="1" fill="url(#trello-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Trello</text>
  </svg>
);

const MailchimpLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="mailchimp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE01B"/>
        <stop offset="100%" stopColor="#FFD700"/>
      </linearGradient>
    </defs>
    <circle cx="8" cy="10" r="4" fill="url(#mailchimp-gradient)"/>
    <path d="M8 14 Q4 18, 8 21 Q12 18, 8 14" fill="url(#mailchimp-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Mailchimp</text>
  </svg>
);

const ShopifyLogo = () => (
  <svg viewBox="0 0 100 30" className="w-20 h-6">
    <defs>
      <linearGradient id="shopify-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#96BF48"/>
        <stop offset="100%" stopColor="#7AB55C"/>
      </linearGradient>
    </defs>
    <path d="M8 3 L12 5 L10 18 L6 16 Z" fill="url(#shopify-gradient)"/>
    <circle cx="9" cy="8" r="1.5" fill="url(#shopify-gradient)"/>
    <text x="25" y="18" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui">Shopify</text>
  </svg>
);

// Main Company Logos Component
export const CompanyLogos = () => {
  const companies = [
    { name: 'Zapier', component: ZapierLogo },
    { name: 'Asana', component: AsanaLogo },
    { name: 'Monday', component: MondayLogo },
    { name: 'Notion', component: NotionLogo },
    { name: 'Slack', component: SlackLogo },
    { name: 'Google', component: GoogleLogo },
    { name: 'Salesforce', component: SalesforceLogo },
    { name: 'HubSpot', component: HubSpotLogo },
    { name: 'Dropbox', component: DropboxLogo },
    { name: 'Trello', component: TrelloLogo },
    { name: 'Mailchimp', component: MailchimpLogo },
    { name: 'Shopify', component: ShopifyLogo },
  ];

  // Duplicate for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="w-full overflow-hidden py-8 sm:py-10">
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Animated Logo Track */}
        <motion.div
          className="flex space-x-8 sm:space-x-12 lg:space-x-16"
          animate={{
            x: [0, -1200], // Adjusted for smaller logos
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedCompanies.map((company, index) => {
            const LogoComponent = company.component;
            return (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center justify-center flex-shrink-0 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                title={company.name}
              >
                <LogoComponent />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyLogos;

