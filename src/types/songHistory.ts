export interface SongHistoryEntry {
  user_id: string;
  song_title: string;
  artist: string;
  album: string | null;
  cover_art_url: string | null;
  confidence_score: number | null;
  identification_method: "type" | "sing" | "speak";
  identified_at: string;
}
