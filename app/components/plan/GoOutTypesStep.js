
'use client';

import { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import GoOutFilters from './GoOutFilters';

const GO_OUT_TYPES = [
  { id: 'dinings', name: 'Dining', icon: '🍽️' },
  { id: 'movies', name: 'Movie', icon: '🎬' },
  { id: 'events', name: 'Event', icon: '🎉' },
  { id: 'activities', name: 'Activity', icon: '🎯' },
  { id: 'plays', name: 'Play', icon: '⚽' }
];

export default function GoOutTypesStep({ formData, onBack, onSubmit, setFormData, isGenerating }) {
  const [selectedTypes, setSelectedTypes] = useState(formData.preferredTypes || []);
  const [showAddCard, setShowAddCard] = useState(false);

  const addGoOutType = (typeId) => {
    const newType = { [typeId]: { filters: {} } };
    setSelectedTypes(prev => [...prev, newType]);
    setFormData(prev => ({ ...prev, preferredTypes: [...prev.preferredTypes, newType] }));
    setShowAddCard(false);
  };

  const removeGoOutType = (index) => {
    const newTypes = selectedTypes.filter((_, i) => i !== index);
    setSelectedTypes(newTypes);
    setFormData(prev => ({ ...prev, preferredTypes: newTypes }));
  };

  const updateGoOutFilters = (index, filters) => {
    const newTypes = [...selectedTypes];
    const typeKey = Object.keys(newTypes[index])[0];
    newTypes[index] = { [typeKey]: filters };
    setSelectedTypes(newTypes);
    setFormData(prev => ({ ...prev, preferredTypes: newTypes }));
  };

  const handleSubmit = () => {
    if (selectedTypes.length === 0) {
      alert('Please add at least one go-out type');
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Go-Outs</h2>
        <p className="text-gray-600">Add and customize the activities for your itinerary</p>
      </div>

      {/* Selected Go-Out Types */}
      <div className="space-y-4">
        {selectedTypes.map((type, index) => {
          const typeKey = Object.keys(type)[0];
          const typeInfo = GO_OUT_TYPES.find(t => t.id === typeKey);
          
          return (
            <div key={index} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{typeInfo?.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {typeInfo?.name} #{index + 1}
                  </h3>
                </div>
                <button
                  onClick={() => removeGoOutType(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <GoOutFilters
                type={typeKey}
                filters={type[typeKey]}
                onUpdate={(filters) => updateGoOutFilters(index, filters)}
              />
            </div>
          );
        })}
      </div>

      {/* Add Go-Out Type Card */}
      {!showAddCard && (
        <button
          onClick={() => setShowAddCard(true)}
          className="w-full py-4 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-lg text-purple-600 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Go-Out Type
        </button>
      )}

      {showAddCard && (
        <div className="border-2 border-purple-300 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Go-Out Type</h3>
            <button
              onClick={() => setShowAddCard(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {GO_OUT_TYPES.map((type, idx) => (
              <button
                key={type.id}
                onClick={() => addGoOutType(type.id)}
                className={`p-4 border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-lg transition-all text-center ${
                  idx < 3 ? 'w-[calc(33.333%-0.5rem)]' : 'w-[calc(33.333%-0.5rem)] md:w-auto'
                }`}
                style={idx >= 3 ? { minWidth: 'calc(33.333% - 0.5rem)' } : {}}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-medium text-gray-900">{type.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-4 px-6 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedTypes.length === 0 || isGenerating}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Itinerary'
          )}
        </button>
      </div>
    </div>
  );
}
