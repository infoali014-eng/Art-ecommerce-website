/* eslint-disable */
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const StatisticsService = {
  async getMonthlyRevenueTrend(): Promise<{ month: string; sales: number }[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('total, created_at')
      .neq('status', 'Cancelled')
      .eq('payment_status', 'Paid')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlySum: Record<string, number> = {};

    months.forEach((m) => {
      monthlySum[m] = 0;
    });

    (data || []).forEach((row: any) => {
      const date = new Date(row.created_at);
      const monthLabel = months[date.getMonth()];
      monthlySum[monthLabel] += Number(row.total);
    });

    return months.map((m) => ({
      month: m,
      sales: monthlySum[m],
    }));
  },

  async getCategorySalesShare(): Promise<{ category: string; value: number }[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('price, quantity, artwork_id, artworks(category)');

    if (error) throw error;

    const shares: Record<string, number> = {
      paintings: 0,
      calligraphy: 0,
      sketches: 0,
    };

    (data || []).forEach((item: any) => {
      const category = item.artworks?.category || 'paintings';
      const revenue = Number(item.price) * Number(item.quantity || 1);
      shares[category] = (shares[category] || 0) + revenue;
    });

    return Object.keys(shares).map((cat) => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: shares[cat],
    }));
  },
};
export default StatisticsService;
