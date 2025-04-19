'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserCreateModalProps {
  onClose: () => void;
}

declare module 'next-auth' {
  interface Session {
    jwt?: string;
  }
}

export default function UserCreateModal({ onClose }: UserCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    firstName: '',
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
        toast.error('No se pudieron cargar los roles.');
      } finally {
        setLoadingRoles(false);
      }
    };

    if (session?.jwt) fetchRoles();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.role || isNaN(Number(formData.role))) {
        toast.error('Por favor, selecciona un rol válido.');
        setLoading(false);
        return;
      }

      if (!session || !(session as any).jwt) {
        toast.error('No estás autenticado. Por favor, inicia sesión.');
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
        throw new Error(
          (result as { message?: string })?.message || 'Error al crear usuario'
        );
      }

      toast.success('Usuario creado con éxito');
      onClose();
      router.refresh(); // Recarga los datos sin recargar toda la página
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error al crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (status === 'loading') return <p>Cargando sesión...</p>;
  if (!session) return <p>No estás autenticado. Por favor, inicia sesión.</p>;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {[
              ['username', 'Nombre de usuario'],
              ['email', 'Correo electrónico'],
              ['password', 'Contraseña', 'password'],
              ['name', 'Nombre completo'],
              ['firstName', 'Primer nombre'],
            ].map(([name, label, type = 'text']) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm"
                />
              </div>
            ))}
          </>
        );
      case 2:
        return (
          <>
            {[
              ['typeDocument', 'Tipo de documento'],
              ['numberDocument', 'Número de documento'],
              ['phone', 'Teléfono'],
              ['address', 'Dirección'],
              ['city', 'Ciudad'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm"
                />
              </div>
            ))}
          </>
        );
      case 3:
        return (
          <>
            {[
              ['sectorCategory', 'Categoría del sector'],
              ['supplierType', 'Tipo de proveedor'],
              ['positionJob', 'Rol en empresa'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm"
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={modalRef}
        className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Crear nuevo usuario</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {renderStep()}
          <div className="col-span-full mt-4 flex justify-between gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-md border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Anterior
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`rounded-md px-4 py-2 text-white ${
                  loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
