import { createClient } from '@/lib/supabase/client';
import { AdminRepository } from '@/repositories/admin.repository';
import { DashboardStats } from '@/types';

const supabase = createClient();

export const DashboardService = {
  async getStats(): Promise<DashboardStats> {
    // 1. Fetch exact counts from database via headless select queries
    const usersPromise = supabase.from('profiles').select('*', { count: 'exact', head: true });
    const artworksPromise = supabase.from('artworks').select('*', { count: 'exact', head: true });
    const ordersPromise = supabase.from('orders').select('*', { count: 'exact', head: true });
    const commissionsPromise = supabase
      .from('commissions')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch sum of total revenue for completed / shipped / paid orders
    const revenuePromise = supabase
      .from('orders')
      .select('total')
      .neq('status', 'Cancelled')
      .eq('payment_status', 'Paid');

    // 3. Fetch count of pending commissions (Submitted or Under Review)
    const pendingCommissionsPromise = supabase
      .from('commissions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Submitted', 'Under Review']);

    // 4. Fetch count of completed orders (Delivered)
    const completedOrdersPromise = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Delivered');

    const [
      usersRes,
      artworksRes,
      ordersRes,
      commissionsRes,
      revenueRes,
      pendingCommRes,
      completedOrdRes,
    ] = await Promise.all([
      usersPromise,
      artworksPromise,
      ordersPromise,
      commissionsPromise,
      revenuePromise,
      pendingCommissionsPromise,
      completedOrdersPromise,
    ]);

    const totalUsers = usersRes.count || 0;
    const totalArtworks = artworksRes.count || 0;
    const totalOrders = ordersRes.count || 0;
    const totalCommissions = commissionsRes.count || 0;
    const pendingCommissions = pendingCommRes.count || 0;
    const completedOrders = completedOrdRes.count || 0;

    const revenue = (revenueRes.data || []).reduce((sum, row) => sum + Number(row.total), 0);

    // 5. Fetch newest users, newest orders, and latest commissions
    const newestUsersPromise = AdminRepository.getUsers();
    const newestOrdersPromise = AdminRepository.getOrders();
    const latestCommissionsPromise = AdminRepository.getCommissions();

    const [allUsers, allOrders, allCommissions] = await Promise.all([
      newestUsersPromise,
      newestOrdersPromise,
      latestCommissionsPromise,
    ]);

    // Mock storage usage statistics
    const storageUsage = {
      totalBytes: 153092408, // 153 MB
      fileCount: 42,
    };

    return {
      totalUsers,
      totalArtworks,
      totalOrders,
      totalCommissions,
      revenue,
      pendingCommissions,
      completedOrders,
      storageUsage,
      newestUsers: allUsers.slice(0, 5),
      newestOrders: allOrders.slice(0, 5),
      latestCommissions: allCommissions.slice(0, 5),
    };
  },
};
export default DashboardService;
