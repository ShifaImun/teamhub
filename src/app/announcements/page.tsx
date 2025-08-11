"use client";

import React, { useState } from "react";
import { useAnnouncements, Announcement } from "../../hooks/useAnnouncements";
import AnnouncementCard from "../../components/AnnouncementCard";
import AnnouncementModal from "../../components/AnnouncementModal";

export default function AnnouncementsPage() {
  const {
    announcements,
    loading,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAnnouncements();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Announcement | null>(null);

  const handleAddClick = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleSave = (announcement: Announcement) => {
    if (editData && editData._id) {
      updateAnnouncement(editData._id, announcement);
    } else {
      addAnnouncement(announcement);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditData(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Announcements</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Add Announcement
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-600">No announcements yet.</p>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editData}
      />
    </div>
  );
}
