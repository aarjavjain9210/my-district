
import { NextResponse } from 'next/server';
import { connectMongo } from '@/app/lib/mongo';
import Dining from '@/app/models/Dining';
import Event from '@/app/models/Event';
import Movie from '@/app/models/Movie';
import Play from '@/app/models/Play';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!query || query.length < 2) {
      return NextResponse.json({ venues: [] });
    }

    await connectMongo();

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(query, 'i');

    const collections = {
      dining: Dining,
      events: Event,
      movies: Movie,
      play: Play,
    };

    let results = [];

    if (type && collections[type]) {
      // Search only in the specified type
      const venues = await collections[type]
        .find({ name: searchRegex })
        .limit(limit)
        .lean();
      
      results = venues.map(venue => ({
        ...venue,
        _id: venue._id.toString(),
        type: type,
      }));
    } else {
      // Search across all collections
      const searchPromises = Object.entries(collections).map(
        async ([collectionType, Model]) => {
          const venues = await Model.find({ name: searchRegex })
            .limit(Math.ceil(limit / 4))
            .lean();
          
          return venues.map(venue => ({
            ...venue,
            _id: venue._id.toString(),
            type: collectionType,
          }));
        }
      );

      const allResults = await Promise.all(searchPromises);
      results = allResults.flat().slice(0, limit);
    }

    return NextResponse.json({ venues: results });
  } catch (error) {
    console.error('Error searching venues:', error);
    return NextResponse.json(
      { error: 'Failed to search venues' },
      { status: 500 }
    );
  }
}
