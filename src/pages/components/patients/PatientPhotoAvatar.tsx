import { usePatientPhotoUrl } from "@/hooks/usePatientPhotoUrl";

interface PatientPhotoAvatarProps {
  value?: string | null;
  name: string;
  className?: string;
}

/**
 * Renders a patient's photo from the private "patients" bucket using a
 * short-lived signed URL, falling back to the patient's initials.
 */
export function PatientPhotoAvatar({ value, name, className }: PatientPhotoAvatarProps) {
  const url = usePatientPhotoUrl(value);

  if (url) {
    return <img src={url} alt={name} className={className ?? "w-full h-full object-cover"} />;
  }

  return <>{name.substring(0, 2).toUpperCase()}</>;
}
