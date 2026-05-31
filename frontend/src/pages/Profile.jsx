import { useEffect, useState } from "react";

import PageLayout from "../components/layout/PageLayout";

import { getMyProfile, updateMyProfile } from "../services/userService";

import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rating: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getMyProfile();

        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          rating: user.rating || "",
        });
      } catch (err) {
        setError(err.message || "Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setIsSaving(true);

      await updateMyProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        rating: profile.rating,
      });

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <p>Loading profile...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="profile-page">
        <div className="profile-card">
          <h1>My Profile</h1>

          <form onSubmit={handleSubmit}>
            <label>
              First Name
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
              />
            </label>

            <label>
              Last Name
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input value={profile.email} disabled />
            </label>

            <label>
              Phone
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              Rating
              <input
                name="rating"
                type="number"
                value={profile.rating}
                onChange={handleChange}
              />
            </label>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {message && <p className="success-message">{message}</p>}

          {error && <p className="error-message">{error}</p>}
        </div>
      </section>
    </PageLayout>
  );
}

export default Profile;
