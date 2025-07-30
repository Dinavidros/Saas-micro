import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gwcgaochlmlobforbcwj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3Y2dhb2NobG1sb2Jmb3JiY3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDI5ODMsImV4cCI6MjA2OTI3ODk4M30.iR0F7JY0nxjio1Hvmge367Q7KpAHhbSWMF2S1w5YT3s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
