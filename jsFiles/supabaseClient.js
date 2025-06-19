//connect to supabase
const supabaseUrl = 'https://cjhlknvlwumeamuljfps.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqaGxrbnZsd3VtZWFtdWxqZnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTM3MDcsImV4cCI6MjA2NTU4OTcwN30.uNzU4uEDb9MJDfBoFMITL4socos5WA82BDwPCFfMIQw';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
export const supabase = createClient(supabaseUrl, supabaseKey);