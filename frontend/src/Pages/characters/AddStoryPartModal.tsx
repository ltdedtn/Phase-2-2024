import React, { useState, useEffect } from "react";
import axios from "axios";

interface AddStoryPartModalProps {
  characterId: number;
  onClose: () => void;
  onStoryPartAdded: () => void;
}

interface StoryPart {
  partId: number;
  content: string;
}

const AddStoryPartModal: React.FC<AddStoryPartModalProps> = ({
  characterId,
  onClose,
  onStoryPartAdded,
}) => {
  const [content, setContent] = useState<string>("");
  const [storyId, setStoryId] = useState<number | "">("");
  const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoryParts = async () => {
      try {
        const response = await axios.get<StoryPart[]>(
          "https://localhost:7023/api/StoryParts"
        );
        setStoryParts(response.data);
      } catch (error) {
        console.error("Error fetching story parts", error);
        setError("Failed to fetch story parts. Please try again.");
      }
    };

    fetchStoryParts();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!storyId) {
      setError("Please select a story ID.");
      return;
    }

    try {
      await axios.post("https://localhost:7023/api/StoryParts", {
        content,
        storyId,
        characterId,
        createdAt: new Date().toISOString(),
      });
      onStoryPartAdded(); // Notify parent component to refresh the story parts
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding story part", error);
      setError("Failed to add story part. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Story Part</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="storyId">Story ID:</label>
            <select
              id="storyId"
              value={storyId}
              onChange={(e) => setStoryId(Number(e.target.value))}
              required
            >
              <option value="">Select a Story ID</option>
              {storyParts.map((part) => (
                <option key={part.partId} value={part.partId}>
                  {part.partId} - {part.content}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">
            Add Story Part
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStoryPartModal;
