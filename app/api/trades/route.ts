import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface Trade {
  trade_code: string;
  trade_name: string;
  sector: string;
  description: string | null;
  noa_code: string | null;
}

export interface TradesBySector {
  [sector: string]: Trade[];
}

/**
 * GET /api/trades
 *
 * Fetch all Red Seal trades from trade_specializations table.
 * Optional query params:
 * - active: Filter by active status (default: true)
 * - grouped: Return trades grouped by sector (default: false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';
    const grouped = searchParams.get('grouped') === 'true';

    let query = supabase
      .from('trade_specializations')
      .select('code, name_en, sector, description_en, noa_code, sort_order')
      .order('name_en', { ascending: true });

    // Filter by active status
    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: trades, error } = await query;

    if (error) {
      console.error('Error fetching trades:', error);
      return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
    }

    // Transform to consistent format for frontend
    const formattedTrades: Trade[] = (trades || []).map((t: any) => ({
      trade_code: t.code,
      trade_name: t.name_en,
      sector: t.sector || 'Other',
      description: t.description_en,
      noa_code: t.noa_code,
    }));

    // If grouped, organize by sector
    if (grouped) {
      const tradesBySector: TradesBySector = {};
      const sectorOrder = ['Construction', 'Motive Power', 'Industrial', 'Service'];

      // Initialize sectors in order
      sectorOrder.forEach(sector => {
        tradesBySector[sector] = [];
      });

      // Group trades
      formattedTrades.forEach(trade => {
        const sector = trade.sector || 'Other';
        if (!tradesBySector[sector]) {
          tradesBySector[sector] = [];
        }
        tradesBySector[sector].push(trade);
      });

      // Remove empty sectors
      Object.keys(tradesBySector).forEach(sector => {
        if (tradesBySector[sector].length === 0) {
          delete tradesBySector[sector];
        }
      });

      return NextResponse.json({
        tradesBySector,
        count: formattedTrades.length,
      });
    }

    return NextResponse.json({
      trades: formattedTrades,
      count: formattedTrades.length,
    });

  } catch (error) {
    console.error('Trades API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
