'use client';
import { useState, useMemo, useEffect } from 'react';
import { UsersTableDataType } from './index';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface BasicUsersTableProps {
  data: UsersTableDataType[];
}

const BasicUsersTable: React.FC<BasicUsersTableProps> = ({ data }) => {
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const { data: session } = useSession();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((usuario) =>
      (usuario.fullName || '').toLowerCase().includes(filterName.toLowerCase())
    );
  }, [data, filterName]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            currentPage === i
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-indigo-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };
  useEffect(() => {
    const fetchRoles = async () => {
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
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setUserData(null);
    setEditMode(false);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleVer = async (id: string, action: 'view') => {
    console.log(
      `${action} Test de api cuando se de click al botón de ver usuario{ID}`,
      id
    );
    if (action === 'view') {
      setLoading(true);
      try {
        const response = await fetch(
          `https://reyleonback.s.cloudesarrollosmoyan.com/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        setUserData(data);
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (id: string, action: 'edit') => {
    setEditMode(true);
    setLoading(true);
    try {
      const response = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
        }
      );
      if (!response.ok) throw new Error('Error al obtener datos');

      const data = await response.json();
      setUserData(data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, action: 'delete') => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al eliminar el usuario');

      setToast({
        message: 'Usuario eliminado correctamente',
        type: 'success',
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Error al eliminar el usuario', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre..."
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="ml-auto min-w-[160px] rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={15}>15 por página</option>
          <option value={30}>30 por página</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-sm font-semibold uppercase tracking-wider text-indigo-800">
              <th className="rounded-tl-xl px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Avatar</th>
              <th className="px-6 py-4 text-left">Nombre completo</th>
              <th className="px-6 py-4 text-left">Correo electrónico</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Registro</th>
              <th className="rounded-tr-xl px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="transition duration-200 ease-in-out hover:bg-indigo-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {usuario.id}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={usuario.avatar}
                      alt={usuario.fullName}
                      className="h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-indigo-300"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {usuario.fullName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                      {usuario.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>

                  <td className="flex gap-2 px-6 py-4">
                    <button
                      onClick={() => handleVer(String(usuario.id), 'view')}
                      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(String(usuario.id), 'edit')}
                      className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-500"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(String(usuario.id), 'delete')}
                      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm italic text-gray-500"
                >
                  No hay usuarios registrados que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!editMode && showModal && userData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="animate-fade-in relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <div className="text-center text-lg font-medium">Cargando...</div>
            ) : (
              <div>
                <h3 className="mb-6 border-b pb-2 text-center text-2xl font-bold text-gray-800">
                  Detalles del Usuario
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-lg border text-left text-sm text-gray-600 shadow">
                    <tbody>
                      {[
                        ['ID de Usuario', userData.id],
                        ['Nombre de Usuario', userData.username],
                        ['Primer Nombre', userData.firsName],
                        ['Nombre Completo', userData.name],
                        ['Tipo Identificación', userData.typeDocument],
                        ['Número Identificación', userData.numberDocument],
                        ['Correo Electrónico', userData.email],
                        ['Dirección', userData.address],
                        ['Ciudad', userData.city],
                        ['Tipo de empresa', userData.supplierType],
                        ['Rol en la Empresa', userData.positionJob],
                        ['Estado', userData.blocked ? 'Inactivo' : 'Activo'],
                      ].map(([label, value], i) => (
                        <tr
                          key={label}
                          className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                        >
                          <td className="whitespace-nowrap border-b px-6 py-4 font-semibold text-gray-700">
                            {label}:
                          </td>
                          <td className="border-b px-6 py-4 text-gray-900">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="rounded-md bg-gray-700 px-6 py-2 text-white transition duration-200 hover:bg-gray-600"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {editMode && userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const response = await fetch(
                    `https://reyleonback.s.cloudesarrollosmoyan.com/api/users/${userData.id}`,
                    {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${(session as any)?.jwt}`,
                      },
                      body: JSON.stringify(userData),
                    }
                  );

                  if (!response.ok)
                    throw new Error('Error al actualizar usuario');

                  alert('Usuario actualizado correctamente');
                  closeModal();
                } catch (err) {
                  console.error(err);
                  alert('Error al actualizar usuario');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">
                Editar Usuario
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ['username', 'Usuario'],
                  ['firsName', 'Primer Nombre'],
                  ['name', 'Nombre Completo'],
                  ['typeDocument', 'Tipo de Documento'],
                  ['numberDocument', 'Número de Documento'],
                  ['email', 'Correo'],
                  ['address', 'Dirección'],
                  ['city', 'Ciudad'],
                  ['supplierType', 'Tipo de Empresa'],
                  ['phone', 'Teléfono'],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      value={userData?.[key] ?? ''}
                      onChange={(e) =>
                        setUserData((prev: any) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                ))}

                {/* Campo Especial: Rol en Empresa */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Rol en Empresa
                  </label>
                  {loadingRoles ? (
                    <p className="text-sm text-gray-500">Cargando roles...</p>
                  ) : (
                    <select
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                      value={userData?.positionJob ?? ''}
                      onChange={(e) =>
                        setUserData((prev: any) => ({
                          ...prev,
                          positionJob: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" disabled>
                        Selecciona un rol
                      </option>
                      {roles.map((role: any) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Campo Especial: Estado */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                    value={userData?.blocked ?? ''}
                    onChange={(e) =>
                      setUserData((prev: any) => ({
                        ...prev,
                        blocked: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Selecciona un estado
                    </option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`fixed left-1/2 top-6 z-[9999] -translate-x-1/2 transform rounded-lg px-6 py-4 text-white shadow-lg transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Paginacion */}
      <div className="mt-4 flex justify-center gap-2">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default BasicUsersTable;
