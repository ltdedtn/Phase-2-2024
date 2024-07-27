import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Character {
  characterId: number;
  name: string;
  description: string;
  storyId: number;
  story: {
    title: string;
  };
  imageUrl: string;
}

const CharacterDash = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<Character[]>(
          "https://localhost:7023/api/Characters"
        );
        setCharacters(response.data);
      } catch (error) {
        console.error("Error fetching characters", error);
        setError("Failed to fetch characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
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
                  src={`https://localhost:7023/${character.imageUrl}`}
                  alt={character.name}
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
      {selectedCharacter && (
        <div className="character-details">
          <img
            src={`https://localhost:7023/${selectedCharacter.imageUrl}`}
            alt={selectedCharacter.name}
            className="selected-image"
          />
          <p>{selectedCharacter.description}</p>
          <p>Story: {selectedCharacter.storyId}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterDash;
