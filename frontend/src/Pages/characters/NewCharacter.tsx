import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewCharacter = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [storyId, setStoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (storyId !== null) {
      formData.append("storyId", storyId.toString());
    }
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const response = await axios.post(
        "https://localhost:7023/api/Characters",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Character created successfully:", response.data);
      navigate("/characters");
    } catch (error) {
      console.error("Error creating character", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-8 relative flex flex-col justify-center">
      <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form">
            <h2>Create New Character</h2>

            <div>
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                className={`w-full input input-bordered`}
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                placeholder="Character Name"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="storyId">
                Story ID
              </label>
              <input
                className={`w-full input input-bordered`}
                type="number"
                id="storyId"
                name="storyId"
                value={storyId ?? ""}
                onChange={(e) => setStoryId(Number(e.target.value))}
                autoComplete="off"
                placeholder="Story ID"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="description">
                Description
              </label>
              <input
                className={`w-full input input-bordered`}
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                placeholder="Character Description"
              />
            </div>
            <div>
              <label className="label" htmlFor="imageFile">
                Upload Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleFileChange}
                required
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-xs max-h-48"
                  />
                </div>
              )}
            </div>
            <div>
              <button className="btn btn-block" type="submit">
                Create New Character
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCharacter;
