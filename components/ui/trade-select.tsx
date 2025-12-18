'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Trade {
  trade_code: string;
  trade_name: string;
}

interface TradeSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  showAllOption?: boolean;
  className?: string;
}

/**
 * Reusable TradeSelect Component
 *
 * Single source of truth for trade selection across the entire application.
 * Fetches trades from /api/trades and provides a consistent dropdown interface.
 *
 * Usage:
 * ```tsx
 * <TradeSelect
 *   value={selectedTrade}
 *   onValueChange={setSelectedTrade}
 *   label="Select Trade"
 *   showAllOption={true}
 * />
 * ```
 */
export function TradeSelect({
  value,
  onValueChange,
  placeholder = 'Select a trade',
  label,
  id = 'trade',
  showAllOption = false,
  className,
}: TradeSelectProps) {
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch trades from API on mount
  React.useEffect(() => {
    async function fetchTrades() {
      try {
        const response = await fetch('/api/trades');
        if (!response.ok) {
          throw new Error('Failed to fetch trades');
        }
        const data = await response.json();
        setTrades(data.trades || []);
      } catch (err) {
        console.error('Error fetching trades:', err);
        setError('Failed to load trades');
      } finally {
        setLoading(false);
      }
    }
    fetchTrades();
  }, []);

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className="text-sm font-semibold mb-2 block">
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={loading}>
        <SelectTrigger id={id}>
          <SelectValue
            placeholder={loading ? 'Loading trades...' : error || placeholder}
          />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">All trades</SelectItem>
          )}
          {trades.map((trade) => (
            <SelectItem key={trade.trade_code} value={trade.trade_code}>
              {trade.trade_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
