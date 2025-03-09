
import React from "react";

type AuthHeaderProps = {
  title: string;
  description: string;
};

export default function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="text-center">
      <img
        src="/lovable-uploads/a8f641fc-f081-490d-8028-c68c5eb3f911.png"
        alt="MuseTera Logo"
        className="mx-auto h-32 w-32 mb-4"
      />
      <h2 className="text-4xl font-bold text-primary mb-2">MuseTera</h2>
      <h3 className="text-2xl text-gray-600">{title}</h3>
      <p className="mt-2 text-lg text-gray-600">{description}</p>
    </div>
  );
}
