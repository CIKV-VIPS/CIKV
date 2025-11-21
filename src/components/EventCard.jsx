import React from "react";
import SafeImage from "./SafeImage";

const EventCard = ({ event }) => {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <SafeImage
        src={event.image}
        alt={event.title}
        width={400}
        height={400}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#a3632d]">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{event.date}</p>
        <p className="text-gray-700 text-sm">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
