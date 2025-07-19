import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Stethoscope, 
  ArrowRight,
  Star,
  Users,
  MapPin,
  TrendingDown,
  Zap,
  Brain,
  Activity,
  Heart,
  Wheat,
  Globe
} from 'lucide-react';

const modules = [
  {
    id: 'aigardenadvisor',
    name: 'AI Garden Advisor',
    hindiName: 'AI बगीचा सलाहकार',
    description: 'Get intelligent, AI-powered advice for your garden and crops with personalized recommendations tailored for Indian farming conditions.',
    icon: Brain,
    color: 'from-green-500 to-emerald-600',
    features: ['Smart Plant Care', 'Disease Detection', 'Growth Optimization'],
    popular: true
  },
  {
    id: 'cropsimulation',
    name: 'Advanced 3D Crop Simulation',
    hindiName: 'उन्नत 3D फसल सिमुलेशन',
    description: 'Revolutionary 3D crop growth simulation with real farm parameters, biosphere integration, and advanced farming techniques.',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    features: ['3D Visualization', 'Biosphere Systems', 'Mixed Cropping', 'Rice-Fish Integration'],
    new: true
  },
  {
    id: 'crop-management',
    name: 'Smart Crop Management',
    hindiName: 'स्मार्ट फसल प्रबंधन',
    description: 'Comprehensive crop management with smart fertilizer recommendations, pest control, and ROI optimization.',
    icon: Wheat,
    color: 'from-purple-500 to-pink-600',
    features: ['Smart Fertilizers', 'Pest Management', 'ROI Analysis', 'Biosphere Integration'],
    popular: true
  },
  {
    id: 'cattlefarmmanagement',
    name: 'Cattle Management',
    hindiName: 'पशु प्रबंधन',
    description: 'Complete cattle farm operations management with health tracking, breeding records, and feed optimization for Indian breeds.',
    icon: Heart,
    color: 'from-amber-500 to-orange-600',
    features: ['Health Monitoring', 'Feed Management', 'Breeding Records', 'Milk Production'],
    popular: true
  },
  {
    id: 'greenguardian/dashboard',
    name: 'Green Guardian',
    hindiName: 'हरित संरक्षक',
    description: 'Satellite-based environmental monitoring with real-time alerts for pest control, weather warnings, and crop health.',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    features: ['Satellite Imagery', 'Risk Alerts', 'Environmental Data', 'Pest Detection'],
    new: true
  },
  {
    id: 'demandanalysis',
    name: 'Market Intelligence',
    hindiName: 'बाजार विश्लेषण',
    description: 'Real-time market prices, demand forecasting, and crop trading insights with APMC mandi data integration.',
    icon: TrendingUp,
    color: 'from-rose-500 to-pink-600',
    features: ['Price Trends', 'Demand Forecasting', 'Mandi Rates', 'Export Opportunities'],
    popular: true
  },
  {
    id: 'plantdiseaseprediction',
    name: 'Disease Detection',
    hindiName: 'रोग पहचान',
    description: 'AI-powered plant disease identification with treatment recommendations using local remedies and chemicals.',
    icon: Stethoscope,
    color: 'from-teal-500 to-cyan-600',
    features: ['Image Analysis', 'Disease ID', 'Treatment Plans', 'Organic Solutions']
  }
];

const stats = [
  { label: 'Active Farms', value: '25,000+', icon: MapPin },
  { label: 'Happy Farmers', value: '1,20,000+', icon: Users },
  { label: 'AI Accuracy', value: '98.7%', icon: Activity },
  { label: 'Cost Savings', value: '₹50 Cr+', icon: TrendingDown }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/10 to-purple-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6 animate-pulse">
                <Wheat className="w-4 h-4 mr-2" />
                भारतीय किसानों के लिए AI तकनीक (AI Technology for Indian Farmers)
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Smart
                </span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Farming
                </span>{' '}
                for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  India
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Revolutionize your farming with AI-powered insights, real-time crop monitoring, and predictive analytics. 
                Designed specifically for Indian agriculture with support for Hindi, regional crops, and local market data.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/cropsimulation"
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
                >
                  फसल सिमुलेशन शुरू करें (Start Crop Simulation)
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/aigardenadvisor"
                  className="group bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold hover:border-green-300 hover:text-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  AI सलाहकार (AI Advisor)
                  <Brain className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  AI-Powered Insights
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2 text-blue-500" />
                  India-Specific Data
                </div>
                <div className="flex items-center text-gray-600">
                  <Wheat className="w-4 h-4 mr-2 text-green-500" />
                  Regional Crop Support
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Live Farm Dashboard</h3>
                  <p className="text-green-100">Real-time monitoring for your crops</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rice (Basmati)</span>
                    <span className="text-green-600 font-semibold">Excellent Health</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">28°C</div>
                      <div className="text-xs text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-xs text-gray-600">Soil Moisture</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                🌱
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                💧
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-green-50 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empowering <span className="text-green-600">Indian Agriculture</span> with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform has transformed farming across India, helping farmers increase yields, 
              reduce costs, and make data-driven decisions for sustainable agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      Live
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Complete Farming Solutions
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive <span className="text-green-600">Agricultural Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to modernize your farming operations. From AI-powered crop monitoring to market intelligence - all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {(module.popular || module.new) && (
                    <div className="absolute top-4 right-4 z-10">
                      {module.popular && (
                        <div className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </div>
                      )}
                      {module.new && (
                        <div className="flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full mt-1">
                          <Zap className="w-3 h-3 mr-1" />
                          New
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                          {module.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {module.hindiName}
                        </p>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {module.description}
                      </p>

                      <div className="space-y-2">
                        {module.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-500">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/${module.id}`}
                        className="group/btn inline-flex items-center justify-between w-full mt-6 px-4 py-3 bg-gray-50 hover:bg-green-100 text-gray-700 hover:text-green-800 rounded-xl font-medium transition-all duration-300 border border-gray-200 hover:border-green-300"
                      >
                        <span>Explore Module</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/cropsimulation"
              className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
