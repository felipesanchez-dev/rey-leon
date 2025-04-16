'use client';
import { useState } from 'react';
import { Input, Button } from 'rizzui';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface EditRoleProps {
  id: number;
  currentName: string;
}

export default function EditRole({ id, currentName }: EditRoleProps) {
  const [name, setName] = useState(currentName);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/users-permissions/roles/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
          body: JSON.stringify({
            name,
            description: `role ${name}`,
          }),
        }
      );

      const data = (await res.json()) as { name?: string; error?: { message?: string } };

      if (res.ok) {
        toast.success(`Rol actualizado a "${data.name}"`);
      } else {
        toast.error(data?.error?.message || 'Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error actualizando el rol:', error);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Editar Nombre del Rol</h3>
      <Input
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <Button onClick={handleUpdate} isLoading={loading}>
        Guardar Cambios
      </Button>
    </div>
  );
}
