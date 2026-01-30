
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, IndianRupee, Star, Navigation, Plus, Trash2, RefreshCw, Edit2, X } from 'lucide-react';
import GoOutFilters from '../plan/GoOutFilters';

const GO_OUT_TYPES = [
  { id: 'dinings', name: 'Dining', icon: '🍽️' },
  { id: 'movies', name: 'Movie', icon: '🎬' },
  { id: 'events', name: 'Event', icon: '🎉' },
  { id: 'activities', name: 'Activity', icon: '🎯' },
  { id: 'plays', name: 'Play', icon: '⚽' }
];

export default function EditableItinerary({ 
  itinerary, 
  index, 
  originalData,
  onRegenerate 
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [filters, setFilters] = useState({ filters: {} });
  const [modifiedItinerary, setModifiedItinerary] = useState(itinerary.itinerary || []);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sync local state with prop changes after regeneration
  useEffect(() => {
    if (itinerary.itinerary) {
      setModifiedItinerary(itinerary.itinerary);
      // Reset editing state when new data arrives
      setEditingIndex(null);
      setIsAdding(false);
      setSelectedType(null);
      setFilters({ filters: {} });
    }
  }, [itinerary]);

  const getTypeIcon = (type) => {
    const typeObj = GO_OUT_TYPES.find(t => t.id === type);
    return typeObj?.icon || '📍';
  };

  const handleRemove = (actIndex) => {
    const newItinerary = modifiedItinerary.filter((_, i) => i !== actIndex);
    setModifiedItinerary(newItinerary);
  };

  const handleReplace = (actIndex) => {
    setEditingIndex(actIndex);
    setIsAdding(false);
    setSelectedType(null);
    setFilters({ filters: {} });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setSelectedType(null);
    setFilters({ filters: {} });
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  const handleFilterUpdate = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveEdit = () => {
    if (!selectedType) {
      alert('Please select a go-out type');
      return;
    }

    const newItem = { [selectedType]: filters };

    if (editingIndex !== null) {
      // Replace existing item
      const newItinerary = [...modifiedItinerary];
      newItinerary[editingIndex] = newItem;
      setModifiedItinerary(newItinerary);
      setEditingIndex(null);
    } else if (isAdding) {
      // Add new item at the end
      setModifiedItinerary([...modifiedItinerary, newItem]);
      setIsAdding(false);
    }

    setSelectedType(null);
    setFilters({ filters: {} });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setSelectedType(null);
    setFilters({ filters: {} });
  };

  const handleRegenerate = async () => {
    if (modifiedItinerary.length === 0) {
      alert('Cannot regenerate with empty itinerary');
      return;
    }

    // Validate that all items have either filters or _id
    const hasInvalidItems = modifiedItinerary.some(item => {
      const typeName = Object.keys(item)[0];
      const value = item[typeName];
      
      // Check if it's completely empty or has neither filters nor _id
      return !value || (Object.keys(value).length === 0) ||
             (value.filters === undefined && value._id === undefined);
    });

    if (hasInvalidItems) {
      alert('Please ensure all activities have filters configured or remove them before regenerating');
      return;
    }

    // Check if ALL items are specific venues (have _id)
    const allSpecificVenues = modifiedItinerary.every(item => {
      const typeName = Object.keys(item)[0];
      const value = item[typeName];
      return value._id !== undefined;
    });

    if (allSpecificVenues) {
      alert('Cannot regenerate - all activities are specific venues. Please add filters or remove venues to allow regeneration.');
      return;
    }

    if (!originalData) {
      alert('Missing original request data. Please plan a new itinerary.');
      return;
    }

    setIsRegenerating(true);
    
    // Convert modified itinerary back to preferredTypes format
    const preferredTypes = modifiedItinerary.map(item => item);

    // Prepare the payload with all required fields from original request
    const payload = {
      ...originalData,
      preferredTypes
    };

    console.log('🔄 Regenerating with payload:', JSON.stringify(payload, null, 2));

    await onRegenerate(payload, index);
    setIsRegenerating(false);
  };

  const showingEditor = editingIndex !== null || isAdding;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100">
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Option {index + 1}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {modifiedItinerary.length} activities planned
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-3xl font-bold text-purple-600">
            <Star className="w-8 h-8 fill-current" />
            {itinerary.score}
          </div>
          <p className="text-xs text-gray-500 mt-1">Match Score</p>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-4">
        {modifiedItinerary.map((activity, actIndex) => {
          const typeName = Object.keys(activity)[0];
          const venue = activity[typeName];
          const isEditing = editingIndex === actIndex;

          if (isEditing) {
            return (
              <div key={actIndex} className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Replace Activity {actIndex + 1}</h4>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!selectedType ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Select go-out type:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {GO_OUT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleTypeSelect(type.id)}
                          className="p-3 border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-lg transition-all text-center"
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="font-medium text-gray-900 text-sm">{type.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getTypeIcon(selectedType)}</span>
                      <span className="font-semibold text-gray-900">
                        {GO_OUT_TYPES.find(t => t.id === selectedType)?.name}
                      </span>
                    </div>
                    <GoOutFilters
                      type={selectedType}
                      filters={filters}
                      onUpdate={handleFilterUpdate}
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={actIndex}
              className="flex gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  {actIndex + 1}
                </div>
              </div>

              {/* Venue Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(typeName)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {venue.name || GO_OUT_TYPES.find(t => t.id === typeName)?.name || typeName}
                    </h3>
                  </div>
                  {venue.rating && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{venue.rating}</span>
                    </div>
                  )}
                </div>

                {/* Venue Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {venue.pricePerPerson && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <IndianRupee className="w-4 h-4" />
                      <span>₹{venue.pricePerPerson}/person</span>
                    </div>
                  )}
                  
                  {venue.duration && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{venue.duration} mins duration</span>
                    </div>
                  )}

                  {venue.distanceKm !== undefined && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span>
                        {venue.distanceKm} km {actIndex === 0 ? 'from start' : 'from prev'}
                      </span>
                    </div>
                  )}

                  {venue.travelTimeMinutes !== undefined && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{venue.travelTimeMinutes} min travel</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleReplace(actIndex)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Replace
                  </button>
                  <button
                    onClick={() => handleRemove(actIndex)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Activity Card */}
        {isAdding && (
          <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Add New Activity</h4>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!selectedType ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">Select go-out type:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GO_OUT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className="p-3 border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-lg transition-all text-center"
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="font-medium text-gray-900 text-sm">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{getTypeIcon(selectedType)}</span>
                  <span className="font-semibold text-gray-900">
                    {GO_OUT_TYPES.find(t => t.id === selectedType)?.name}
                  </span>
                </div>
                <GoOutFilters
                  type={selectedType}
                  filters={filters}
                  onUpdate={handleFilterUpdate}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Activity
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add & Regenerate Buttons */}
      {!showingEditor && (
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Activity
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Itinerary'}
          </button>
        </div>
      )}

      {/* AI Reasoning */}
      {itinerary.reasoning && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Why this itinerary?</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {itinerary.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}
