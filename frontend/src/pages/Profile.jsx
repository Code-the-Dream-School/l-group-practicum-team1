import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

import PageLayout from "../components/layout/PageLayout";

import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../services/userService";

import "./Profile.css";

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  rating: "",
};

function ProfileContent({ user }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const userId = user?.id;

  const hasChanges =
    originalProfile &&
    JSON.stringify(profile) !== JSON.stringify(originalProfile);

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadProfile() {
      setMessage("");
      setError("");

      if (!userId) {
        setProfile(emptyProfile);
        setOriginalProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const loadedUser = await getMyProfile();

        if (!isCurrentRequest) return;

        const loadedProfile = {
          firstName: loadedUser.firstName || "",
          lastName: loadedUser.lastName || "",
          email: loadedUser.email || "",
          phone: loadedUser.phone || "",
          rating: loadedUser.rating || "",
        };

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (err) {
        if (!isCurrentRequest) return;

        setProfile(emptyProfile);
        setOriginalProfile(null);
        setError(err.message || "Could not load profile");
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isCurrentRequest = false;
    };
  }, [userId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setMessage("");
    setError("");

    try {
      await deleteMyAccount();

      logout();
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not delete account");
    }
  }

  function handleDiscardChanges() {
    if (!originalProfile) return;

    setProfile(originalProfile);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!userId) {
      setError("Please log in before editing your profile.");
      return;
    }

    if (!hasChanges) {
      return;
    }

    try {
      setIsSaving(true);

      const updatedUser = await updateMyProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        rating: profile.rating,
      });

      const updatedProfile = {
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        rating: updatedUser.rating || "",
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
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
            <input name="phone" value={profile.phone} onChange={handleChange} />
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

          <div className="profile-actions">
            <button
              type="button"
              className="discard-button"
              onClick={handleDiscardChanges}
              disabled={!hasChanges || isSaving}
            >
              Discard Changes
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="profile-danger-zone">
            <button
              type="button"
              className="delete-account-button"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </form>

        {message && <p className="success-message">{message}</p>}

        {error && <p className="error-message">{error}</p>}
      </div>
    </section>
  );
}

function Profile() {
  return (
    <PageLayout>
      {({ user }) => {
        if (!user) {
          return <Navigate to="/" replace />;
        }

        return <ProfileContent user={user} />;
      }}
    </PageLayout>
  );
}

export default Profile;
