'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import RoleCard from '@/app/shared/roles-permissions/role-card';
import cn from '@core/utils/class-names';

interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  nb_users: number;
}

interface RolesGridProps {
  className?: string;
  gridClassName?: string;
}

export default function RolesGrid({
  className,
  gridClassName,
}: RolesGridProps) {
  const { data: session } = useSession();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener los roles
  const fetchRoles = async () => {
    if (!session) return;

    try {
      const res = await fetch(
        'https://reyleonback.s.cloudesarrollosmoyan.com/api/users-permissions/roles',
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
        }
      );

      const data = (await res.json()) as { roles: Role[] };

      setRoles(data.roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [session]);

  // Eliminación del rol
  const handleDeleteRole = () => {
    fetchRoles(); // Refresacr la lista de roles
  };

  if (loading) { //Estadp de carga
    return <div className="p-4 text-sm text-gray-500">Cargando roles...</div>;
  }

  return (
    <div className={cn('@container', className)}>
      <div
        className={cn(
          'grid grid-cols-1 gap-6 @[36.65rem]:grid-cols-2 @[56rem]:grid-cols-3 @[78.5rem]:grid-cols-4 @[100rem]:grid-cols-5',
          gridClassName
        )}
      >
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            id={role.id}
            name={role.name}
            color="rgba(0, 102, 255, 0.7)"
            users={[]}
            onDelete={handleDeleteRole}
          />
        ))}
      </div>
    </div>
  );
}
