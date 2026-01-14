'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Globe
} from 'lucide-react';
import SimpleThemeToggle from './SimpleThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Smooth scrolling function
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle dropdown hover with delay
  const handleDropdownEnter = (dropdownType: 'products' | 'solutions') => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (dropdownType === 'products') {
      setIsProductsOpen(true);
    } else {
      setIsSolutionsOpen(true);
    }
  };

  const handleDropdownLeave = (dropdownType: 'products' | 'solutions') => {
    const timeout = setTimeout(() => {
      if (dropdownType === 'products') {
        setIsProductsOpen(false);
      } else {
        setIsSolutionsOpen(false);
      }
    }, 150); // Small delay to prevent flickering
    setHoverTimeout(timeout);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Handle smooth scrolling to sections
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      console.log('Scrolling to:', targetId, 'Element found:', !!targetElement);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close dropdowns after a small delay to ensure scroll starts
        setTimeout(() => {
          setIsProductsOpen(false);
          setIsSolutionsOpen(false);
          setIsMenuOpen(false);
        }, 100);
      } else {
        console.warn('Target element not found:', targetId);
      }
    }
  };


  const navigation = [
    {
      name: 'Products',
      href: '#',
      hasDropdown: true,
      items: [
        { name: 'AI Automation', description: 'Intelligent workflow automation', icon: <Zap className="w-4 h-4" />, href: '#features' },
        { name: 'Security Suite', description: 'Enterprise-grade protection', icon: <Shield className="w-4 h-4" />, href: '#features' },
        { name: 'Team Collaboration', description: 'Real-time communication tools', icon: <Users className="w-4 h-4" />, href: '#features' },
        { name: 'Global Infrastructure', description: 'Worldwide deployment network', icon: <Globe className="w-4 h-4" />, href: '#features' }
      ]
    },
    {
      name: 'Solutions',
      href: '#',
      hasDropdown: true,
      items: [
        { name: 'Startup Accelerator', description: 'Scale from 0 to enterprise', href: '#pricing' },
        { name: 'Enterprise Platform', description: 'Advanced security & compliance', href: '#pricing' },
        { name: 'Agency Management', description: 'Multi-client workflow automation', href: '#pricing' },
        { name: 'Developer Tools', description: 'APIs, SDKs & integrations', href: '#pricing' }
      ]
    },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' }
  ];

  const DropdownMenu = ({ items, isOpen, onClose }: { items: any[] | undefined, isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && items && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-4 z-50"
          onMouseEnter={() => {
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              setHoverTimeout(null);
            }
          }}
          onMouseLeave={onClose}
        >
          <div className="px-6 pb-2">
            <div className="grid gap-3">
              {items.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href || '#'}
                  onClick={(e) => handleSmoothScroll(e, item.href || '#')}
                  className="flex items-start p-3 rounded-lg hover:bg-blue-50/30 dark:hover:bg-gray-800/30 focus:bg-blue-50/30 dark:focus:bg-gray-800/30 active:bg-blue-50/50 dark:active:bg-gray-700/40 transition-colors duration-200 group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.icon && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 mt-0.5">
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="px-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, '#features')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/30 dark:hover:bg-gray-800/30 focus:bg-blue-50/30 dark:focus:bg-gray-800/30 active:bg-blue-50/50 dark:active:bg-gray-700/40 rounded-lg transition-colors"
            >
              View all products
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/10 dark:bg-gray-950/40 backdrop-blur-2xl shadow-lg dark:shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <a href="#" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  AutoFlow<span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <div key={index} className="relative">
                  {item.hasDropdown ? (
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                      onMouseEnter={() => {
                        if (item.name === 'Products') handleDropdownEnter('products');
                        if (item.name === 'Solutions') handleDropdownEnter('solutions');
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Products') handleDropdownLeave('products');
                        if (item.name === 'Solutions') handleDropdownLeave('solutions');
                      }}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.a
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      href={item.href}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                      className="text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {item.name}
                    </motion.a>
                  )}
                  
                  {item.name === 'Products' && (
                    <DropdownMenu 
                      items={item.items} 
                      isOpen={isProductsOpen} 
                      onClose={() => setIsProductsOpen(false)} 
                    />
                  )}
                  {item.name === 'Solutions' && (
                    <DropdownMenu 
                      items={item.items} 
                      isOpen={isSolutionsOpen} 
                      onClose={() => setIsSolutionsOpen(false)} 
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <SimpleThemeToggle />
              </motion.div>

              {/* CTA Button */}
              <motion.a
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                href="#pricing"
                onClick={(e) => handleSmoothScroll(e, '#pricing')}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started
              </motion.a>

              {/* Mobile menu button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile menu panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      AutoFlow<span className="text-blue-600 dark:text-blue-400">AI</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile menu content */}
                <div className="flex-1 overflow-y-auto p-6 mobile-menu-scroll">
                  <nav className="space-y-6">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <a
                          href={item.href}
                          className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-white/80 transition-colors"
                          onClick={(e) => {
                            setIsMenuOpen(false);
                            handleSmoothScroll(e, item.href);
                          }}
                        >
                          {item.name}
                        </a>
                        {item.items && (
                          <div className="mt-2 space-y-2 pl-4">
                            {item.items.slice(0, 3).map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href="#"
                                className="block text-sm text-gray-600 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Mobile menu footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    href="#pricing"
                    className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      handleSmoothScroll(e, '#pricing');
                    }}
                  >
                    Get Started
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;