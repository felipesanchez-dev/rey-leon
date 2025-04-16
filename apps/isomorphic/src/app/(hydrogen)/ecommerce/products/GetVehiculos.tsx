'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Car, Gauge, Palette, Users, Wrench, Hash, Pencil } from 'lucide-react';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import Modal from 'react-modal';

interface Vehiculo {
  id: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
  mileage: string;
  [key: string]: any;
}

export default function GetVehiculos() {
  const { data: session } = useSession();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editVehiculo, setEditVehiculo] = useState<Vehiculo | null>(null);

  useEffect(() => {
    const fetchVehiculos = async () => {
      if (!(session as any)?.jwt) return;

      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/vehicles',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Error al cargar los vehículos');
        }

        const data = (await res.json()) as { data: Vehiculo[] };
        setVehiculos(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, [session]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      '¿Estás seguro de que quieres eliminar este vehículo?'
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/vehicles/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(
          errorData.message || 'No se pudo eliminar el vehículo.'
        );
      }

      setVehiculos((prevVehiculos) =>
        prevVehiculos.filter((vehiculo) => vehiculo.id !== id)
      );
      alert('Vehículo eliminado correctamente.');
    } catch (error: any) {
      alert(`Error al eliminar el vehículo: ${error.message}`);
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditVehiculo(vehiculo);
  };

  const handleSaveEdit = async () => {
    if (!editVehiculo) return;

    try {
      const response = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/vehicles/${editVehiculo.documentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
          body: JSON.stringify({ data: editVehiculo }),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(
          errorData.message || 'Error al actualizar el vehículo.'
        );
      }

      const updated = vehiculos.map((v) =>
        v.documentId === editVehiculo.documentId ? editVehiculo : v
      );
      setVehiculos(updated);
      alert('Vehículo actualizado exitosamente.');
      setEditVehiculo(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando vehículos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const pageHeader = {
    title: '',
    breadcrumb: [{ name: '' }, { name: '' }],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link
            href={routes.eCommerce.createProduct}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Crear Nuevo Vehículo
            </Button>
          </Link>
        </div>
      </PageHeader>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vehiculos.map((vehiculo) => (
          <div
            key={vehiculo.id}
            className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <img
              src={`https://source.unsplash.com/600x400/?car,${vehiculo.brand},${vehiculo.model}`}
              alt={`${vehiculo.brand} ${vehiculo.model}`}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="mb-1 text-2xl font-semibold text-gray-800">
                {vehiculo.brand} {vehiculo.model}
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                Placa: <span className="font-medium">{vehiculo.plate}</span>
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                <Info
                  label="Línea"
                  value={vehiculo.line}
                  icon={<Car size={16} />}
                />
                <Info
                  label="Color"
                  value={vehiculo.color}
                  icon={<Palette size={16} />}
                />
                <Info
                  label="Cilindraje"
                  value={`${vehiculo.cylinderCapacity} cc`}
                  icon={<Gauge size={16} />}
                />
                <Info
                  label="Motor"
                  value={vehiculo.engineType}
                  icon={<Wrench size={16} />}
                />
                <Info
                  label="Pasajeros"
                  value={vehiculo.passengers}
                  icon={<Users size={16} />}
                />
                <Info label="Servicio" value={vehiculo.service} />
                <Info label="Clase" value={vehiculo.vehicleClass} />
                <Info
                  label="Motor #"
                  value={vehiculo.numberEngine}
                  icon={<Hash size={16} />}
                />
                <Info
                  label="Chasis #"
                  value={vehiculo.chassisNumber}
                  icon={<Hash size={16} />}
                />
                <Info
                  label="Interno #"
                  value={vehiculo.internalNumber}
                  icon={<Hash size={16} />}
                />
                <Info
                  label="Kilometraje"
                  value={`${vehiculo.mileage} km`}
                  icon={<Gauge size={16} />}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleEdit(vehiculo)}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  <Pencil className="mr-1" size={16} />Datos basicos
                </Button>
                <Button
                  onClick={() => handleDelete(vehiculo.id)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!editVehiculo}
        onRequestClose={() => setEditVehiculo(null)}
        contentLabel="Editar Vehículo"
        ariaHideApp={false}
        className="mx-auto mt-20 max-w-2xl rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 className="mb-4 text-xl font-bold">Editar Vehículo</h2>
        {editVehiculo && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                value={editVehiculo.brand ?? ''}
                onChange={(e) =>
                  setEditVehiculo({ ...editVehiculo, brand: e.target.value })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Modelo
              </label>
              <input
                type="text"
                value={editVehiculo.model ?? ''}
                onChange={(e) =>
                  setEditVehiculo({ ...editVehiculo, model: e.target.value })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Placa</label>
              <input
                type="text"
                value={editVehiculo.plate ?? ''}
                onChange={(e) =>
                  setEditVehiculo({ ...editVehiculo, plate: e.target.value })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Color</label>
              <input
                type="text"
                value={editVehiculo.color ?? ''}
                onChange={(e) =>
                  setEditVehiculo({ ...editVehiculo, color: e.target.value })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Cilindraje
              </label>
              <input
                type="text"
                value={editVehiculo.cylinderCapacity ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    cylinderCapacity: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Tipo de Motor
              </label>
              <input
                type="text"
                value={editVehiculo.engineType ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    engineType: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Pasajeros
              </label>
              <input
                type="number"
                value={editVehiculo.passengers ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    passengers: parseInt(e.target.value),
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Clase</label>
              <input
                type="text"
                value={editVehiculo.vehicleClass ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    vehicleClass: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Servicio
              </label>
              <input
                type="text"
                value={editVehiculo.service ?? ''}
                onChange={(e) =>
                  setEditVehiculo({ ...editVehiculo, service: e.target.value })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Número de Motor
              </label>
              <input
                type="text"
                value={editVehiculo.numberEngine ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    numberEngine: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Número de Chasis
              </label>
              <input
                type="text"
                value={editVehiculo.chassisNumber ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    chassisNumber: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Número Interno
              </label>
              <input
                type="text"
                value={editVehiculo.internalNumber ?? ''}
                onChange={(e) =>
                  setEditVehiculo({
                    ...editVehiculo,
                    internalNumber: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
            <div className="col-span-full flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Kilometraje
              </label>
              <input
                type="text"
                value={editVehiculo.mileage ?? ''}
                onChange={(e) =>
                  setEditVehiculo({ ...editVehiculo, mileage: e.target.value })
                }
                className="rounded border p-2"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => setEditVehiculo(null)} className="bg-gray-300">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} className="bg-blue-600 text-white">
            Guardar
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon && <div className="text-blue-500">{icon}</div>}
      <div>
        <span className="font-medium">{label}:</span> {value}
      </div>
    </div>
  );
}
