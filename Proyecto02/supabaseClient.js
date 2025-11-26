import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


// CREDENCIALES 

let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeGlweHlweGpmdHZoZm5ndG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMTcwMDcsImV4cCI6MjA3OTY5MzAwN30.YaIPgyLUlzYSO_EFvDvsFEVYXUlRDD8U6I5H0QBN5ZY"; 
let SUPABASE_URL = "https://iqxipxypxjftvhfngtmx.supabase.co"; // Ejemplo: https://ptgdotzssxrqkxkjlysh.supabase.co

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);