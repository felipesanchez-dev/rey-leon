'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';

interface User {
  id: number;
  name: string;
  positionJob?: string;
}

interface VehicleData {
  plate: string;
  mileage: number;
  brand: string;
  line: string;
  model: number;
  cylinderCapacity: number;
  color: string;
  service: string;
  vehicleClass: string;
  bodyType: string;
  engineType: string;
  passengers: number;
  numberEngine: string;
  chassisNumber: string;
  internalNumber: string;
  dateMileage: string;
  state: boolean;
  user: string;
}

export default function ProductSummary({
  className,
  onNext,
}: {
  className?: string;
  onNext?: (data: VehicleData) => void;
}) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  const [formData, setFormData] = useState<VehicleData>({
    plate: '',
    mileage: 0,
    brand: '',
    line: '',
    model: new Date().getFullYear(),
    cylinderCapacity: 0,
    color: '',
    service: '',
    vehicleClass: '',
    bodyType: '',
    engineType: '',
    passengers: 0,
    numberEngine: '',
    chassisNumber: '',
    internalNumber: '',
    dateMileage: new Date().toISOString().split('T')[0],
    state: true,
    user: '',
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      if (!(session as any)?.jwt) return;

      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/users',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error('Error al obtener usuarios');

        const data = await res.json();

        const filteredUsers = Array.isArray(data)
          ? (data as User[]).filter(
              (user) => user.positionJob?.toLowerCase() === 'conductor'
            )
          : [];

        setUsers(filteredUsers);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.log('Petición cancelada');
        } else {
          console.error('Error al cargar usuarios:', err);
        }
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
    return () => {
      controller.abort();
    };
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'mileage' ||
        name === 'model' ||
        name === 'cylinderCapacity' ||
        name === 'passengers'
          ? Number(value)
          : value,
    }));
  };

  const handleNextSection = () => {
    if (onNext) {
      onNext(formData);
    } else {
      console.log('Datos preparados:', formData);
    }
  };

  const renderInput = (
    label: string,
    name: keyof VehicleData,
    type: string = 'text'
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={formData[name] as string | number}
        onChange={handleChange}
        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        required
      />
    </div>
  );

  return (
    <FormGroup
      title="Crear Nuevo Vehículo"
      description="Ingresa la información correspondiente para registrar un nuevo vehículo en el sistema."
      className={cn(className)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {renderInput('Placa', 'plate')}
        {renderInput('Kilometraje', 'mileage', 'number')}
        {renderInput('Marca', 'brand')}
        {renderInput('Línea', 'line')}
        {renderInput('Modelo', 'model', 'number')}
        {renderInput('Cilindraje', 'cylinderCapacity', 'number')}
        {renderInput('Color', 'color')}
        {renderInput('Servicio', 'service')}
        {renderInput('Clase Vehículo', 'vehicleClass')}
        {renderInput('Carrocería', 'bodyType')}
        {renderInput('Tipo de Motor', 'engineType')}
        {renderInput('Pasajeros', 'passengers', 'number')}
        {renderInput('Número de Motor', 'numberEngine')}
        {renderInput('Número de Chasis', 'chassisNumber')}
        {renderInput('Número Interno', 'internalNumber')}
        <div className="flex flex-col gap-1">
          <label htmlFor="dateMileage" className="text-sm font-medium text-gray-700">
            Fecha de Kilometraje
          </label>
          <input
            type="date"
            name="dateMileage"
            id="dateMileage"
            value={formData.dateMileage}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Select de conductor */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="user" className="text-sm font-medium text-gray-700">
            Conductor
          </label>
          {loadingUsers ? (
            <p className="text-sm text-gray-500">Cargando usuarios...</p>
          ) : (
            <select
              name="user"
              id="user"
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
              value={formData.user}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecciona un conductor
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id.toString()}>
                  {user.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* <button
        type="button"
        onClick={handleNextSection}
        className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors md:w-auto"
      >
        Continuar
      </button> */}
    </FormGroup>
  );
}
