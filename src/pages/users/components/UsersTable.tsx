
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRow } from "./UserRow";
import { Profile } from "../types";

interface UsersTableProps {
  users: Profile[];
  onToggleStatus: (user: Profile) => Promise<void>;
  onViewStatusLogs: (user: Profile) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onForceLogout: (userId: string, userName: string | null) => Promise<void>;
}

export function UsersTable({ users, onToggleStatus, onViewStatusLogs, onDeleteUser, onForceLogout }: UsersTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <UserRow 
              key={user.id}
              user={user}
              onToggleStatus={onToggleStatus}
              onViewStatusLogs={onViewStatusLogs}
              onDeleteUser={onDeleteUser}
              onForceLogout={onForceLogout}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
