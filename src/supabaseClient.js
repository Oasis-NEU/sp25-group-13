import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycmiymyhtnehkjkyajqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbWl5bXlodG5laGtqa3lhanF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjE4NzYsImV4cCI6MjA1NDY5Nzg3Nn0.A6a7xLCm2T0KjFRsm97iPQWR70JxgecqeY7LZ7dQSU0';
export const supabase = createClient(supabaseUrl, supabaseKey);
