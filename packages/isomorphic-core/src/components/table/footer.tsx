"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    jwt?: string;
  }
}
import { Button, Text } from "rizzui";
import { Table as ReactTableType } from "@tanstack/react-table";

interface TableToolbarProps<TData extends Record<string, any>> {
  table: ReactTableType<TData>;
  showDownloadButton?: boolean;
  onExport?: () => void;
}

export default function TableFooter<TData extends Record<string, any>>({
  table,
  showDownloadButton = true,
  onExport,
}: TableToolbarProps<TData>) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [data, setData] = useState<TData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setUserData(null);
  };

  const handleEdit = () => {
    const selected = table.getSelectedRowModel().rows[0]?.original;
    if (selected) {
      setUserData(selected);
      fetchRoles();
      setIsModalOpen(true);
    }
  };
  const handleVer = () => {
    const selected = table.getSelectedRowModel().rows[0]?.original; 
    if (selected) {
      setUserData(selected); 
      setIsModalOpen(true); 
    } else {
      setToast({
        message: "Por favor selecciona un usuario para ver",
        type: "error",
      });
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await fetch(
        "https://reyleonback.s.cloudesarrollosmoyan.com/api/users-permissions/roles",
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error al cargar roles");
      const data = await res.json();
      setRoles(Array.isArray(data.roles) ? data.roles : []);
    } catch (error) {
      console.error("Error cargando roles:", error);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [session]);

  const checkedItems = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const meta = table.options.meta;

  if (checkedItems.length === 0) return null;
  const handleDelete = async (ids: string[]) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar ${ids.length > 1 ? "estos usuarios" : "este usuario"}?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      for (const id of ids) {
        const response = await fetch(
          `https://reyleonback.s.cloudesarrollosmoyan.com/api/users/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`Error al eliminar el usuario con ID: ${id}`);
      }

      setToast({
        message: `${ids.length > 1 ? "Usuarios eliminados" : "Usuario eliminado"} correctamente`,
        type: "success",
      });

      setData((prevData) => prevData.filter((user) => !ids.includes(user.id)));

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al eliminar los usuarios", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sticky bottom-0 left-0 z-10 mt-2.5 flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-0 px-5 py-3.5 text-gray-900 shadow-sm dark:border-gray-300 dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
        <div>
          <Text as="strong">{checkedItems.length}</Text>
          {checkedItems.length >= 1
            ? " Usuarios"
            : " Usuario"} seleccionado{" "}
          <Button
            size="sm"
            variant="text"
            className="underline"
            color="danger"
            onClick={() => handleDelete(checkedItems.map((item) => item.id))}>
            Eliminar Usuario
          </Button>
          <Button
            size="sm"
            variant="text"
            className="underline"
            color="danger"
            onClick={handleVer}>
            Ver Usuario
          </Button>
        </div>
        {showDownloadButton && (
          <Button
            size="sm"
            onClick={handleEdit}
            className="dark:bg-gray-300 dark:text-gray-800">
            Editar Usuario
          </Button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              aria-label="Cerrar">
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
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${(session as any)?.jwt}`,
                      },
                      body: JSON.stringify(userData),
                    }
                  );

                  if (!response.ok)
                    throw new Error("Error al actualizar usuario");

                  alert("Usuario actualizado correctamente");
                  closeModal();
                } catch (err) {
                  console.error(err);
                  alert("Error al actualizar usuario");
                } finally {
                  setLoading(false);
                }
              }}>
              <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">
                Editar Usuario
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["username", "Usuario"],
                  ["firsName", "Primer Nombre"],
                  ["name", "Nombre Completo"],
                  ["typeDocument", "Tipo de Documento"],
                  ["numberDocument", "Número de Documento"],
                  ["email", "Correo"],
                  ["address", "Dirección"],
                  ["city", "Ciudad"],
                  ["supplierType", "Tipo de Empresa"],
                  ["phone", "Teléfono"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      value={userData?.[key] ?? ""}
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
                      value={userData?.positionJob ?? ""}
                      onChange={(e) =>
                        setUserData((prev: any) => ({
                          ...prev,
                          positionJob: e.target.value,
                        }))
                      }
                      required>
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
                    value={userData?.blocked ?? ""}
                    onChange={(e) =>
                      setUserData((prev: any) => ({
                        ...prev,
                        blocked: e.target.value,
                      }))
                    }
                    required>
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
                  className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              aria-label="Cerrar">
              ✕
            </button>

            {loading ? (
              <div className="text-center text-lg font-medium">Cargando...</div>
            ) : (
              <div>
                <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">
                  Detalles del Usuario
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-lg border text-left text-sm text-gray-600 shadow">
                    <tbody>
                      {[
                        ["ID de Usuario", userData.id],
                        ["Nombre de Usuario", userData.username],
                        ["Primer Nombre", userData.firsName],
                        ["Nombre Completo", userData.name],
                        ["Tipo Identificación", userData.typeDocument],
                        ["Número Identificación", userData.numberDocument],
                        ["Correo Electrónico", userData.email],
                        ["Dirección", userData.address],
                        ["Ciudad", userData.city],
                        ["Tipo de empresa", userData.supplierType],
                        ["Rol en la Empresa", userData.positionJob],
                        ["Estado", userData.blocked ? "Inactivo" : "Activo"],
                      ].map(([label, value], i) => (
                        <tr
                          key={label}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
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
                    className="rounded-md bg-gray-700 px-6 py-2 text-white transition duration-200 hover:bg-gray-600">
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-md px-4 py-2 shadow-lg ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
