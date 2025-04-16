'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { IoClose } from 'react-icons/io5';
import { ActionIcon, Input, Title } from 'rizzui';

export default function ClientContractForm() {
  const { closeModal } = useModal();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      consecutive: '',
      typeContract: '',
      entity: '',
      zone: '',
      responsible: '',
      state: '',
      advance: '',
      locale: '',
      driverRoute: '',
      validatePassengers: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        driverRoute: data.driverRoute === 'Sí',
        validatePassengers: data.validatePassengers === 'Sí',
        dateRegister: new Date().toISOString().split('T')[0],
        dateStart: new Date().toISOString().split('T')[0],
        dateEnd: '2025-06-15', // O puedes usar un selector de fecha en el form si quieres
      };

      const res = await fetch('https://reyleonback.s.cloudesarrollosmoyan.com/api/client-contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session as any)?.jwt}`,
        },
        body: JSON.stringify({ data: formattedData }),
      });

      if (!res.ok) throw new Error('Error creando el contrato');

      const result = await res.json();
      console.log('Contrato creado:', result);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
      <ActionIcon
        size="sm"
        variant="text"
        onClick={() => closeModal()}
        className="absolute end-3 top-3 text-gray-500 hover:text-gray-900"
      >
        <IoClose className="h-5 w-5" />
      </ActionIcon>

      <Title as="h3" className="text-xl font-semibold text-center">
        Crear nuevo contrato
      </Title>

      <Input label="Consecutivo" {...register('consecutive')} />
      <Input label="Tipo de contrato" {...register('typeContract')} />
      <Input label="Entidad" {...register('entity')} />
      <Input label="Zona" {...register('zone')} />
      <Input label="Responsable" {...register('responsible')} />
      <Input label="Estado" {...register('state')} />
      <Input label="Avance" {...register('advance')} />
      <Input label="Local" {...register('locale')} />
      <Input label="¿Tiene ruta de conductor? (Sí/No)" {...register('driverRoute')} />
      <Input label="¿Validar pasajeros? (Sí/No)" {...register('validatePassengers')} />

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
      >
        Crear contrato
      </button>
    </form>
  );
}
