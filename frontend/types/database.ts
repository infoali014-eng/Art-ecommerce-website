export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      artists: {
        Row: {
          id: string;
          name: string;
          slug: string;
          bio: string | null;
          profile_image: string | null;
          specialty: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          bio?: string | null;
          profile_image?: string | null;
          specialty?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          bio?: string | null;
          profile_image?: string | null;
          specialty?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          cover_image: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          slug: string;
          title: string;
          description?: string | null;
          cover_image?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          cover_image?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      artworks: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          story: string | null;
          technique: string | null;
          price: number;
          category_id: string | null;
          artist_id: string | null;
          collection_id: string | null;
          medium: string | null;
          dimensions: string | null;
          orientation: string | null;
          availability: string;
          featured: boolean;
          popular: boolean;
          new_arrival: boolean;
          is_original: boolean;
          framing_available: boolean;
          estimated_delivery: string | null;
          inventory_quantity: number;
          is_active: boolean;
          view_count: number;
          sold_count: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          title: string;
          slug: string;
          description?: string | null;
          story?: string | null;
          technique?: string | null;
          price: number;
          category_id?: string | null;
          artist_id?: string | null;
          collection_id?: string | null;
          medium?: string | null;
          dimensions?: string | null;
          orientation?: string | null;
          availability?: string;
          featured?: boolean;
          popular?: boolean;
          new_arrival?: boolean;
          is_original?: boolean;
          framing_available?: boolean;
          estimated_delivery?: string | null;
          inventory_quantity?: number;
          is_active?: boolean;
          view_count?: number;
          sold_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          story?: string | null;
          technique?: string | null;
          price?: number;
          category_id?: string | null;
          artist_id?: string | null;
          collection_id?: string | null;
          medium?: string | null;
          dimensions?: string | null;
          orientation?: string | null;
          availability?: string;
          featured?: boolean;
          popular?: boolean;
          new_arrival?: boolean;
          is_original?: boolean;
          framing_available?: boolean;
          estimated_delivery?: string | null;
          inventory_quantity?: number;
          is_active?: boolean;
          view_count?: number;
          sold_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      artwork_images: {
        Row: {
          id: number;
          artwork_id: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          artwork_id: string;
          image_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          artwork_id?: string;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          quantity: number;
          frame_option: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id: string;
          quantity?: number;
          frame_option?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string;
          quantity?: number;
          frame_option?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      commissions: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          artwork_type: string | null;
          description: string | null;
          special_instructions: string | null;
          customer_budget: number | null;
          quoted_price: number | null;
          width: number | null;
          height: number | null;
          size_unit: string;
          orientation: string | null;
          frame_option: string | null;
          preferred_style: string | null;
          preferred_colors: string[] | null;
          artwork_purpose: string | null;
          deadline: string | null;
          status: string;
          payment_status: string;
          assigned_artist_id: string | null;
          estimated_completion: string | null;
          admin_notes: string | null;
          internal_notes: string | null;
          quotation_notes: string | null;
          priority: string;
          completion_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          artwork_type?: string | null;
          description?: string | null;
          special_instructions?: string | null;
          customer_budget?: number | null;
          quoted_price?: number | null;
          width?: number | null;
          height?: number | null;
          size_unit?: string;
          orientation?: string | null;
          frame_option?: string | null;
          preferred_style?: string | null;
          preferred_colors?: string[] | null;
          artwork_purpose?: string | null;
          deadline?: string | null;
          status?: string;
          payment_status?: string;
          assigned_artist_id?: string | null;
          estimated_completion?: string | null;
          admin_notes?: string | null;
          internal_notes?: string | null;
          quotation_notes?: string | null;
          priority?: string;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          artwork_type?: string | null;
          description?: string | null;
          special_instructions?: string | null;
          customer_budget?: number | null;
          quoted_price?: number | null;
          width?: number | null;
          height?: number | null;
          size_unit?: string;
          orientation?: string | null;
          frame_option?: string | null;
          preferred_style?: string | null;
          preferred_colors?: string[] | null;
          artwork_purpose?: string | null;
          deadline?: string | null;
          status?: string;
          payment_status?: string;
          assigned_artist_id?: string | null;
          estimated_completion?: string | null;
          admin_notes?: string | null;
          internal_notes?: string | null;
          quotation_notes?: string | null;
          priority?: string;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      commission_reference_images: {
        Row: {
          id: number;
          commission_id: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          commission_id: string;
          image_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          commission_id?: string;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      commission_updates: {
        Row: {
          id: number;
          commission_id: string;
          old_status: string | null;
          new_status: string;
          message: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          commission_id: string;
          old_status?: string | null;
          new_status: string;
          message?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          commission_id?: string;
          old_status?: string | null;
          new_status?: string;
          message?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
