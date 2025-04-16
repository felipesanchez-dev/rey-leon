'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

declare module 'next-auth' {
  interface Session {
    jwt?: string;
  }
}

interface UserCreateModalProps {
  onClose: () => void;
}

export default function UserCreateModal({ onClose }: UserCreateModalProps) {
  const modalRef = useRef(null);
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    firsName: '',
    typeDocument: '',
    numberDocument: '',
    phone: '',
    positionJob: '',
    address: '',
    sectorCategory: '',
    supplierType: '',
    city: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/users-permissions/roles',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );
        const data: any = await res.json();
        setRoles(data?.roles || []);
      } catch (err) {
        console.error('Error al cargar roles:', err);
        setErrorMessage('No se pudieron cargar los roles.');
      } finally {
        setLoadingRoles(false);
      }
    };

    if (session?.jwt) {
      fetchRoles();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (!formData.role || isNaN(Number(formData.role))) {
        setErrorMessage('Por favor, selecciona un rol válido.');
        setLoading(false);
        return;
      }

      if (!session || !(session as any).jwt) {
        setErrorMessage('No estás autenticado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://reyleonback.s.cloudesarrollosmoyan.com/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).jwt}`,
          },
          body: JSON.stringify({
            ...formData,
            numberDocument: Number(formData.numberDocument),
            role: formData.role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Respuesta del servidor:', result);
        const errorResult = result as { message?: string };
        throw new Error(errorResult.message || 'Error al crear usuario');
      }

      console.log(
        'Usuario creado:',
        result,
        'Recuerda siempre revisar la informacion creada, puede que hallas cometido un error'
      );
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Ocurrió un error al crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as any).contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (status === 'loading') return <p>Cargando sesión...</p>;
  if (!session) return <p>No estás autenticado. Por favor, inicia sesión.</p>;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Crear nuevo usuario</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-100 p-2 text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {[
            ['username', 'Nombre de usuario'],
            ['email', 'Correo electrónico'],
            ['password', 'Contraseña', 'password'],
            ['name', 'Nombre completo'],
            ['firsName', 'Primer nombre'],
            ['typeDocument', 'Tipo de documento'],
            ['numberDocument', 'Número de documento'],
            ['phone', 'Teléfono'],
            ['address', 'Dirección'],
            ['sectorCategory', 'Categoría del sector'],
            ['supplierType', 'Tipo de proveedor'],
            ['city', 'Ciudad'],
          ].map(([name, label, type = 'text']) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rol en Empresa
            </label>
            {loadingRoles ? (
              <p className="text-sm text-gray-500">Cargando roles...</p>
            ) : (
              <select
                name="role"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {roles.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="col-span-full mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-md px-4 py-2 text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
