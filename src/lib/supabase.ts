import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Если ключи пустые, клиент выдаст ошибку в консоль, но не "уронит" весь сайт
export const supabase = createClient(supabaseUrl, supabaseAnonKey)