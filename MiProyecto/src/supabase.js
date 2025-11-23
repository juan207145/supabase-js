import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://jtjmfcybtetylzamiyqv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0am1mY3lidGV0eWx6YW1peXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTEzNTksImV4cCI6MjA3ODI4NzM1OX0.J7TFB5ig8fQr64IJaliOiXyhrpNxFkRukmsrpEOePDE";

export const supabase = createClient(supabaseUrl, supabaseKey);

