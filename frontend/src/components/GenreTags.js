import React from "react";
import "./GenreTags.css";

const GenreTags = () => {
  const features = [
    { label: "INSTANT", icon: "⚡" },
    { label: "SECURE", icon: "🔒" },
    { label: "24/7", icon: "🌐" }
  ];

  return (
    <div className="genre-tags">
      {features.map((feature, index) => (
        <div key={index} className="genre-tag">
          <span className="tag-icon">{feature.icon}</span>
          {feature.label}
        </div>
      ))}
    </div>
  );
};

export default GenreTags;