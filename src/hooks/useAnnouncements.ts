import { useState, useEffect } from "react";
const backendURL=process.env.NEXT_PUBLIC_BACKEND_URL;
export interface Announcement {
  _id?: string;
  title: string;
  message: string;
  date?: string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${backendURL}/api/announcements`;


  // Fetch all announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new announcement
  const addAnnouncement = async (announcement: Announcement) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      });
      const data = await res.json();
      setAnnouncements((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error adding announcement", err);
    }
  };

  // Update announcement
  const updateAnnouncement = async (id: string, updatedData: Announcement) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      setAnnouncements((prev) =>
        prev.map((a) => (a._id === id ? data : a))
      );
    } catch (err) {
      console.error("Error updating announcement", err);
    }
  };

  // Delete announcement
  const deleteAnnouncement = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting announcement", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
}
