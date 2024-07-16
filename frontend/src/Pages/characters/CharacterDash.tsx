import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const carouselCenterMode = {
    centerMode: true,
    centerPadding: "20%",
    slidesToShow: 3,
  };

  return (
    <div className="character-dash-container">
      <Carousel responsive={responsive} {...carouselCenterMode}>
        {characters.map((character) => (
          <div
            key={character.characterId}
            className="carousel-item"
            onClick={() => handleCharacterClick(character)}
          >
            <img
              src={`https://localhost:7023/${character.imageUrl}`}
              alt={character.name}
              className="carousel-image"
            />
            <p>{character.name}</p>
          </div>
        ))}
      </Carousel>
      {selectedCharacter && (
        <div className="character-details">
          <h2>{selectedCharacter.description}</h2>
          <img
            src={`https://localhost:7023/${selectedCharacter.imageUrl}`}
            alt={selectedCharacter.name}
            className="selected-image"
          />
          <p>{selectedCharacter.description}</p>
          <p>Story: {selectedCharacter.story.title}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterDash;
