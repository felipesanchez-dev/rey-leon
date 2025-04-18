'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { IoClose } from 'react-icons/io5';
import { ActionIcon, Input, Title } from 'rizzui';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientContractForm() {
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);

  const methods = useForm({
    mode: 'onTouched',
    defaultValues: {
      consecutive: '',
      typeContract: '',
      entity: '',
      zone: '',
      responsible: '',
      state: '',
      advance: '',
      driverRoute: '',
      validatePassengers: '',
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        driverRoute: data.driverRoute === 'Sí',
        validatePassengers: data.validatePassengers === 'Sí',
        dateRegister: new Date().toISOString().split('T')[0],
        dateStart: new Date().toISOString().split('T')[0],
        dateEnd: new Date().toISOString().split('T')[0],
        locale: 'string',
      };

      console.log('📝 Datos enviados al backend:', formattedData);

      const res = await fetch(
        'https://reyleonback.s.cloudesarrollosmoyan.com/api/client-contracts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
          body: JSON.stringify({ data: formattedData }),
        }
      );

      console.log('📬 Código de respuesta:', res.status);
      const resJson = await res.json();
      console.log('📩 Respuesta del backend:', resJson);

      if (!res.ok) throw new Error('Error creando el contrato');

      toast.success('✅ Contrato creado exitosamente');
      closeModal();
    } catch (err) {
      console.error('❌ Error en onSubmit:', err);
      toast.error('❌ Ocurrió un error al crear el contrato');
    }
  };

  const fieldsByStep: Record<
    number,
    Array<
      | 'consecutive'
      | 'typeContract'
      | 'entity'
      | 'zone'
      | 'responsible'
      | 'state'
      | 'advance'
      | 'driverRoute'
      | 'validatePassengers'
    >
  > = {
    0: ['consecutive', 'typeContract', 'entity', 'zone'],
    1: ['responsible', 'state', 'advance'],
    2: ['driverRoute', 'validatePassengers'],
  };

  const nextStep = async () => {
    const currentFields = fieldsByStep[step];
    const isValid = await trigger(currentFields);
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-auto max-w-xl space-y-6 px-6 py-4"
      >
        <Toaster position="top-right" reverseOrder={false} />

        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="absolute end-3 top-3 text-gray-500 hover:text-gray-900"
        >
          <IoClose className="h-5 w-5" />
        </ActionIcon>

        <Title as="h3" className="text-center text-xl font-semibold">
          Crear nuevo contrato
        </Title>

        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="Consecutivo"
              {...register('consecutive', {
                required: 'Este campo es obligatorio',
              })}
              error={errors.consecutive?.message}
            />
            <Input
              label="Tipo de contrato"
              {...register('typeContract', {
                required: 'Este campo es obligatorio',
              })}
              error={errors.typeContract?.message}
            />
            <Input
              label="Entidad"
              {...register('entity', { required: 'Este campo es obligatorio' })}
              error={errors.entity?.message}
            />
            <Input
              label="Zona"
              {...register('zone', { required: 'Este campo es obligatorio' })}
              error={errors.zone?.message}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Responsable"
              {...register('responsible', {
                required: 'Este campo es obligatorio',
              })}
              error={errors.responsible?.message}
            />
            <Input
              label="Estado"
              {...register('state', { required: 'Este campo es obligatorio' })}
              error={errors.state?.message}
            />
            <Input
              label="Avance"
              {...register('advance', {
                required: 'Este campo es obligatorio',
              })}
              error={errors.advance?.message}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="¿Tiene ruta de conductor? (Sí/No)"
              {...register('driverRoute', {
                required: 'Este campo es obligatorio',
              })}
              error={errors.driverRoute?.message}
            />
            <Input
              label="¿Validar pasajeros? (Sí/No)"
              {...register('validatePassengers', {
                required: 'Este campo es obligatorio',
              })}
              error={errors.validatePassengers?.message}
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
            >
              Atrás
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
            >
              Crear contrato
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
