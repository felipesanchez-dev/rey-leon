'use client';

import React, { useState, useEffect } from 'react';
import { Button, Text, Input } from 'rizzui';
import Select from 'react-select';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  documentId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  EPS: string;
  typeDocument: string;
  numberDocument: string;
  regime: string;
  affiliation: string;
  gender: string;
  birthdate: string;
  type: string;
  age: number;
  state: boolean;
  zone: string;
  departament: string;
  responsible: string;
  relationship: string;
  responsiblePhone: string;
  address: string;
  locality: string;
  coordinates: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Option {
  value: string;
  label: string;
  user: User;
}

const EditUser = () => {
  const [users, setUsers] = useState<Option[]>([]);
  const [selectedUser, setSelectedUser] = useState<Option | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/patients',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        const data = (await res.json()) as { data: User[] };
        const userList: Option[] = data.data.map((user: User) => ({
          value: user.id,
          label: user.name,
          user,
        }));

        setUsers(userList);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, [session]);

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedUser(selectedOption);
      setUserData(selectedOption.user);
    } else {
      setSelectedUser(null);
      setUserData(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    if (userData) {
      setUserData({
        ...userData,
        [field]: e.target.value,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!userData || !session) return;

    try {
      const res = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/patients/${userData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
          body: JSON.stringify({ data: userData }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success('Usuario actualizado correctamente 🎉');
        console.log('Usuario actualizado:', data);
      } else {
        toast.error('Error al actualizar el usuario 🚫');
        console.error('Respuesta del servidor:', data);
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      toast.error('Hubo un error al actualizar el usuario');
    }
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setUserData(null);
  };

  return (
    <div className="card space-y-4 p-4">
      <h2 className="text-lg font-semibold">Editar Usuario</h2>

      <div className="select-container">
        <Select
          options={users}
          onChange={handleSelectChange}
          placeholder="Selecciona un usuario"
          isSearchable
        />
      </div>

      {userData && (
        <div className="edit-form space-y-3">
          <div>
            <Text>Nombre</Text>
            <Input
              value={userData.name}
              onChange={(e) => handleInputChange(e, 'name')}
            />
          </div>
          <div>
            <Text>Correo Electrónico</Text>
            <Input
              value={userData.email}
              onChange={(e) => handleInputChange(e, 'email')}
            />
          </div>
          <div>
            <Text>Teléfono</Text>
            <Input
              value={userData.phone}
              onChange={(e) => handleInputChange(e, 'phone')}
            />
          </div>
          <div>
            <Text>Ciudad</Text>
            <Input
              value={userData.city}
              onChange={(e) => handleInputChange(e, 'city')}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSaveChanges} color="primary">
              Guardar Cambios
            </Button>
            <Button onClick={handleCancelEdit} color="danger" variant="outline">
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
