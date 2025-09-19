
import { TableCell, TableRow } from "@/components/ui/table";
import { UserAvatar } from "./UserAvatar";
import { RoleBadge } from "./RoleBadge";
import { StatusToggle } from "./StatusToggle";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ForceLogoutDialog } from "./ForceLogoutDialog";
import { Profile } from "../types";

interface UserRowProps {
  user: Profile;
  onToggleStatus: (user: Profile) => Promise<void>;
  onViewStatusLogs: (user: Profile) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onForceLogout: (userId: string, userName: string | null) => Promise<void>;
  loadingLogout?: Record<string, boolean>;
}

export function UserRow({ 
  user, 
  onToggleStatus, 
  onViewStatusLogs, 
  onDeleteUser, 
  onForceLogout, 
  loadingLogout 
}: UserRowProps) {
  const isLogoutLoading = loadingLogout?.[user.id] || false;

  return (
    <TableRow key={user.id}>
      <TableCell className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.avatar_url} name={user.name} />
        <div>
          <div className="font-medium">{user.name}</div>
        </div>
      </TableCell>
      <TableCell>
        <RoleBadge role={user.user_roles?.[0]?.role || 'professional'} />
      </TableCell>
      <TableCell>
        <StatusToggle 
          status={user.status} 
          onToggle={() => onToggleStatus(user)} 
          onViewLogs={() => onViewStatusLogs(user)} 
        />
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell className="space-x-1">
        <DeleteUserDialog onDelete={() => onDeleteUser(user.id)} />
        
        {user.status === 'active' && (
          <ForceLogoutDialog 
            onForceLogout={() => onForceLogout(user.id, user.name)} 
            isLoading={isLogoutLoading}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
