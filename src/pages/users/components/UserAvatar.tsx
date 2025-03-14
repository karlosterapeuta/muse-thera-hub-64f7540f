
import { UserCircle } from "lucide-react";

interface UserAvatarProps {
  avatarUrl: string | null;
  name: string | null;
}

export function UserAvatar({ avatarUrl, name }: UserAvatarProps) {
  return (
    <>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || "Avatar"}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <UserCircle className="w-8 h-8 text-gray-400" />
      )}
    </>
  );
}
