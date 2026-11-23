import type { Avatar as AvatarValue } from './avatars';
import AvatarIcon from './AvatarIcon';
import './avatar.css';

type Props = {
  avatar: AvatarValue | null; // null = inca n-a ales: aratam initiala
  initial: string;
};

// Cercul de profil: simbolul ales pe culoarea aleasa, sau initiala.
export default function Avatar({ avatar, initial }: Props) {
  if (!avatar) return <span className="avatar" data-color="initial">{initial}</span>;
  return (
    <span className="avatar" data-color={avatar.color}>
      <AvatarIcon icon={avatar.icon} />
    </span>
  );
}
