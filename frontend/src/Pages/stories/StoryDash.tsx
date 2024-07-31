import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Story } from "../../models/Story";
import { StoryPart } from "../../models/StoryPart";

const StoryDash = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPartId, setExpandedPartId] = useState<number | null>(null);
  const navigate = useNavigate();
  const storyPartsCarouselRef = useRef<HTMLDivElement>(null);

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
        setStories([]); // Ensure stories is an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      const fetchStoryParts = async () => {
        try {
          const url = `https://localhost:7023/api/StoryParts/ByStory/${selectedStory.storyId}`;
          const response = await axios.get<StoryPart[]>(url);
          setStoryParts(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn("Story parts not found for the selected story.");
            setStoryParts([]);
          } else {
            console.error("Error fetching story parts", error);
            setError("Failed to fetch story parts. Please try again later.");
          }
        }
      };

      fetchStoryParts();
    } else {
      setStoryParts([]);
    }
  }, [selectedStory]);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  const handleAddStoryPartClick = () => {
    navigate("/storyPart/new");
  };

  const handleCreateStoryClick = () => {
    navigate("/stories/new");
  };

  const scrollCarousel = (
    direction: number,
    carouselRef: React.RefObject<HTMLDivElement>
  ) => {
    const container = carouselRef.current;
    if (container) {
      container.scrollBy({
        left: direction * container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const toggleExpandPart = (partId: number) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="story-dash-container">
      <div className="carousel-container">
        <button
          className="carousel-button left"
          onClick={() => scrollCarousel(-1, storyPartsCarouselRef)}
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
        <div className="carousel rounded-box">
          {stories.length === 0 ? (
            <p>No stories available</p>
          ) : (
            stories.map((story) => (
              <div
                tabIndex={0}
                key={story.storyId}
                className="carousel-item"
                onClick={() => handleStoryClick(story)}
              >
                <div className="image-container">
                  <div className="story-title">{story.title}</div>
                  <img
                    src={`https://localhost:7023/${story.imageUrl}`}
                    alt={story.title}
                    className="carousel-image"
                  />
                </div>
              </div>
            ))
          )}
          <button
            className="create-story-button  py-2 px-4 rounded ml-4"
            onClick={handleCreateStoryClick}
          >
            Add New Story
          </button>
        </div>
        <button
          className="carousel-button right"
          onClick={() => scrollCarousel(1, storyPartsCarouselRef)}
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
        <div className="story-details text-center">
          <h2 className="text-3xl font-bold mb-4 flex justify-center items-center">
            {selectedStory.title}
          </h2>
          <p>Description: {selectedStory.description}</p>
          <div className="story-parts">
            <div className="carousel-container">
              <button
                className="carousel-button left"
                onClick={() => scrollCarousel(-1, storyPartsCarouselRef)}
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
              <div className="carousel rounded-box" ref={storyPartsCarouselRef}>
                {storyParts.length === 0 ? (
                  <p>No story parts available</p>
                ) : (
                  storyParts.map((part) => (
                    <div
                      tabIndex={0}
                      key={part.partId}
                      className="carousel-item"
                    >
                      <div className="image-container">
                        {part.imageUrl && (
                          <img
                            src={`https://localhost:7023/${part.imageUrl}`}
                            alt={`Story Part ${part.partId}`}
                            className="carousel-image"
                          />
                        )}
                        <div className="story-part-content">
                          {expandedPartId === part.partId
                            ? part.content
                            : `${part.content.split("\n")[0]}...`}
                        </div>
                        <button
                          className="read-more-button"
                          onClick={() => toggleExpandPart(part.partId)}
                        >
                          {expandedPartId === part.partId
                            ? "Read Less"
                            : "Read More"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button
                  className="create-story-button py-2 px-4 rounded ml-4"
                  onClick={handleAddStoryPartClick}
                >
                  Add New Story Part
                </button>
              </div>
              <button
                className="carousel-button right"
                onClick={() => scrollCarousel(1, storyPartsCarouselRef)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDash;
