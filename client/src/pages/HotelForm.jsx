import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client.js";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  country: "",
  city: "",
  address: "",
};

export default function HotelForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      api.getHotel(id).then(({ hotel }) => {
        setForm({
          title: hotel.title,
          description: hotel.description,
          price: hotel.price,
          country: hotel.country,
          city: hotel.city,
          address: hotel.address || "",
        });
        setExistingImage(hotel.image_url);
      });
    }
  }, [mode, id]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (mode === "edit") {
        await api.updateHotel(id, fd);
        navigate(`/hotels/${id}`);
      } else {
        const { hotel } = await api.createHotel(fd);
        navigate(`/hotels/${hotel.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>{mode === "edit" ? "Edit hotel" : "Add a new hotel"}</h1>
      {error && <p className="error">{error}</p>}
      <form className="hotel-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input value={form.title} onChange={update("title")} required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={update("description")} rows={4} required />
        </label>
        <div className="form-row">
          <label>
            Price per night (€)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              required
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Country
            <input value={form.country} onChange={update("country")} required />
          </label>
          <label>
            City
            <input value={form.city} onChange={update("city")} required />
          </label>
        </div>
        <label>
          Address (optional)
          <input value={form.address} onChange={update("address")} />
        </label>
        <label>
          Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        {existingImage && !imageFile && (
          <img src={existingImage} alt="current" className="form-preview" />
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Add hotel"}
        </button>
      </form>
    </div>
  );
}
