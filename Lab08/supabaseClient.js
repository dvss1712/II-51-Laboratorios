import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ==========================
// CONFIGURA TU SUPABASE
// ==========================
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2RvdHpzc3hycWt4a2pseXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjExNTIsImV4cCI6MjA3NjEzNzE1Mn0.yQl0Xr7lRqO1DgPtwG9NCO5fXtRZpuknL0gLo8iYl60";
let SUPABASE_URL = "https://ptgdotzssxrqkxkjlysh.supabase.co";

// Crear cliente una sola vez
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 