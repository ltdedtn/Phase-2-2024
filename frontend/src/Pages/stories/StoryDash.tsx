import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Story {
  storyId: number;
  title: string;
  description: string;
  createdAt: string;
  userId: number;
  user: {
    username: string;
  };
  characters: Array<{
    characterId: number;
    name: string;
  }>;
  screenshots: Array<{
    screenshotId: number;
    imagePath: string;
  }>;
  storyParts: Array<{
    partId: number;
    content: string;
  }>;
}

const StoryDash = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get<Story[]>(
          "https://localhost:7023/api/Story"
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories", error);
        setError("Failed to fetch stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  const scrollCarousel = (direction: number) => {
    const container = carouselRef.current;
    if (container) {
      container.scrollBy({
        left: direction * container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stories-dash-container">
      <div className="carousel-container">
        <button
          className="carousel-button left"
          onClick={() => scrollCarousel(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="carousel rounded-box" ref={carouselRef}>
          {stories.map((story) => (
            <div
              tabIndex={0}
              key={story.storyId}
              className="carousel-item"
              onClick={() => handleStoryClick(story)}
            >
              <div className="image-container">
                <div className="story-title">{story.title}</div>
                <img
                  src={`https://localhost:7023/${story.screenshots[0]?.imagePath}`}
                  alt={story.title}
                  className="carousel-image"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-button right"
          onClick={() => scrollCarousel(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {selectedStory && (
        <div className="story-details">
          <img
            src={`https://localhost:7023/${selectedStory.screenshots[0]?.imagePath}`}
            alt={selectedStory.title}
            className="selected-image"
          />
          <p>{selectedStory.description}</p>
          <p>
            Created at: {new Date(selectedStory.createdAt).toLocaleDateString()}
          </p>
          <p>Author: {selectedStory.user.username}</p>
          <div className="story-characters">
            <h3>Characters:</h3>
            <ul>
              {selectedStory.characters.map((character) => (
                <li key={character.characterId}>{character.name}</li>
              ))}
            </ul>
          </div>
          <div className="story-parts">
            <h3>Story Parts:</h3>
            <ul>
              {selectedStory.storyParts.map((part) => (
                <li key={part.partId}>{part.content}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDash;
