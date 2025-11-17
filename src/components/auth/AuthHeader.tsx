import React from "react";
import { MuseteraLogo } from "@/components/MuseteraLogo";

type AuthHeaderProps = {
  title: string;
  description: string;
};

export default function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4">
        <MuseteraLogo size={128} showText={true} />
      </div>
      <h3 className="text-2xl text-muted-foreground mt-4">{title}</h3>
      <p className="mt-2 text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
