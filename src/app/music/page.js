"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function MusicSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState(
    JSON.parse(Cookies.get("searchHistory") || "[]")
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const playerRef = useRef(null);

  // Fetch YouTube videos based on search term
  const searchMusic = async (query) => {
    const searchQuery = query || searchTerm;
    if (!searchQuery) return;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // Replace with your YouTube API Key

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchQuery}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const videoResults = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      setVideos(videoResults);
      setCurrentIndex(0);
      setPlaying(true);

      // Update search history
      const newHistory = [
        searchQuery,
        ...history.filter((h) => h !== searchQuery),
      ].slice(0, 5);
      setHistory(newHistory);
      Cookies.set("searchHistory", JSON.stringify(newHistory), { expires: 1 });
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  // Play next video automatically
  const handleEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Persist playback state when reopening the app
  useEffect(() => {
    const savedIndex = Cookies.get("lastPlayedIndex");
    const savedVideos = Cookies.get("lastPlayedVideos");
    if (savedIndex && savedVideos) {
      setVideos(JSON.parse(savedVideos));
      setCurrentIndex(Number(savedIndex));
      setPlaying(true);
    }
  }, []);

  useEffect(() => {
    Cookies.set("lastPlayedIndex", currentIndex);
    Cookies.set("lastPlayedVideos", JSON.stringify(videos));
  }, [currentIndex, videos]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center relative">
        <h1 className="text-2xl font-bold text-blue-400">🎵 Music Stream</h1>
        <div className="relative">
          <button
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setShowHistory(!showHistory)}
          >
            History ⏬
          </button>
          {showHistory && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-lg overflow-hidden">
              {history.map((item, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  onClick={() => searchMusic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Search Bar */}
      <div className="flex justify-center my-6 px-4">
        <input
          type="text"
          placeholder="Search for a song..."
          className="px-4 py-2 w-full max-w-lg text-black rounded-l-lg outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 px-6 py-2 rounded-r-lg hover:bg-blue-700"
          onClick={() => searchMusic()}
        >
          🔍 Search
        </button>
      </div>

      {/* Video Player */}
      {videos.length > 0 && (
        <div className="flex justify-center mt-6 px-4">
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${videos[currentIndex].id}`}
            width="100%"
            height="300px"
            playing={playing}
            controls
            onEnded={handleEnd}
          />
        </div>
      )}

      {/* Video Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 mt-6">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`bg-gray-800 p-4 rounded-lg text-center cursor-pointer ${
              index === currentIndex ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setPlaying(true);
            }}
          >
            <h2 className="text-lg font-bold mb-2">{video.title}</h2>
            <img src={video.thumbnail} alt={video.title} className="rounded-lg mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}