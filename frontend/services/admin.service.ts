/* eslint-disable */
import { AdminRepository } from '@/repositories/admin.repository';
import { Artist, Artwork, Category, Collection, SiteSettings } from '@/types';

export const AdminService = {
  // Log helper wrapper
  async log(
    adminId: string | null,
    action: string,
    target: string,
    prevObj?: any,
    newObj?: any
  ) {
    try {
      await AdminRepository.logActivity(adminId, action, target, prevObj, newObj);
    } catch (e) {
      console.error('Failed to log admin activity:', e);
    }
  },

  // Users
  async toggleUserRole(
    adminId: string | null,
    userId: string,
    currentRole: 'customer' | 'admin',
    name: string
  ) {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    await AdminRepository.updateUserRole(userId, nextRole);
    await this.log(adminId, 'User Role Updated', name, { role: currentRole }, { role: nextRole });
  },

  async updateUserAdminRole(
    adminId: string | null,
    userId: string,
    nextAdminRole: string | null,
    name: string
  ) {
    await AdminRepository.updateUserAdminRole(userId, nextAdminRole);
    await this.log(
      adminId,
      'User Admin Role Updated',
      name,
      { admin_role: null },
      { admin_role: nextAdminRole }
    );
  },

  async toggleUserBlock(adminId: string | null, userId: string, isBlocked: boolean, name: string) {
    if (isBlocked) {
      await AdminRepository.restoreUser(userId);
      await this.log(adminId, 'User Restored', name);
    } else {
      await AdminRepository.softDeleteUser(userId);
      await this.log(adminId, 'User Disabled', name);
    }
  },

  // Site Settings
  async updateSiteSettings(adminId: string | null, nextSettings: Partial<SiteSettings>) {
    const prevSettings = await AdminRepository.getSiteSettings();
    await AdminRepository.updateSiteSettings(nextSettings);
    await this.log(adminId, 'Site Settings Updated', 'Global Settings', prevSettings, nextSettings);
  },

  // Artworks
  async createArtwork(adminId: string | null, artwork: Omit<Artwork, 'createdAt'>) {
    await AdminRepository.createArtwork(artwork);
    await this.log(adminId, 'Artwork Created', artwork.title, null, artwork);
  },

  async updateArtwork(adminId: string | null, id: string, artwork: Partial<Artwork>) {
    await AdminRepository.updateArtwork(id, artwork);
    await this.log(adminId, 'Artwork Updated', artwork.title || id, null, artwork);
  },

  async toggleArtworkArchive(adminId: string | null, id: string, title: string, isArchived: boolean) {
    if (isArchived) {
      await AdminRepository.restoreArtwork(id);
      await this.log(adminId, 'Artwork Restored', title);
    } else {
      await AdminRepository.softDeleteArtwork(id);
      await this.log(adminId, 'Artwork Archived', title);
    }
  },

  // Categories
  async createCategory(adminId: string | null, cat: Category) {
    await AdminRepository.createCategory(cat);
    await this.log(adminId, 'Category Created', cat.name, null, cat);
  },

  async updateCategory(adminId: string | null, id: string, cat: Partial<Category>) {
    await AdminRepository.updateCategory(id, cat);
    await this.log(adminId, 'Category Updated', cat.name || id, null, cat);
  },

  async deleteCategory(adminId: string | null, id: string, name: string) {
    await AdminRepository.softDeleteCategory(id);
    await this.log(adminId, 'Category Archived', name);
  },

  // Collections
  async createCollection(adminId: string | null, col: Collection) {
    await AdminRepository.createCollection(col);
    await this.log(adminId, 'Collection Created', col.name, null, col);
  },

  async updateCollection(adminId: string | null, id: string, col: Partial<Collection>) {
    await AdminRepository.updateCollection(id, col);
    await this.log(adminId, 'Collection Updated', col.name || id, null, col);
  },

  async deleteCollection(adminId: string | null, id: string, name: string) {
    await AdminRepository.softDeleteCollection(id);
    await this.log(adminId, 'Collection Archived', name);
  },

  // Artists
  async createArtist(adminId: string | null, art: Artist) {
    await AdminRepository.createArtist(art);
    await this.log(adminId, 'Artist Profile Created', art.name, null, art);
  },

  async updateArtist(adminId: string | null, id: string, art: Partial<Artist>) {
    await AdminRepository.updateArtist(id, art);
    await this.log(adminId, 'Artist Profile Updated', art.name || id, null, art);
  },

  async deleteArtist(adminId: string | null, id: string, name: string) {
    await AdminRepository.softDeleteArtist(id);
    await this.log(adminId, 'Artist Profile Archived', name);
  },

  // Orders
  async updateOrderStatus(
    adminId: string | null,
    orderId: string,
    status: string,
    trackingNumber?: string
  ) {
    await AdminRepository.updateOrderStatus(orderId, status, trackingNumber);
    await this.log(
      adminId,
      'Order Status Updated',
      `Order ${orderId}`,
      { status },
      { status, trackingNumber }
    );
  },

  async updateOrderPaymentStatus(adminId: string | null, orderId: string, paymentStatus: string) {
    await AdminRepository.updateOrderPaymentStatus(orderId, paymentStatus);
    await this.log(adminId, 'Order Payment Updated', `Order ${orderId}`, { paymentStatus });
  },

  // Commissions
  async updateCommissionStatus(
    adminId: string | null,
    commissionId: string,
    status: string,
    oldStatus: string,
    message: string | null = null
  ) {
    await AdminRepository.updateCommissionStatus(commissionId, status, oldStatus, message, adminId);
    await this.log(
      adminId,
      'Commission Status Updated',
      `Commission ${commissionId}`,
      { status: oldStatus },
      { status }
    );
  },

  async assignArtistToCommission(
    adminId: string | null,
    commissionId: string,
    artistId: string | null,
    artistName: string
  ) {
    await AdminRepository.assignArtistToCommission(commissionId, artistId);
    await this.log(
      adminId,
      'Commission Assigned Artist',
      `Commission ${commissionId}`,
      null,
      { artistName }
    );
  },

  async sendCommissionQuote(
    adminId: string | null,
    commissionId: string,
    price: number,
    notes: string
  ) {
    await AdminRepository.sendCommissionQuote(commissionId, price, notes);
    await this.log(adminId, 'Commission Quote Sent', `Commission ${commissionId}`, null, {
      price,
      notes,
    });
  },
};
export default AdminService;
