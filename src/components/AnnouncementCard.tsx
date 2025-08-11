import React from "react";
import { Announcement } from "../hooks/useAnnouncements";

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-black">{announcement.title}</h2>
          <p className="text-gray-700 mt-1 text-black">{announcement.message}</p>
          <p className="text-sm text-gray-500 mt-2 text-black">
            {announcement.date
              ? new Date(announcement.date).toLocaleString()
              : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => onEdit(announcement)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => announcement._id && onDelete(announcement._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
