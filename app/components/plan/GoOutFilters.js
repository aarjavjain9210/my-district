
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Loader2, MapPin } from 'lucide-react';

const FILTER_OPTIONS = {
  dinings: {
    type: ['veg', 'non-veg'],
    cuisines: ['Italian', 'Chinese', 'Indian', 'Mexican', 'Thai', 'Japanese', 'Continental', 'French', 'Korean', 'Mediterranean']
  },
  events: {
    type: [
      "Acoustic", "Art & Craft Workshops", "Attractions", "Beverage Tastings",
      "Bollywood Films", "Bollywood Music", "Bollywood Night", "Brunch", "Buffet",
      "Business Conferences & Talks", "Carnivals", "Celebrations", "Classical Music",
      "Clubbing", "Cocktails", "Comedy", "Comedy Open Mics", "Comical Plays",
      "Community Dining", "Community Meetups", "Concerts", "Conferences & Talks",
      "Cricket Matches", "Cricket Screenings", "DJ Nights", "Dance", "Dating",
      "Devotional Music", "Dinner", "Dramatic Plays", "EDM Music",
      "Education Conferences & Talks", "Entertainment & Award Shows", "Expos",
      "Fandom Fests", "Fests & Fairs", "Fitness & Wellness Fests", "Fitness Events",
      "Folk Music", "Food & Drinks", "Football Screenings", "Game Zones",
      "Gourmet Experiences", "Hip Hop Music", "Holi", "ICC", "Iconic Landmarks",
      "Indian Classical Dance", "Indie Music", "Industry Networking",
      "Instrumental Music", "Interest Based Communities", "Interest Based Dating",
      "Jams", "Jazz Music", "Karaoke Nights", "Kids", "Kids Festivals", "Kids Play",
      "Literary", "Literary Open Mics", "Live Gigs", "Lunch",
      "Marketing Conferences & Talks", "Motorsport Matches", "Movie Screenings",
      "Music", "Music Conferences & Talks", "Music Festivals", "Music Open Mics",
      "Nightlife", "ODI matches", "Open Air Screening", "Open Mics",
      "Open Mics & Jams", "Parties", "Performances", "Picnics", "Play", "Poetry",
      "Poetry Open Mics", "Pop Culture Fairs", "Pop Music", "Rave", "Roast",
      "Rock Music", "Singles Mixers", "Social Mixers", "Speed Dating", "Sports",
      "Standup", "Storytelling", "Storytelling Open Mics", "Sufi Music", "Sundowner",
      "TV Screenings", "Tech Conferences & Talks", "Techno", "Tennis Matches",
      "Theatre", "Trade Shows", "Tribute Shows", "Valentine's Day", "Workshops",
      "World Cup", "Wrestling Matches"
    ],
    venue: ['indoor', 'outdoor', 'both']
  },
  activities: {
    type: [
      "Bowling", "Acting Workshops", "Adventure", "Adventure Parks", "Aerial Tours",
      "Arcades", "Art & Craft Workshops", "Baking", "Bike Riding",
      "Blood on the Clocktower", "Board Games & Puzzles", "Bollywood Dance",
      "Business Conferences & Talks", "Calligraphy", "Celebrations", "Ceramics",
      "City Tours", "Clay Modelling", "Coffee Brewing", "Comedy",
      "Community Meetups", "Community Runs", "Conferences & Talks", "Cooking",
      "Cricket", "Culinary Workshops", "DIY Workshops", "Dance Workshops", "Dating",
      "Day Trips", "Entertainment Parks", "Escape Rooms", "Esports", "Farm Outings",
      "Fashion & Beauty Workshops", "Fests & Fairs", "Finance Workshops",
      "Fitness Activities", "Game Zones", "Games & Quizzes", "Go Karting", "Healing",
      "Historical Tours", "History Museums", "Home Decor", "Horse Riding",
      "Illusion Museums", "Improv", "Interest Based Communities",
      "Interest Based Dating", "Kids", "Kids Festivals", "Kids Play",
      "Kids Theme Parks", "Laser Tag", "Meditation", "Mountain Treks", "Museums",
      "Music", "Mystery Rooms", "NYE", "Nightlife", "Paintball", "Painting",
      "Paragliding", "Parties", "Pet Activities", "Pet Playdates",
      "Photography Workshops", "Play Areas", "Play Sports", "Pottery Workshops",
      "Public Speaking Workshops", "Rage Rooms", "Resin Art", "Rock Climbing",
      "Sip & Paint", "Snow Parks", "Social Mixers", "Theme Parks", "Tours",
      "Trampoline Parks", "Travel", "Treasure Hunts", "Treks",
      "Trivia Nights & Quizzes", "VR Rooms", "Valentine's Day", "Watercolours",
      "Weekend Getaways", "Wellness Workshops", "Wheel Throwing", "Workshops"
    ],
    venue: ['indoor', 'outdoor'],
    intensity: ['low', 'medium', 'high']
  },
  plays: {
    type: [
      "Badminton", "Basketball", "Box Cricket", "Cricket", "Cricket Nets",
      "Football", "Padel", "Pickleball", "Table Tennis", "Tennis", "Turf Football"
    ],
    venue: ['indoor', 'outdoor'],
    intensity: ['low', 'medium', 'high']
  },
  movies: {
    genre: [
      "Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Family",
      "Fantasy", "Historical", "Horror", "Mystery", "Psychological Thriller",
      "Romance", "Sci-Fi", "Sport", "Thriller", "War"
    ],
    language: ['Hindi', 'English', 'Malayalam', 'Bengali'],
    format: ['2D', '3D', '4DX-3D', 'IMAX 2D', '4DX-2D', 'ICE 2D'],
    cast: ['Shah Rukh Khan', 'Alia Bhatt', 'Ranbir Kapoor', 'Deepika Padukone', 'Rajkummar Rao', 'Ayushmann Khurrana', 'Vicky Kaushal', 'Katrina Kaif']
  }
};

const AMENITY_FILTERS = ['wifi', 'washroom', 'wheelchair', 'parking'];
const CROWD_TOLERANCE = ['low', 'medium', 'high'];

export default function GoOutFilters({ type, filters, onUpdate }) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters?.filters || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const options = FILTER_OPTIONS[type] || {};

  // Debounced search for venues
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/search-venues?q=${encodeURIComponent(searchQuery)}&type=${type}&limit=10`);
        const data = await response.json();
        if (data.venues) {
          setSearchResults(data.venues);
        }
      } catch (error) {
        console.error('Venue search error:', error);
      }
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, type]);

  // Check if this is a specific venue object (has _id)
  const hasSpecificVenue = filters && filters._id;

  // Initialize with correct structure if filters is empty or undefined
  useEffect(() => {
    if (!filters || (Object.keys(filters).length === 0)) {
      onUpdate({ filters: {} });
    }
  }, []);

  const handleClearVenue = () => {
    onUpdate({ filters: {} });
    setLocalFilters({});
  };

  const handleVenueSelect = (venue) => {
    onUpdate(venue); // Send venue object directly (not wrapped)
    setSearchQuery('');
    setSearchResults([]);
  };

  // If a specific venue is selected, show only venue info, no filters
  if (hasSpecificVenue) {
    const venue = filters;
    return (
      <div className="space-y-3">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{venue.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Rating: {venue.rating || 'N/A'} ⭐ | Price: ₹{venue.pricePerPerson || 'N/A'}/person
              </p>
              {venue.address && (
                <p className="text-xs text-gray-500 mt-1">{venue.address}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClearVenue}
              className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleArrayToggle = (key, value) => {
    const current = localFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    const newFilters = { ...localFilters, [key]: updated };
    setLocalFilters(newFilters);
    onUpdate({ filters: newFilters });
  };

  const handleBooleanToggle = (key) => {
    const newFilters = {
      ...localFilters,
      [key]: localFilters[key] === undefined ? true : localFilters[key] === true ? false : undefined
    };
    if (newFilters[key] === undefined) delete newFilters[key];
    setLocalFilters(newFilters);
    onUpdate({ filters: newFilters });
  };

  const handleNumberChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value ? parseFloat(value) : undefined };
    if (!value) delete newFilters[key];
    setLocalFilters(newFilters);
    onUpdate({ filters: newFilters });
  };

  return (
    <div className="space-y-3">
      {/* Search for specific venue */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search for a specific ${type.slice(0, -1)}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          />
          {searchLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Autocomplete dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((venue, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleVenueSelect(venue)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-2 border-b last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {venue.rating && `⭐ ${venue.rating}`} {venue.pricePerPerson && `• ₹${venue.pricePerPerson}/person`}
                  </div>
                  {venue.address && (
                    <div className="text-xs text-gray-400 mt-1">{venue.address}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500">OR</div>

      {/* Filters toggle button */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
      >
        <span className="font-medium text-gray-700">
          {showFilters ? 'Hide' : 'Show'} Filters {Object.keys(localFilters).length > 0 && `(${Object.keys(localFilters).length} active)`}
        </span>
        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showFilters && (
        <div className="mt-4 space-y-4 p-4 bg-white border border-purple-100 rounded-lg max-h-96 overflow-y-auto">
          {/* Type-specific filters */}
          {Object.entries(options).map(([key, values]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {values.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleArrayToggle(key, value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      (localFilters[key] || []).includes(value)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Alcohol for dining */}
          {type === 'dinings' && (
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alcohol
              </label>
              <button
                type="button"
                onClick={() => handleBooleanToggle('alcohol')}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  localFilters.alcohol === true
                    ? 'bg-green-600 text-white border-green-600'
                    : localFilters.alcohol === false
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                }`}
              >
                {localFilters.alcohol === true && 'Required ✓'}
                {localFilters.alcohol === false && 'Not Required ✗'}
                {localFilters.alcohol === undefined && 'No Preference'}
              </button>
            </div>
          )}

          {/* Amenity Filters */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITY_FILTERS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleBooleanToggle(amenity)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors capitalize ${
                    localFilters[amenity] === true
                      ? 'bg-green-600 text-white border-green-600'
                      : localFilters[amenity] === false
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {amenity}
                  {localFilters[amenity] === true && ' ✓'}
                  {localFilters[amenity] === false && ' ✗'}
                </button>
              ))}
              
              {/* Cafe for plays */}
              {type === 'plays' && (
                <button
                  type="button"
                  onClick={() => handleBooleanToggle('cafe')}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    localFilters.cafe === true
                      ? 'bg-green-600 text-white border-green-600'
                      : localFilters.cafe === false
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  cafe
                  {localFilters.cafe === true && ' ✓'}
                  {localFilters.cafe === false && ' ✗'}
                </button>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="e.g., 4.5"
              value={localFilters.rating || ''}
              onChange={(e) => handleNumberChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Crowd Tolerance */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crowd Tolerance
            </label>
            <div className="flex gap-2">
              {CROWD_TOLERANCE.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleArrayToggle('crowdTolerance', level)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-colors capitalize ${
                    (localFilters.crowdTolerance || []).includes(level)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
