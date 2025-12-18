/**
 * Countries API Route
 * Fetches countries from Supabase database
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
    const activeOnly = searchParams.get('active') !== 'false';

    let query = supabase
      .from('countries')
      .select('code, code_alpha3, name_en, name_fr, region_label, phone_code, currency_code, sort_order, is_active')
      .order('sort_order', { ascending: true })
      .order('name_en', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Countries fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
    }

    return NextResponse.json({
      countries: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Countries API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
