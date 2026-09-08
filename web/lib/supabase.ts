// Supabase Client Mock Configuration

export const supabaseClient = {
  from: (table: string) => ({
    select: async () => ({ data: [], error: null }),
    insert: async (data: any) => ({ data, error: null }),
    update: async (data: any) => ({ data, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
  },
};
