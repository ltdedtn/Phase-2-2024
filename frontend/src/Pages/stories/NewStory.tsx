import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewStory = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userId, setUserId] = useState<number | "">(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ userId: number; username: string }[]>(
    []
  ); // For dropdown
  const navigate = useNavigate();

  // Fetch available users for the dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:7023/api/User");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
      setError("Failed to fetch users. Please try again.");
    }
  };

  // Load users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview URL
    }
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("userId", userId.toString());
      if (imageFile) {
        formData.append("imageFile", imageFile); // Ensure this key matches the backend parameter name
      }

      await axios.post("https://localhost:7023/api/Story", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/stories");
    } catch (error) {
      console.error("Error creating new story", error);
      setError("Failed to create story. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Story</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="description" className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="userId" className="label">
            <span className="label-text">User</span>
          </label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="image" className="label">
            <span className="label-text">Image</span>
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="input input-bordered w-full"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Story
        </button>
      </form>
    </div>
  );
};

export default NewStory;
