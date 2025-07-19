"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Sprout, BarChart3, Heart, Shield, TrendingUp, Stethoscope, FlaskConical, Wheat, Briefcase, BookOpen, LandPlot } from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'AI Garden', href: '/aigardenadvisor', icon: Sprout },
    { name: '3D Crop Sim', href: '/cropsimulation', icon: BarChart3 },
    { name: 'Crop Mgmt', href: '/crop-management', icon: Wheat },
    { name: 'Cattle Farm', href: '/cattlefarmmanagement', icon: Heart },
    { name: 'Guardian', href: '/greenguardian/dashboard', icon: Shield },
    { name: 'Demand', href: '/demandanalysis', icon: TrendingUp },
    { name: 'Disease Check', href: '/plantdiseaseprediction', icon: Stethoscope },
    { name: 'CRISP', href: '/crisp', icon: FlaskConical },
    { name: 'Community Blogs', href: '/community-blogs', icon: BarChart3 },
    { name: 'Krishi Connect', href: '/krishi', icon: Briefcase },
    { name: 'Farmer Education', href: '/farmer-education', icon: BookOpen },
    { name: 'Govt. Plans', href: '/government-plans', icon: LandPlot },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-green-100' 
          : 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-green-600' : 'bg-white/20'
                }`}>
                  <Wheat className={`w-6 h-6 transition-colors duration-300 ${
                    scrolled ? 'text-white' : 'text-white'
                  }`} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Farm<span className="text-green-500">Hub</span>
                </h1>
                <p className={`text-xs transition-colors duration-300 ${
                  scrolled ? 'text-gray-600' : 'text-green-100'
                }`}>
                  Smart Agriculture
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative px-2 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1 ${
                      isActive
                        ? scrolled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white/20 text-white'
                        : scrolled
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{item.name}</span>
                    {isActive && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        scrolled ? 'bg-green-500' : 'bg-white'
                      }`}></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md border-t border-green-100 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;