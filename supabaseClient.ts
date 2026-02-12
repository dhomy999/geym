import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

const supabaseUrl = 'https://sxglnhvibwcbuzuhggyo.supabase.co';
const supabaseKey = 'sb_publishable_EWKqMNmE4un_gKRkaDho8A_hh3qQhII'; // Using public key

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
