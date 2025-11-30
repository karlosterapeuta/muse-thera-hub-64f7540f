
import { TableCell, TableRow } from "@/components/ui/table";
import { UserAvatar } from "./UserAvatar";
import { RoleBadge } from "./RoleBadge";
import { StatusToggle } from "./StatusToggle";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ForceLogoutDialog } from "./ForceLogoutDialog";
import { ExpirationBadge } from "./ExpirationBadge";
import { Profile } from "../types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserRowProps {
  user: Profile;
  onToggleStatus: (user: Profile) => Promise<void>;
  onViewStatusLogs: (user: Profile) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onForceLogout: (userId: string, userName: string | null) => Promise<void>;
  onViewDetails: (user: Profile) => void;
  loadingLogout?: Record<string, boolean>;
}

export function UserRow({ 
  user, 
  onToggleStatus, 
  onViewStatusLogs, 
  onDeleteUser, 
  onForceLogout,
  onViewDetails,
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
        <div className="text-sm text-muted-foreground">
          {new Date(user.created_at).toLocaleDateString('pt-BR')}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <ExpirationBadge expiresAt={user.expires_at} />
          {user.expires_at && (
            <div className="text-xs text-muted-foreground">
              {new Date(user.expires_at).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <ScrollArea className="max-h-20 w-full">
          <div className="flex flex-col sm:flex-row gap-1 items-start sm:items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewDetails(user)}
              title="Ver detalhes"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <DeleteUserDialog onDelete={() => onDeleteUser(user.id)} />
            
            {user.status === 'active' && (
              <ForceLogoutDialog 
                onForceLogout={() => onForceLogout(user.id, user.name)} 
                isLoading={isLogoutLoading}
              />
            )}
          </div>
        </ScrollArea>
      </TableCell>
    </TableRow>
  );
}
