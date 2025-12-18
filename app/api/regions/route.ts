/**
 * Regions API Route
 * Fetches regions (states/provinces) from Supabase database
 * Supports filtering by country_code
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const searchParams = request.nextUrl.searchParams;
    const countryCode = searchParams.get('country_code');
    const activeOnly = searchParams.get('active') !== 'false';

    let query = supabase
      .from('regions')
      .select('id, country_code, code, name_en, name_fr, type, sort_order, is_active')
      .order('sort_order', { ascending: true })
      .order('name_en', { ascending: true });

    if (countryCode) {
      query = query.eq('country_code', countryCode.toUpperCase());
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Regions fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
    }

    return NextResponse.json({
      regions: data || [],
      total: data?.length || 0,
      country_code: countryCode?.toUpperCase() || null,
    });
  } catch (error) {
    console.error('Regions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
