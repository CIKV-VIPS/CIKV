import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#a3632d]">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{event.date}</p>
        <p className="text-gray-700 text-sm">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
