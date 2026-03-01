export type Database = {
  public: {
    Tables: {
      projects: { Row: any; Insert: any; Update: any }
      tasks: { Row: any; Insert: any; Update: any }
      reflections: { Row: any; Insert: any; Update: any }
      mood_entries: { Row: any; Insert: any; Update: any }
      brain_dump: { Row: any; Insert: any; Update: any }
    }
  }
}
