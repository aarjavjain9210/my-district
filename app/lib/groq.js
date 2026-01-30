
/**
 * Build system prompt based on request body constraints
 */
function buildSystemPrompt(requestBody) {
  const constraints = [];
  // Core constraints
  if (requestBody.budget) {
    constraints.push(`budget (₹${requestBody.budget} for ${requestBody.numberOfPeople} people)`);
  }
  
  // Travel and timing constraints
  if (requestBody.travelTolerance && Array.isArray(requestBody.travelTolerance) && requestBody.travelTolerance.length > 0) {
    constraints.push(`travel tolerance: ${requestBody.travelTolerance.join(', ')} (evaluate travel times accordingly)`);
  }
  
  // User preferences and tags
  if (requestBody.extraInfo) {
    constraints.push(`user preferences: "${requestBody.extraInfo}" (match with tags field)`);
  }
  
  // Go-out specific filters
  if (requestBody.dining) {
    const filters = [];
    if (requestBody.dining.type?.length) filters.push(`type: ${requestBody.dining.type.join(',')}`);
    if (requestBody.dining.cuisines?.length) filters.push(`cuisines: ${requestBody.dining.cuisines.join(',')}`);
    if (requestBody.dining.alcohol !== undefined) filters.push(`alcohol: ${requestBody.dining.alcohol}`);
    if (requestBody.dining.wifi !== undefined) filters.push(`wifi: ${requestBody.dining.wifi}`);
    if (requestBody.dining.washroom !== undefined) filters.push(`washroom: ${requestBody.dining.washroom}`);
    if (requestBody.dining.wheelchair !== undefined) filters.push(`wheelchair: ${requestBody.dining.wheelchair}`);
    if (requestBody.dining.parking !== undefined) filters.push(`parking: ${requestBody.dining.parking}`);
    if (requestBody.dining.rating !== undefined) filters.push(`rating: ${requestBody.dining.rating}+`);
    if (Array.isArray(requestBody.dining.crowdTolerance) && requestBody.dining.crowdTolerance.length > 0) {
      filters.push(`crowd tolerance: ${requestBody.dining.crowdTolerance.join(',')}`);
    }
    if (filters.length) constraints.push(`dining (${filters.join('; ')})`);
  }
  
  if (requestBody.event) {
    const filters = [];
    if (requestBody.event.type?.length) filters.push(`type: ${requestBody.event.type.join(',')}`);
    if (requestBody.event.venue?.length) filters.push(`venue: ${requestBody.event.venue.join(',')}`);
    if (requestBody.event.wifi !== undefined) filters.push(`wifi: ${requestBody.event.wifi}`);
    if (requestBody.event.washroom !== undefined) filters.push(`washroom: ${requestBody.event.washroom}`);
    if (requestBody.event.wheelchair !== undefined) filters.push(`wheelchair: ${requestBody.event.wheelchair}`);
    if (requestBody.event.parking !== undefined) filters.push(`parking: ${requestBody.event.parking}`);
    if (requestBody.event.rating !== undefined) filters.push(`rating: ${requestBody.event.rating}+`);
    if (Array.isArray(requestBody.event.crowdTolerance) && requestBody.event.crowdTolerance.length > 0) {
      filters.push(`crowd tolerance: ${requestBody.event.crowdTolerance.join(',')}`);
    }
    if (filters.length) constraints.push(`event (${filters.join('; ')})`);
  }
  
  if (requestBody.activity) {
    const filters = [];
    if (requestBody.activity.type?.length) filters.push(`type: ${requestBody.activity.type.join(',')}`);
    if (requestBody.activity.venue?.length) filters.push(`venue: ${requestBody.activity.venue.join(',')}`);
    if (requestBody.activity.wifi !== undefined) filters.push(`wifi: ${requestBody.activity.wifi}`);
    if (requestBody.activity.washroom !== undefined) filters.push(`washroom: ${requestBody.activity.washroom}`);
    if (requestBody.activity.wheelchair !== undefined) filters.push(`wheelchair: ${requestBody.activity.wheelchair}`);
    if (requestBody.activity.parking !== undefined) filters.push(`parking: ${requestBody.activity.parking}`);
    if (requestBody.activity.rating !== undefined) filters.push(`rating: ${requestBody.activity.rating}+`);
    if (Array.isArray(requestBody.activity.crowdTolerance) && requestBody.activity.crowdTolerance.length > 0) {
      filters.push(`crowd tolerance: ${requestBody.activity.crowdTolerance.join(',')}`);
    }
    if (filters.length) constraints.push(`activity (${filters.join('; ')})`);
  }
  
  if (requestBody.play) {
    const filters = [];
    if (requestBody.play.type?.length) filters.push(`type: ${requestBody.play.type.join(',')}`);
    if (requestBody.play.venue?.length) filters.push(`venue: ${requestBody.play.venue.join(',')}`);
    if (requestBody.play.intensity?.length) filters.push(`intensity: ${requestBody.play.intensity.join(',')}`);
    if (requestBody.play.wifi !== undefined) filters.push(`wifi: ${requestBody.play.wifi}`);
    if (requestBody.play.washroom !== undefined) filters.push(`washroom: ${requestBody.play.washroom}`);
    if (requestBody.play.wheelchair !== undefined) filters.push(`wheelchair: ${requestBody.play.wheelchair}`);
    if (requestBody.play.cafe !== undefined) filters.push(`cafe: ${requestBody.play.cafe}`);
    if (requestBody.play.parking !== undefined) filters.push(`parking: ${requestBody.play.parking}`);
    if (requestBody.play.rating !== undefined) filters.push(`rating: ${requestBody.play.rating}+`);
    if (Array.isArray(requestBody.play.crowdTolerance) && requestBody.play.crowdTolerance.length > 0) {
      filters.push(`crowd tolerance: ${requestBody.play.crowdTolerance.join(',')}`);
    }
    if (filters.length) constraints.push(`play (${filters.join('; ')})`);
  }
  
  if (requestBody.movie) {
    const filters = [];
    if (requestBody.movie.genre?.length) filters.push(`genre: ${requestBody.movie.genre.join(',')}`);
    if (requestBody.movie.language?.length) filters.push(`language: ${requestBody.movie.language.join(',')}`);
    if (requestBody.movie.format?.length) filters.push(`format: ${requestBody.movie.format.join(',')}`);
    if (requestBody.movie.cast?.length) filters.push(`cast: ${requestBody.movie.cast.join(',')}`);
    if (requestBody.movie.wifi !== undefined) filters.push(`wifi: ${requestBody.movie.wifi}`);
    if (requestBody.movie.washroom !== undefined) filters.push(`washroom: ${requestBody.movie.washroom}`);
    if (requestBody.movie.wheelchair !== undefined) filters.push(`wheelchair: ${requestBody.movie.wheelchair}`);
    if (requestBody.movie.parking !== undefined) filters.push(`parking: ${requestBody.movie.parking}`);
    if (requestBody.movie.rating !== undefined) filters.push(`rating: ${requestBody.movie.rating}+`);
    if (Array.isArray(requestBody.movie.crowdTolerance) && requestBody.movie.crowdTolerance.length > 0) {
      filters.push(`crowd tolerance: ${requestBody.movie.crowdTolerance.join(',')}`);
    }
    if (filters.length) constraints.push(`movie (${filters.join('; ')})`);
  }
  
  const constraintsText = constraints.length > 0
    ? `Evaluate based on: ${constraints.join(', ')}.`
    : 'Evaluate all aspects.';
  
  return `You are a precise itinerary scoring engine. ${constraintsText}

EVALUATION GUIDELINES:

1. BUDGET COMPLIANCE (0-25 points):
   - Calculate total cost vs budget (pricePerPerson × numberOfPeople for all items)
   - Deduct points for exceeding budget
   - Reward optimal use of budget without overspending

2. TRAVEL & LOGISTICS (0-25 points):
   - Evaluate distanceKm and travelTimeMinutes between consecutive items
   - If travelTolerance specified: penalize heavily if any leg exceeds limit
   - Consider cumulative travel time impact on experience
   - Check if timeGapBetweenThings is respected between go outs
   - Validate go outs fit within venue operating hours (availableTimeStart to availableTimeEnd)

3. QUALITY & PREFERENCES (0-25 points):
   - Check minimumRating compliance (rating field)
   - Match extraInfo preferences with tags field
   - Evaluate crowdTolerance alignment
   - Verify parkingAccessible requirement if specified
   - Assess type-specific filters (cuisines, venue, type, genre, etc.)

4. EXPERIENCE FLOW (0-25 points):
   - Logical sequence of go outs
   - Variety and balance in the itinerary
   - Duration appropriateness for each go out
   - Overall coherence and quality of experience

SCORING RULES:
- Use FULL granular range 0-100 (e.g., 67, 73, 82, 91)
- Do NOT round to multiples of 5 or 10
- Be precise based on constraint violations/matches
- Penalize each constraint violation proportionally

OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure:
{
  "score": <integer 0-100>,
  "reasoning": "<detailed explanation of score with specific constraint analysis>"
}`;
}

/**
 * Score an itinerary using Groq AI
 */
export async function scoreItinerary(itinerary, requestBody) {
  try {
    const systemPrompt = buildSystemPrompt(requestBody);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL,
        temperature: 0,
        top_p: 1,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Itinerary:\n\`\`\`json\n${JSON.stringify(itinerary, null, 2)}\n\`\`\`\n\nScore this plan.`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status, response.statusText);
      return 50;
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content?.trim();
    
    try {
      // Parse JSON response
      const result = JSON.parse(responseText);
      const score = parseInt(result.score, 10);
      const reasoning = result.reasoning || 'No reasoning provided';

      if (isNaN(score) || score < 0 || score > 100) {
        console.error('Invalid score from AI:', score);
        return 50;
      }

      // Log the reasoning
      console.log('AI Score:', score);
      console.log('AI Reasoning:', reasoning);
      
      return score;
      
    } catch (parseError) {
      // Fallback: try to extract score as plain integer if JSON parsing fails
      console.warn('Failed to parse JSON response, trying plain integer extraction:', parseError.message);
      const score = parseInt(responseText, 10);
      
      if (isNaN(score) || score < 0 || score > 100) {
        console.error('Invalid score from AI:', responseText);
        return 50;
      }
      
      console.log('AI Score (fallback):', score);
      return score;
    }

  } catch (error) {
    console.error('Error scoring itinerary:', error);
    return 50;
  }
}

/**
 * Score multiple itineraries in parallel (with rate limiting)
 */
export async function scoreItineraries(itineraries, requestBody, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < itineraries.length; i += batchSize) {
    const batch = itineraries.slice(i, i + batchSize);
    const batchPromises = batch.map(itinerary => 
      scoreItinerary(itinerary, requestBody)
    );
    
    const scores = await Promise.all(batchPromises);
    
    batch.forEach((itinerary, idx) => {
      results.push({
        itinerary,
        score: scores[idx]
      });
    });
  }
  
  return results.sort((a, b) => b.score - a.score);
}
