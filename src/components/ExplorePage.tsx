import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Menu,
  Bell,
  PlayCircle,
  Mic,
  Music,
  ChevronDown,
} from "lucide-react";
import { Input } from "./ui/input";
import Navigation from "./Navigation";
import { cn } from "@/lib/utils";

type Album = {
  id: number;
  title: string;
  artist: string;
  tracks: number;
  likes: string;
  image: string;
  backgroundColor?: string;
  lyrics?: string;
};

// Sample album data
const albumData: Album[] = [
  {
    id: 1,
    title: "PARANOIA",
    artist: "Unknown Artist",
    tracks: 23,
    likes: "2.3 mill",
    image:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&q=80",
    backgroundColor: "#d92626",
    lyrics: "Lost in the darkness, voices in my head",
  },
  {
    id: 2,
    title: "Reflections",
    artist: "Ambient Sounds",
    tracks: 23,
    likes: "2.3 mill",
    image:
      "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=400&q=80",
    lyrics: "Calm waters mirror the sky, peaceful mind",
  },
  {
    id: 3,
    title: "Sunset Acoustic",
    artist: "Guitar Ensemble",
    tracks: 23,
    likes: "2.3 mill",
    image:
      "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80",
    lyrics: "Golden hour fading, strings softly playing",
  },
];

export default function SearchPage() {
  // State management
  const [activeTab, setActiveTab] = useState<"collections" | "likes">(
    "collections",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState<
    "artist" | "song" | "album" | "lyrics"
  >("artist");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>(albumData);

  // Filter albums based on search criteria and query
  const filterAlbums = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredAlbums(albumData);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = albumData.filter((album) => {
      switch (searchCriteria) {
        case "artist":
          return album.artist.toLowerCase().includes(query);
        case "song":
          return album.title.toLowerCase().includes(query);
        case "album":
          return album.title.toLowerCase().includes(query);
        case "lyrics":
          return album.lyrics?.toLowerCase().includes(query) || false;
        default:
          return false;
      }
    });

    setFilteredAlbums(filtered);

    // Log search analytics
    console.log(`Search performed: ${searchCriteria} - "${query}"`);
    console.log(`Results found: ${filtered.length}`);
  }, [searchQuery, searchCriteria]);

  useEffect(() => {
    filterAlbums();
  }, [filterAlbums]);

  const handleSearchCriteriaChange = (
    criteria: "artist" | "song" | "album" | "lyrics",
  ) => {
    setSearchCriteria(criteria);
    setShowSearchDropdown(false);
  };

  const getSearchPlaceholder = () => {
    switch (searchCriteria) {
      case "artist":
        return "Search by Artist";
      case "song":
        return "Search by Song Name";
      case "album":
        return "Search by Album Name";
      case "lyrics":
        return "Search by Lyrics";
      default:
        return "Search Artist, Music";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearchDropdown) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchDropdown]);

  return (
    <div className="w-full max-w-[435px] min-h-[600px] h-full sm:h-[932px] relative bg-[#0C121F] rounded-2xl overflow-hidden mx-auto">
      {/* Header with menu and notification */}
      <div className="p-4 sm:p-7 flex justify-between items-center">
        <Menu className="h-6 w-6 text-white" />
        <div className="relative">
          <Bell className="h-6 w-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-purple-400 rounded-full"></div>
        </div>
      </div>

      {/* Quick Action Buttons at top */}
      <div className="px-4 sm:px-7 mb-6 sm:mb-8 flex justify-center gap-6">
        <button
          className="bg-neon-gradient-alt text-white rounded-xl p-4 shadow-neon-purple flex flex-col items-center transition-all hover:scale-105 active:scale-95 w-32"
          onClick={() =>
            alert("Sing to identify songs by singing a melody or lyrics")
          }
        >
          <Mic className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Sing</span>
        </button>
        <button
          className="bg-neon-gradient text-white rounded-xl p-4 shadow-neon-blue flex flex-col items-center transition-all hover:scale-105 active:scale-95 w-32"
          onClick={() => alert("Listen to identify songs playing around you")}
        >
          <Music className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Listen</span>
        </button>
      </div>

      {/* Search bar with dropdown - moved down */}
      <div className="px-4 sm:px-7 mb-6 sm:mb-8 mt-16 sm:mt-24">
        <div className="relative">
          <div className="flex items-center gap-2 bg-[#1e1e1e] rounded-full pr-4 shadow-neon-glow">
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="bg-[#1e1e1e] text-white h-10 sm:h-12 pl-12 rounded-full border-none pr-24 text-sm sm:text-base"
                variant="search"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSearchDropdown(!showSearchDropdown);
                }}
                aria-label="Select search criteria"
                aria-expanded={showSearchDropdown}
              >
                <span className="text-xs sm:text-sm">{searchCriteria}</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>

              {showSearchDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-[#1e1e1e] rounded-xl shadow-lg z-20 w-36 sm:w-40 py-2 border border-white/10">
                  <button
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-white/5",
                      searchCriteria === "artist"
                        ? "text-neon-purple-300"
                        : "text-white/70",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchCriteriaChange("artist");
                    }}
                  >
                    Artist
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-white/5",
                      searchCriteria === "song"
                        ? "text-neon-purple-300"
                        : "text-white/70",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchCriteriaChange("song");
                    }}
                  >
                    Song Name
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-white/5",
                      searchCriteria === "album"
                        ? "text-neon-purple-300"
                        : "text-white/70",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchCriteriaChange("album");
                    }}
                  >
                    Album Name
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-white/5",
                      searchCriteria === "lyrics"
                        ? "text-neon-purple-300"
                        : "text-white/70",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchCriteriaChange("lyrics");
                    }}
                  >
                    Lyrics
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-7 mb-4 sm:mb-6">
        <div className="flex space-x-4">
          <button
            className={cn(
              "px-4 sm:px-8 py-2 rounded-full text-sm sm:text-base font-medium transition-colors",
              activeTab === "collections"
                ? "bg-neon-purple-400 text-white"
                : "bg-[#1e1e1e] text-white/70 hover:bg-[#1e1e1e]/80",
            )}
            onClick={() => setActiveTab("collections")}
          >
            Collections
          </button>
          <button
            className={cn(
              "px-4 sm:px-8 py-2 rounded-full text-sm sm:text-base font-medium transition-colors",
              activeTab === "likes"
                ? "bg-neon-purple-400 text-white"
                : "bg-[#1e1e1e] text-white/70 hover:bg-[#1e1e1e]/80",
            )}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </button>
        </div>
      </div>

      {/* Album list - made scrollable without scrollbar */}
      <div className="px-4 sm:px-7 pb-24 overflow-hidden">
        <div
          className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-450px)] scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <div
                key={album.id}
                className="relative rounded-xl overflow-hidden shadow-neon-glow"
              >
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-[200px] object-cover"
                />
                {album.backgroundColor && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: album.backgroundColor }}
                  >
                    <h2 className="text-white text-4xl font-bold">
                      {album.title}
                    </h2>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="text-xl font-medium">
                    {album.tracks} TRACKS
                  </div>
                  <div className="text-base font-medium text-white/70">
                    {album.likes} likes
                  </div>
                </div>
                <button
                  className="absolute bottom-4 right-4 bg-neon-purple-400 rounded-full p-2 transition-transform hover:scale-105 active:scale-95 shadow-neon-purple"
                  aria-label="Play album"
                >
                  <PlayCircle className="h-8 w-8 text-white" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-white/70">
              <p className="text-lg">No results found</p>
              <p className="text-sm mt-2">
                Try a different search term or criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Buttons removed from bottom as they're now at the top */}

      {/* Bottom Navigation */}
      <Navigation className="max-w-[435px] mx-auto" />
    </div>
  );
}
