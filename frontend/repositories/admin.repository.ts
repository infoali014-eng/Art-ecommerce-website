import { createClient } from '@/lib/supabase/client';

import {
  AdminActivity,
  Artist,
  Artwork,
  Category,
  Collection,
  Commission,
  Notification,
  Order,
  SiteSettings,
  UserProfile,
} from '@/types';

const supabase = createClient() as any;

export const AdminRepository = {
  // --- USERS MANAGEMENT ---
  async getUsers(search: string = ''): Promise<UserProfile[]> {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,id.eq.${search}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((p: any) => ({
      id: p.id,
      fullName: p.full_name || 'Anonymous',
      avatarUrl: p.avatar_url || undefined,
      role: p.role,
      adminRole: p.admin_role || undefined,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      deletedAt: p.deleted_at || undefined,
    }));
  },

  async updateUserRole(userId: string, role: 'customer' | 'admin'): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  async updateUserAdminRole(userId: string, adminRole: string | null): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ admin_role: adminRole, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  async softDeleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  async restoreUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  // --- ADMIN ACTIVITIES LOGGING ---
  async getAdminActivities(): Promise<AdminActivity[]> {
    const { data, error } = await supabase
      .from('admin_activities')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map((act: any) => ({
      id: Number(act.id),
      adminId: act.admin_id,
      adminName: act.profiles?.full_name || 'System Admin',
      action: act.action,
      target: act.target,
      previousValue: act.previous_value,
      newValue: act.new_value,
      createdAt: act.created_at,
    }));
  },

  async logActivity(
    adminId: string | null,
    action: string,
    target: string,
    previousValue: any = null,
    newValue: any = null
  ): Promise<void> {
    const { error } = await supabase.from('admin_activities').insert({
      admin_id: adminId,
      action,
      target,
      previous_value: previousValue,
      new_value: newValue,
    });
    if (error) throw error;
  },

  // --- SITE SETTINGS ---
  async getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = (await supabase.from('site_settings').select('*')) as {
      data: any[] | null;
      error: any;
    };
    if (error) throw error;

    const settingsMap: Record<string, string> = {};
    (data || []).forEach((row) => {
      settingsMap[row.key] = row.value || '';
    });

    return {
      siteName: settingsMap['site_name'] || 'Manan Art Gallery',
      contactEmail: settingsMap['contact_email'] || 'abdulmananiqbalmughal@gmail.com',
      contactPhone: settingsMap['contact_phone'] || '+92 325 2538104',
      maintenanceMode: settingsMap['maintenance_mode'] === 'true',
      heroTitle: settingsMap['hero_title'] || 'Acquire Timeless Masterpieces',
      heroSubtitle:
        settingsMap['hero_subtitle'] || 'Co-create with master calligraphers and modern painters.',
      easyPaisaNumber: settingsMap['easy_paisa_number'] || '+92 325 2538104',
      easyPaisaTitle: settingsMap['easy_paisa_title'] || 'Abdul Manan Iqbal Mughal',
      bankName: settingsMap['bank_name'] || 'Meezan Bank',
      bankAccount: settingsMap['bank_account'] || '',
      paymentInstructions:
        settingsMap['payment_instructions'] ||
        'Transfer the amount to the EasyPaisa or Bank account and upload proof.',
      enableEasyPaisa: settingsMap['enable_easy_paisa'] === 'true',
      enableBankTransfer: settingsMap['enable_bank_transfer'] === 'true',
    };
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    const promises: Promise<any>[] = [];

    if (settings.siteName !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'site_name',
          value: settings.siteName,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.contactEmail !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'contact_email',
          value: settings.contactEmail,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.contactPhone !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'contact_phone',
          value: settings.contactPhone,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.maintenanceMode !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'maintenance_mode',
          value: settings.maintenanceMode ? 'true' : 'false',
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.heroTitle !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'hero_title',
          value: settings.heroTitle,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.heroSubtitle !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'hero_subtitle',
          value: settings.heroSubtitle,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.easyPaisaNumber !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'easy_paisa_number',
          value: settings.easyPaisaNumber,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.easyPaisaTitle !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'easy_paisa_title',
          value: settings.easyPaisaTitle,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.bankName !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'bank_name',
          value: settings.bankName,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.bankAccount !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'bank_account',
          value: settings.bankAccount,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.paymentInstructions !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'payment_instructions',
          value: settings.paymentInstructions,
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.enableEasyPaisa !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'enable_easy_paisa',
          value: settings.enableEasyPaisa ? 'true' : 'false',
          updated_at: new Date().toISOString(),
        }) as any
      );
    }
    if (settings.enableBankTransfer !== undefined) {
      promises.push(
        supabase.from('site_settings').upsert({
          key: 'enable_bank_transfer',
          value: settings.enableBankTransfer ? 'true' : 'false',
          updated_at: new Date().toISOString(),
        }) as any
      );
    }

    const results = await Promise.all(promises);
    for (const res of results) {
      if (res.error) throw res.error;
    }
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = (await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })) as any;
    if (error) throw error;

    return (data || []).map((n: any) => ({
      id: Number(n.id),
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.is_read,
      createdAt: n.created_at,
    }));
  },

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'general'
  ): Promise<{ error: any }> {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
    } as any);
    return { error };
  },

  async markNotificationRead(id: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true } as any)
      .eq('id', id);
    if (error) throw error;
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true } as any)
      .eq('user_id', userId);
    if (error) throw error;
  },

  // --- ORDERS MANAGEMENT ---
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map((ord: any) => ({
      id: ord.id,
      userId: ord.user_id,
      customerName: ord.customer_name,
      customerEmail: ord.customer_email,
      customerPhone: ord.customer_phone || undefined,
      shippingAddress: ord.shipping_address,
      shippingCity: ord.shipping_city,
      shippingState: ord.shipping_state || undefined,
      shippingZip: ord.shipping_zip,
      shippingCountry: ord.shipping_country,
      subtotal: Number(ord.subtotal),
      discount: Number(ord.discount),
      shippingFee: Number(ord.shipping_fee),
      total: Number(ord.total),
      status: ord.status as any,
      paymentStatus: ord.payment_status as any,
      paymentMethod: ord.payment_method,
      trackingNumber: ord.tracking_number || undefined,
      paymentProvider: ord.payment_provider || undefined,
      paymentIntentId: ord.payment_intent_id || undefined,
      transactionId: ord.transaction_id || undefined,
      receiptUrl: ord.receipt_url || undefined,
      createdAt: ord.created_at,
      updatedAt: ord.updated_at,
      items: (ord.order_items || []).map((item: any) => ({
        id: Number(item.id),
        orderId: item.order_id,
        artworkId: item.artwork_id,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
        frameOption: item.frame_option,
        createdAt: item.created_at,
      })),
    }));
  },

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string): Promise<void> {
    const updateData: Record<string, any> = { status, updated_at: new Date().toISOString() };
    if (trackingNumber !== undefined) {
      updateData.tracking_number = trackingNumber;
    }
    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);
    if (error) throw error;
  },

  async updateOrderPaymentStatus(orderId: string, paymentStatus: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) throw error;
  },

  // --- COMMISSIONS MANAGEMENT ---
  async getCommissions(): Promise<Commission[]> {
    const { data, error } = (await supabase
      .from('commissions')
      .select('*, commission_reference_images(*), commission_updates(*)')
      .order('created_at', { ascending: false })) as any;
    if (error) throw error;

    return (data || []).map((comm: any) => ({
      id: comm.id,
      userId: comm.user_id,
      title: comm.title,
      artworkType: comm.artwork_type,
      description: comm.description,
      specialInstructions: comm.special_instructions || undefined,
      customerBudget: Number(comm.customer_budget),
      quotedPrice: comm.quoted_price ? Number(comm.quoted_price) : undefined,
      width: comm.width ? Number(comm.width) : undefined,
      height: comm.height ? Number(comm.height) : undefined,
      sizeUnit: comm.size_unit,
      orientation: comm.orientation || undefined,
      frameOption: comm.frame_option || undefined,
      preferredStyle: comm.preferred_style || undefined,
      preferredColors: comm.preferred_colors || [],
      artworkPurpose: comm.artwork_purpose || undefined,
      deadline: comm.deadline || undefined,
      status: comm.status as any,
      paymentStatus: comm.payment_status,
      assignedArtistId: comm.assigned_to || undefined,
      estimatedCompletion: comm.estimated_completion || undefined,
      adminNotes: comm.admin_notes || undefined,
      internalNotes: comm.internal_notes || undefined,
      quotationNotes: comm.quotation_notes || undefined,
      priority: comm.priority || 'medium',
      completionPercentage: Number(comm.completion_percentage || 0),
      createdAt: comm.created_at,
      updatedAt: comm.updated_at,
      referenceImages: (comm.commission_reference_images || []).map((img: any) => ({
        id: Number(img.id),
        commissionId: img.commission_id,
        imageUrl: img.image_url,
        displayOrder: Number(img.display_order),
        createdAt: img.created_at,
      })),
      updates: (comm.commission_updates || []).map((upd: any) => ({
        id: Number(upd.id),
        commissionId: upd.commission_id,
        oldStatus: upd.old_status || undefined,
        newStatus: upd.new_status,
        message: upd.message || undefined,
        createdBy: upd.created_by || undefined,
        createdAt: upd.created_at,
      })),
    }));
  },

  async assignArtistToCommission(commissionId: string, artistId: string | null): Promise<void> {
    const { error } = await supabase
      .from('commissions')
      .update({ assigned_to: artistId, updated_at: new Date().toISOString() } as any)
      .eq('id', commissionId);
    if (error) throw error;
  },

  async updateCommissionStatus(
    commissionId: string,
    status: string,
    oldStatus: string | null = null,
    message: string | null = null,
    adminId: string | null = null
  ): Promise<void> {
    const { error: updateError } = await supabase
      .from('commissions')
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq('id', commissionId);
    if (updateError) throw updateError;

    const { error: logError } = await supabase.from('commission_updates').insert({
      commission_id: commissionId,
      old_status: oldStatus,
      new_status: status,
      message,
      created_by: adminId,
    } as any);
    if (logError) throw logError;
  },

  async updateCommissionInternalNotes(commissionId: string, internalNotes: string): Promise<void> {
    const { error } = await supabase
      .from('commissions')
      .update({ internal_notes: internalNotes, updated_at: new Date().toISOString() } as any)
      .eq('id', commissionId);
    if (error) throw error;
  },

  async sendCommissionQuote(
    commissionId: string,
    quotedPrice: number,
    quotationNotes: string
  ): Promise<void> {
    const { error } = await supabase
      .from('commissions')
      .update({
        quoted_price: quotedPrice,
        quotation_notes: quotationNotes,
        status: 'Quotation Sent',
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', commissionId);
    if (error) throw error;
  },

  // --- ARTWORK CRUD ---
  async getArtworks(showArchived: boolean = true): Promise<Artwork[]> {
    let query = supabase.from('artworks').select(`
      *,
      artists(name),
      artwork_images(image_url)
    `);

    if (!showArchived) {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map((art: any) => ({
      id: art.id,
      slug: art.slug || art.id,
      title: art.title,
      artist: art.artists?.name || 'Unknown Artist',
      artistId: art.artist_id || '',
      description: art.description || '',
      story: art.story || '',
      technique: art.technique || '',
      price: Number(art.price),
      category: art.category_id as any,
      medium: art.medium || '',
      dimensions: art.dimensions || '',
      orientation: art.orientation as any,
      availability: art.availability as any,
      featured: art.featured,
      popular: art.popular,
      newArrival: art.new_arrival,
      isOriginal: art.is_original,
      framingAvailable: art.framing_available,
      estimatedDelivery: art.estimated_delivery || '5-7 business days',
      tags: [],
      images: (art.artwork_images || []).map((img: any) => img.image_url),
      collection: art.collection_id || undefined,
      year: Number(art.year || new Date().getFullYear()),
      createdAt: art.created_at,
    }));
  },

  async createArtwork(artwork: Omit<Artwork, 'createdAt'>): Promise<void> {
    const { error: artError } = await supabase.from('artworks').insert({
      id: artwork.id,
      title: artwork.title,
      slug: artwork.id,
      artist_id: artwork.artistId || null,
      description: artwork.description,
      story: artwork.story,
      technique: artwork.technique,
      price: artwork.price,
      category_id: artwork.category,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      orientation: artwork.orientation,
      availability: artwork.availability,
      featured: artwork.featured,
      popular: artwork.popular,
      new_arrival: artwork.newArrival,
      is_original: artwork.isOriginal,
      framing_available: artwork.framingAvailable,
      estimated_delivery: artwork.estimatedDelivery,
      collection_id: artwork.collection || null,
    });
    if (artError) throw artError;

    if (artwork.images && artwork.images.length > 0) {
      const imgPayloads = artwork.images
        .map((img) => img.trim())
        .filter(Boolean)
        .map((img, idx) => ({
          artwork_id: artwork.id,
          image_url: img,
          display_order: idx,
        }));

      if (imgPayloads.length > 0) {
        const { error: imgError } = await supabase.from('artwork_images').insert(imgPayloads);
        if (imgError) throw imgError;
      }
    }
  },

  async updateArtwork(id: string, artwork: Partial<Artwork>): Promise<void> {
    const updateObj: Record<string, any> = {};

    if (artwork.title !== undefined) updateObj.title = artwork.title;
    if (artwork.artistId !== undefined) updateObj.artist_id = artwork.artistId || null;
    if (artwork.description !== undefined) updateObj.description = artwork.description;
    if (artwork.story !== undefined) updateObj.story = artwork.story;
    if (artwork.technique !== undefined) updateObj.technique = artwork.technique;
    if (artwork.price !== undefined) updateObj.price = artwork.price;
    if (artwork.category !== undefined) updateObj.category_id = artwork.category;
    if (artwork.medium !== undefined) updateObj.medium = artwork.medium;
    if (artwork.dimensions !== undefined) updateObj.dimensions = artwork.dimensions;
    if (artwork.orientation !== undefined) updateObj.orientation = artwork.orientation;
    if (artwork.availability !== undefined) updateObj.availability = artwork.availability;
    if (artwork.featured !== undefined) updateObj.featured = artwork.featured;
    if (artwork.popular !== undefined) updateObj.popular = artwork.popular;
    if (artwork.newArrival !== undefined) updateObj.new_arrival = artwork.newArrival;
    if (artwork.isOriginal !== undefined) updateObj.is_original = artwork.isOriginal;
    if (artwork.framingAvailable !== undefined)
      updateObj.framing_available = artwork.framingAvailable;
    if (artwork.estimatedDelivery !== undefined)
      updateObj.estimated_delivery = artwork.estimatedDelivery;
    if (artwork.collection !== undefined) updateObj.collection_id = artwork.collection || null;

    updateObj.updated_at = new Date().toISOString();

    if (Object.keys(updateObj).length > 1) {
      const { error: artError } = await supabase.from('artworks').update(updateObj).eq('id', id);
      if (artError) throw artError;
    }

    if (artwork.images !== undefined) {
      const { error: delError } = await supabase
        .from('artwork_images')
        .delete()
        .eq('artwork_id', id);
      if (delError) throw delError;

      const imgPayloads = artwork.images
        .map((img) => img.trim())
        .filter(Boolean)
        .map((img, idx) => ({
          artwork_id: id,
          image_url: img,
          display_order: idx,
        }));

      if (imgPayloads.length > 0) {
        const { error: imgError } = await supabase.from('artwork_images').insert(imgPayloads);
        if (imgError) throw imgError;
      }
    }
  },

  async softDeleteArtwork(id: string): Promise<void> {
    const { error } = await supabase
      .from('artworks')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async restoreArtwork(id: string): Promise<void> {
    const { error } = await supabase
      .from('artworks')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  // --- CATEGORY CRUD ---
  async getCategories(): Promise<Category[]> {
    const { data, error } = (await supabase
      .from('categories')
      .select('*')
      .is('deleted_at', null)
      .order('id', { ascending: true })) as any;
    if (error) throw error;

    return (data || []).map((c: any) => ({
      id: c.id,
      slug: c.slug || c.id,
      name: c.name,
      description: c.description || '',
      image: c.image_url || '',
    }));
  },

  async createCategory(category: Category): Promise<void> {
    const { error } = await supabase.from('categories').insert({
      id: category.id,
      slug: category.id,
      name: category.name,
      description: category.description,
      image_url: category.image,
    } as any);
    if (error) throw error;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (category.name !== undefined) updateObj.name = category.name;
    if (category.description !== undefined) updateObj.description = category.description;
    if (category.image !== undefined) updateObj.image_url = category.image;

    const { error } = await supabase
      .from('categories')
      .update(updateObj as any)
      .eq('id', id);
    if (error) throw error;
  },

  async softDeleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (error) throw error;
  },

  // --- COLLECTION CRUD ---
  async getCollections(): Promise<Collection[]> {
    const { data, error } = (await supabase
      .from('collections')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })) as any;
    if (error) throw error;

    return (data || []).map((col: any) => ({
      id: col.id,
      slug: col.slug || col.id,
      name: col.title,
      description: col.description || '',
      image: col.cover_image || '',
      curatorNote: undefined,
    }));
  },

  async createCollection(col: Collection): Promise<void> {
    const { error } = await supabase.from('collections').insert({
      id: col.id,
      slug: col.id,
      title: col.name,
      description: col.description,
      cover_image: col.image,
    } as any);
    if (error) throw error;
  },

  async updateCollection(id: string, col: Partial<Collection>): Promise<void> {
    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (col.name !== undefined) updateObj.title = col.name;
    if (col.description !== undefined) updateObj.description = col.description;
    if (col.image !== undefined) updateObj.cover_image = col.image;

    const { error } = await supabase
      .from('collections')
      .update(updateObj as any)
      .eq('id', id);
    if (error) throw error;
  },

  async softDeleteCollection(id: string): Promise<void> {
    const { error } = await supabase
      .from('collections')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (error) throw error;
  },

  // --- ARTIST CRUD ---
  async getArtists(): Promise<Artist[]> {
    const { data, error } = (await supabase
      .from('artists')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })) as any;
    if (error) throw error;

    return (data || []).map((art: any) => ({
      id: art.id,
      slug: art.slug || art.id,
      name: art.name,
      bio: art.bio || '',
      avatar: art.profile_image || '',
      mediums: art.specialty ? art.specialty.split(',').map((s: string) => s.trim()) : [],
      statement: '',
    }));
  },

  async createArtist(art: Artist): Promise<void> {
    const { error } = await supabase.from('artists').insert({
      id: art.id,
      slug: art.id,
      name: art.name,
      bio: art.bio,
      profile_image: art.avatar,
      specialty: Array.isArray(art.mediums) ? art.mediums.join(', ') : art.mediums || '',
    } as any);
    if (error) throw error;
  },

  async updateArtist(id: string, art: Partial<Artist>): Promise<void> {
    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (art.name !== undefined) updateObj.name = art.name;
    if (art.bio !== undefined) updateObj.bio = art.bio;
    if (art.avatar !== undefined) updateObj.profile_image = art.avatar;
    if (art.mediums !== undefined) {
      updateObj.specialty = Array.isArray(art.mediums) ? art.mediums.join(', ') : art.mediums || '';
    }

    const { error } = await supabase
      .from('artists')
      .update(updateObj as any)
      .eq('id', id);
    if (error) throw error;
  },

  async softDeleteArtist(id: string): Promise<void> {
    const { error } = await supabase
      .from('artists')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (error) throw error;
  },

  // --- GLOBAL ADMIN SEARCH ---
  async globalSearch(term: string): Promise<Record<string, any[]>> {
    if (!term) return { artworks: [], commissions: [], orders: [], artists: [], users: [] };

    const artworksPromise = supabase
      .from('artworks')
      .select('id, title, artist_id, price')
      .or(`title.ilike.%${term}%,artist_id.ilike.%${term}%`)
      .limit(5);

    const commissionsPromise = supabase
      .from('commissions')
      .select('id, title, status, customer_budget')
      .or(`title.ilike.%${term}%,status.ilike.%${term}%`)
      .limit(5);

    const ordersPromise = supabase
      .from('orders')
      .select('id, customer_name, customer_email, total, status')
      .or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`)
      .limit(5);

    const artistsPromise = supabase
      .from('artists')
      .select('id, name')
      .ilike('name', `%${term}%`)
      .limit(5);

    const usersPromise = supabase
      .from('profiles')
      .select('id, full_name, role')
      .ilike('full_name', `%${term}%`)
      .limit(5);

    const [art, comm, ord, artst, usr] = await Promise.all([
      artworksPromise,
      commissionsPromise,
      ordersPromise,
      artistsPromise,
      usersPromise,
    ]);

    return {
      artworks: art.data || [],
      commissions: comm.data || [],
      orders: ord.data || [],
      artists: artst.data || [],
      users: usr.data || [],
    };
  },
};
export default AdminRepository;
