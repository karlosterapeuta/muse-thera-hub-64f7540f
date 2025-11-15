
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { UserRow } from "./UserRow";
import { Profile } from "../types";

interface UsersTableProps {
  users: Profile[];
  onToggleStatus: (user: Profile) => Promise<void>;
  onViewStatusLogs: (user: Profile) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onForceLogout: (userId: string, userName: string | null) => Promise<void>;
  onViewDetails: (user: Profile) => void;
  loadingLogout?: Record<string, boolean>;
}

export function UsersTable({ 
  users, 
  onToggleStatus, 
  onViewStatusLogs, 
  onDeleteUser, 
  onForceLogout,
  onViewDetails,
  loadingLogout 
}: UsersTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead>Expiração do Plano</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onToggleStatus={onToggleStatus}
                onViewStatusLogs={onViewStatusLogs}
                onDeleteUser={onDeleteUser}
                onForceLogout={onForceLogout}
                onViewDetails={onViewDetails}
                loadingLogout={loadingLogout}
              />
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
