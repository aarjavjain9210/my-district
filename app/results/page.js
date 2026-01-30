
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditableItinerary from '@/app/components/results/EditableItinerary';

export default function ResultsPage() {
  const router = useRouter();
  const [itineraries, setItineraries] = useState([]);
  const [totalCombinations, setTotalCombinations] = useState(0);
  const [originalRequestData, setOriginalRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get current day of the week
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % itineraries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + itineraries.length) % itineraries.length);
  };

  useEffect(() => {
    // Read from sessionStorage
    const storedData = sessionStorage.getItem('itineraryResults');
    const storedRequest = sessionStorage.getItem('originalRequest');
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setItineraries(parsed.itineraries || []);
        setTotalCombinations(parsed.totalCombinations || 0);
      } catch (error) {
        console.error('Error parsing itinerary data:', error);
      }
    }
    
    if (storedRequest) {
      try {
        setOriginalRequestData(JSON.parse(storedRequest));
      } catch (error) {
        console.error('Error parsing request data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const handleRegenerate = async (payload, itineraryIndex) => {
    try {
      const response = await fetch('/api/plan-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Replace ALL itineraries with new top 4
        if (result.itineraries && result.itineraries.length > 0) {
          setItineraries(result.itineraries);
          setTotalCombinations(result.totalCombinations);
          
          // Update sessionStorage
          sessionStorage.setItem('itineraryResults', JSON.stringify({
            itineraries: result.itineraries,
            totalCombinations: result.totalCombinations
          }));
          
        }
        return result;
      } else {
        // Check for no new permutations
        if (result.noNewPermutations) {
          return result;
        }
        // Show detailed error message
        const errorMsg = result.details || result.error || 'Failed to regenerate itinerary';
        alert(`❌ ${errorMsg}`);
        return result;
      }
    } catch (error) {
      console.error('Error regenerating:', error);
      alert(`Network error: ${error.message}`);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-500">Loading your itineraries...</p>
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-purple-500">No itineraries found</p>
          <a href="/plan" className="mt-4 inline-block text-purple-400 hover:text-purple-300">
            ← Back to Planning
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-600 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Your {getDayOfWeek()} in the District
            </h1>
            <a
              href="/plan"
              className="mt-4 inline-block text-white hover:text-purple-200 font-medium"
            >
              ← Plan Another Itinerary
            </a>
        </div>

        {/* Itinerary Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrev}
              disabled={itineraries.length <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            
            <button
              onClick={handleNext}
              disabled={itineraries.length <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Current Itinerary with Animation */}
          <div className="overflow-hidden">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
            >
              {itineraries.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <EditableItinerary
                    itinerary={item}
                    index={index}
                    totalItineraries={itineraries.length}
                    originalData={originalRequestData}
                    onRegenerate={handleRegenerate}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
