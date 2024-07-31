// CharacterDash.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddStoryPartModal from "./AddStoryPartModal"; // Import the modal component
import { useNavigate } from "react-router-dom";
import { StoryPart, Character } from "../../models/Character";

const CharacterDash: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedStoryParts, setSelectedStoryParts] = useState<StoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<Character[]>(
          "https://localhost:7023/api/Characters"
        );
        setCharacters(response.data || []);
      } catch (error) {
        console.error("Error fetching characters", error);
        setError("Failed to fetch characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      fetchStoryParts(selectedCharacter.characterId);
    }
  }, [selectedCharacter]);

  const fetchStoryParts = async (characterId: number) => {
    try {
      const response = await axios.get<StoryPart[]>(
        `https://localhost:7023/api/Characters/${characterId}/storyparts`
      );

      if (response.status === 200) {
        const storyParts = response.data || [];
        const updatedStoryParts = await Promise.all(
          storyParts.map(async (storyPart) => {
            const storyResponse = await axios.get(
              `https://localhost:7023/api/Story/${storyPart.storyId}`
            );
            const storyTitle = storyResponse.data.title;
            return { ...storyPart, storyTitle };
          })
        );
        setSelectedStoryParts(updatedStoryParts);
      } else {
        console.error("Unexpected status code:", response.status);
        setError("Failed to fetch story parts. Please try again later.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("No story parts found for character:", characterId);
        setSelectedStoryParts([]);
      } else {
        console.error("Error fetching story parts", error);
        setError("Failed to fetch story parts. Please try again later.");
      }
    }
  };

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleDelete = async (characterId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this character?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://localhost:7023/api/Characters/${characterId}`
        );
        setCharacters(
          characters.filter(
            (character) => character.characterId !== characterId
          )
        );
        setSelectedCharacter(null);
        setSelectedStoryParts([]);
      } catch (error) {
        console.error("Error deleting character", error);
        setError("Failed to delete character. Please try again later.");
      }
    }
  };

  const handleCreateCharacter = () => {
    navigate("/characters/new");
  };

  const handleAddStoryPartClick = () => {
    setIsModalOpen(true);
  };

  const handleStoryPartAdded = () => {
    if (selectedCharacter) {
      fetchStoryParts(selectedCharacter.characterId);
    }
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
    <div className="character-dash-container">
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
          {characters.map((character) => (
            <div
              key={character.characterId}
              className="carousel-item"
              onClick={() => handleCharacterClick(character)}
            >
              <div className="image-container">
                <div className="character-name">{character.name}</div>
                <img
                  src={`https://localhost:7023${character.imageUrl}`}
                  alt={character.name}
                  className="carousel-image"
                />
              </div>
            </div>
          ))}
          <button
            className="create-story-button py-2 px-4 rounded ml-4"
            onClick={handleCreateCharacter}
          >
            Add New Character
          </button>
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
      {selectedCharacter && (
        <div className="character-details">
          <img
            src={`https://localhost:7023${selectedCharacter.imageUrl}`}
            alt={selectedCharacter.name}
            className="selected-image"
          />
          <p>{selectedCharacter.description}</p>
          {selectedStoryParts.length > 0 ? (
            selectedStoryParts.map((storyPart) => (
              <p key={storyPart.partId}>
                {storyPart.storyTitle} - {storyPart.content}
              </p>
            ))
          ) : (
            <p>No story parts available</p>
          )}
          <div>
            <button
              className="font-bold py-2 px-4 rounded"
              onClick={handleAddStoryPartClick}
            >
              Add Story Parts
            </button>
            <button
              className="font-bold py-2 px-4 rounded"
              onClick={() =>
                selectedCharacter?.characterId &&
                handleDelete(selectedCharacter.characterId)
              }
            >
              Delete Character
            </button>
          </div>
        </div>
      )}
      {isModalOpen && selectedCharacter && (
        <AddStoryPartModal
          characterId={selectedCharacter.characterId}
          onClose={() => setIsModalOpen(false)}
          onStoryPartAdded={handleStoryPartAdded}
        />
      )}
    </div>
  );
};

export default CharacterDash;
