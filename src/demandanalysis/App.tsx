"use client";
import { useState, useEffect } from 'react';
import { Sprout, BarChart3, MapPin, TrendingUp, Car, Fuel, Calculator, Navigation, Loader2, Wheat, ArrowLeft } from 'lucide-react';
import { LocationInput } from './components/LocationInput';
import { CropSelector } from './components/CropSelector';
import { PriceForecastChart } from './components/PriceForecastChart';
import { SeasonalAnalysis } from './components/SeasonalAnalysis';
import { MarketRecommendations } from './components/MarketRecommendations';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DataProcessor } from './utils/dataProcessor';
import { LocationData, PriceForecast, SeasonalPattern, VehicleInfo, MarketInfo } from './types/market';
import { VehicleInfoInput } from './components/VehicleInfoInput';
import { StateMarketRecommendations } from './components/StateMarketRecommendations';

function App() {
  const [dataProcessor] = useState(new DataProcessor());
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading market data...');
  
  // Data states
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [varieties, setVarieties] = useState<string[]>([]);
  
  // User input states
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedVariety, setSelectedVariety] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({ fuelPrice: 105, mileage: 12 });
  const [locationMethod, setLocationMethod] = useState<'auto' | 'manual'>('auto');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Analysis states
  const [forecasts, setForecasts] = useState<PriceForecast[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [recommendedMarkets, setRecommendedMarkets] = useState<MarketInfo[]>([]);
  const [bestStateMarkets, setBestStateMarkets] = useState<MarketInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const costPerKm = vehicleInfo.mileage > 0 ? vehicleInfo.fuelPrice / vehicleInfo.mileage : 0;

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingMessage('Loading APMC market data...');
        await dataProcessor.loadData();
        
        setLoadingMessage('Processing market information...');
        const availableStates = dataProcessor.getStates();
        const availableVarieties = dataProcessor.getVarieties();
        
        setStates(availableStates);
        setVarieties(availableVarieties);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setLoadingMessage('Error loading data. Please refresh the page.');
      }
    };

    initializeData();
  }, [dataProcessor]);

  const handleLocationChange = (newLocation: LocationData | null) => {
    setLocation(newLocation);
    if (!newLocation) {
      setBestStateMarkets([]);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedMarket('');
    const stateDistricts = dataProcessor.getDistricts(state);
    setDistricts(stateDistricts);
    setMarkets([]);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedMarket('');
    if (selectedState && district) {
      const districtMarkets = dataProcessor.getMarkets(selectedState, district);
      setMarkets(districtMarkets);
    }
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      const locationData: LocationData = {
        latitude,
        longitude,
        address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        state: selectedState || 'Unknown',
        district: selectedDistrict || 'Unknown',
        market: selectedMarket || ''
      };

      handleLocationChange(locationData);
    } catch (error) {
      console.error('Error detecting location:', error);
      
      let errorMessage = 'Unable to detect location. Please select manually.';
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services or select manually.';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please select manually.';
            break;
          case GeolocationPositionError.TIMEOUT:
            errorMessage = 'Location request timed out. Please select manually.';
            break;
        }
      }
      
      alert(errorMessage);
      setLocationMethod('manual');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleMileageChange = (mileage: number) => {
    setVehicleInfo({ ...vehicleInfo, mileage });
  };

  const handleFuelPriceChange = (fuelPrice: number) => {
    setVehicleInfo({ ...vehicleInfo, fuelPrice });
  };

  const commonVehicles = [
    { name: 'Motorcycle', mileage: 45 },
    { name: 'Small Car', mileage: 18 },
    { name: 'Pickup Truck', mileage: 12, selected: true },
    { name: 'Tractor', mileage: 8 },
    { name: 'Mini Truck', mileage: 10 }
  ];

  // Analyze market data when variety is selected
  const analyzeMarket = async () => {
    if (!selectedVariety) return;

    setIsAnalyzing(true);
    
    try {
      const priceForecast = dataProcessor.generatePriceForecast(selectedVariety, 12);
      setForecasts(priceForecast);

      const patterns = dataProcessor.getSeasonalPatterns(selectedVariety);
      setSeasonalPatterns(patterns);

      const bestMarkets = dataProcessor.getBestMarkets(
        selectedVariety, 
        location?.state, 
        location?.market
      );
      setRecommendedMarkets(bestMarkets);

      if (location?.state) {
        const stateMarkets = dataProcessor.getBestStateMarkets(selectedVariety, location.state, 3);
        setBestStateMarkets(stateMarkets);
      }

    } catch (error) {
      console.error('Error analyzing market data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedVariety) {
      analyzeMarket();
    }
  }, [selectedVariety, location]);

  // Scroll to top when selectedVariety changes
  useEffect(() => {
    if (selectedVariety) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedVariety]);




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="mx-auto text-green-600 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">APMC Market Advisor</h1>
          <LoadingSpinner message={loadingMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Professional Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-600 rounded-2xl">
                <Sprout className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">APMC Market Advisor</h1>
                <p className="text-sm text-gray-900 font-bold">Smart farming decisions with AI-powered insights</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="text-green-700" size={16} />
                <span className="text-sm text-gray-900 font-bold">Location-based</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="text-green-700" size={16} />
                <span className="text-sm text-gray-900 font-bold">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-700" size={16} />
                <span className="text-sm text-gray-900 font-bold">AI Predictions</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedVariety ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to APMC Market Advisor
              </h2>
                <p className="text-gray-900 text-xl font-bold">
                  Select your location and crop variety to get personalized market insights and AI-powered recommendations.
                </p>
              </div>

            {/* Input Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-green-100/50 rounded-3xl shadow-inner border border-blue-100/30">
              {/* Location and Crop Selection Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                <div className="space-y-6">
                  {/* Location Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-2">
                        <MapPin className="text-blue-600" size={20} />
                      </div>
                      Your Location
                    </h3>
                    
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setLocationMethod('auto')}
                        className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors border-2 ${
                          locationMethod === 'auto'
                            ? 'bg-blue-700 text-white border-blue-700 shadow-md'
                            : 'bg-gray-300 text-gray-900 border-gray-400 hover:bg-gray-400'
                        }`}
                      >
                        Auto Detect
                      </button>
                      <button
                        onClick={() => setLocationMethod('manual')}
                        className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors border-2 ${
                          locationMethod === 'manual'
                            ? 'bg-blue-700 text-white border-blue-700 shadow-md'
                            : 'bg-gray-300 text-gray-900 border-gray-400 hover:bg-gray-400'
                        }`}
                      >
                        Manual Selection
                      </button>
                    </div>

                    {locationMethod === 'auto' ? (
                      <div className="space-y-4">
                        <button
                          onClick={detectLocation}
                          disabled={isDetecting}
                          className="w-full bg-green-700 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
                        >
                          {isDetecting ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={20} />
                              Detecting Location...
                            </>
                          ) : (
                            <>
                              <Navigation className="mr-2" size={20} />
                              Detect My Location
                            </>
                          )}
                        </button>
                        <p className="text-sm text-gray-900 font-medium text-center">
                          We'll use your GPS location to find nearby markets
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            State
                          </label>
                          <select
                            value={selectedState}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-bold bg-white appearance-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23111827\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px' }}
                          >
                            <option value="" className="text-gray-900 font-bold">Select State</option>
                            {states.map(state => (
                              <option key={state} value={state} className="text-gray-900 font-bold">{state}</option>
                            ))}
                          </select>
                        </div>

                        {selectedState && (
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              District
                            </label>
                            <select
                              value={selectedDistrict}
                              onChange={(e) => handleDistrictChange(e.target.value)}
                              className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-bold bg-white appearance-none"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23111827\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px' }}
                            >
                              <option value="" className="text-gray-900 font-bold">Select District</option>
                              {districts.map(district => (
                                <option key={district} value={district} className="text-gray-900 font-bold">{district}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {selectedDistrict && (
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Market (Optional)
                            </label>
                            <select
                              value={selectedMarket}
                              onChange={(e) => setSelectedMarket(e.target.value)}
                              className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-bold bg-white appearance-none"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23111827\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px' }}
                            >
                              <option value="" className="text-gray-900 font-bold">All Markets in District</option>
                              {markets.map(market => (
                                <option key={market} value={market} className="text-gray-900 font-bold">{market}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Crop Selection Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-2">
                        <Wheat className="text-yellow-600" size={20} />
                      </div>
                      Select Your Crop
                    </h3>
                    
                    <select
                      value={selectedVariety}
                      onChange={(e) => setSelectedVariety(e.target.value)}
                      className="w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm text-gray-900 bg-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Select Crop Variety"
                    >
                      <option value="" className="text-gray-900 font-bold">Select Crop Variety</option>
                      {varieties.map(variety => (
                        <option key={variety} value={variety} className="text-gray-900 font-bold">{variety}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle & Fuel Information Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-2">
                    <Car className="text-red-600" size={20} />
                  </div>
                  Vehicle & Fuel Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                        <Fuel className="mr-1 text-red-700" size={16} />
                        Fuel Price (₹/litre)
                      </label>
                      <input
                        type="number"
                        value={vehicleInfo.fuelPrice}
                        onChange={(e) => handleFuelPriceChange(parseFloat(e.target.value) || 0)}
                        placeholder="105"
                        className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-bold bg-white placeholder-gray-500"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                        <Calculator className="mr-1 text-gray-900" size={16} />
                        Vehicle Mileage (km/litre)
                      </label>
                      <input
                        type="number"
                        value={vehicleInfo.mileage}
                        onChange={(e) => handleMileageChange(parseFloat(e.target.value) || 0)}
                        placeholder="15"
                        className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-bold bg-white placeholder-gray-500"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">Quick Select Vehicle Type:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {commonVehicles.map((vehicle) => (
                        <button
                          key={vehicle.name}
                          onClick={() => handleMileageChange(vehicle.mileage)}
                          className={`p-4 text-center border-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                            vehicleInfo.mileage === vehicle.mileage 
                              ? 'bg-green-700 text-white border-green-700 shadow-md' 
                              : 'border-gray-400 hover:bg-gradient-to-br hover:from-gray-100 hover:to-blue-100 hover:border-blue-500 bg-white hover:-translate-y-1 text-gray-900 font-bold'
                          }`}
                        >
                          <div className="font-bold text-gray-900">{vehicle.name}</div>
                          <div className="text-sm font-bold text-gray-900">{vehicle.mileage} km/l</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {vehicleInfo.mileage > 0 && vehicleInfo.fuelPrice > 0 && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
                      <p className="text-gray-900 font-bold text-xl flex items-center mb-3">
                        <span className="text-2xl mr-3">💰</span>
                        Cost Calculation Ready
                      </p>
                      <div className="space-y-2">
                        <p className="text-gray-900 font-bold text-lg">
                          Fuel cost: ₹{vehicleInfo.fuelPrice}/L • Mileage: {vehicleInfo.mileage} km/L
                        </p>
                        <p className="text-blue-800 font-black text-2xl">
                          Cost per km: ₹{(vehicleInfo.fuelPrice / vehicleInfo.mileage).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 hover:bg-green-200">
                  <TrendingUp className="text-green-800" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Price Forecasts</h3>
                <p className="text-gray-900 font-bold">Get accurate price predictions for your crops</p>
                <p className="text-green-800 font-black mt-2">AI-powered 12-month predictions</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 hover:bg-blue-200">
                  <BarChart3 className="text-blue-800" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seasonal Analysis</h3>
                <p className="text-gray-900 font-bold">Understand market trends and seasonal patterns</p>
                <p className="text-blue-800 font-black mt-2">Optimal selling periods</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-gray-100">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 hover:bg-purple-200">
                  <MapPin className="text-purple-800" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Market Recommendations</h3>
                <p className="text-gray-900 font-bold">Find the best markets for your produce</p>
                <p className="text-purple-800 font-black mt-2">Location-based insights</p>
              </div>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <LoadingSpinner message="Analyzing market data and generating insights..." />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <button
                onClick={() => setSelectedVariety('')}
                className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                <ArrowLeft size={20} />
                <span>Back to Demand Analysis</span>
              </button>
            </div>
            <PriceForecastChart 
              forecasts={forecasts} 
              variety={selectedVariety} 
            />
            
            <SeasonalAnalysis 
              patterns={seasonalPatterns} 
              variety={selectedVariety} 
            />
            
            <StateMarketRecommendations
              markets={bestStateMarkets}
              variety={selectedVariety}
              state={location?.state}
            />

            <MarketRecommendations 
              markets={recommendedMarkets} 
              bestStateMarkets={bestStateMarkets}
              variety={selectedVariety}
              userLocation={location ?? undefined} 
              vehicleInfo={vehicleInfo}
              seasonalPatterns={seasonalPatterns}
              costPerKm={costPerKm}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-900 font-bold mb-2">
              Empowering farmers with data-driven market insights
            </p>
            <p className="text-sm text-gray-900 font-semibold">
              Data sourced from APMC markets across India • Updated regularly
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
