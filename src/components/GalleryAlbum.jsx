import React from "react";

const GalleryAlbum = ({ album }) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <h2 className="font-semibold text-xl text-[#a3632d] mb-4">{album.title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {album.images.map((img, i) => (
          <img key={i} src={img} alt="" className="rounded-lg object-cover h-40 w-full" />
        ))}
      </div>
    </div>
  );
};

export default GalleryAlbum;
