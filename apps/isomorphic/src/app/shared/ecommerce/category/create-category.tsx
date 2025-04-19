'use client';

import { useState, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input, Select, Title, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { Controller, useForm } from 'react-hook-form';

const priorityOptions = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' },
];

const providers = [
  { value: 'TOYOTA', label: 'TOYOTA' },
  { value: 'FERRARI', label: 'FERRARI' },
  { value: 'RENAULT', label: 'RENAULT' },
];

const incidenceFormSchema = z.object({
  descriptionFailure: z
    .string()
    .nonempty('La descripción de la falla es obligatoria'),
  dateReport: z.string().nonempty('La fecha del reporte es obligatoria'),
  priority: z.enum(['Baja', 'Media', 'Alta'], {
    required_error: 'La prioridad es obligatoria',
  }),
  providerMechanical: z.enum(['TOYOTA', 'FERRARI', 'RENAULT'], {
    required_error: 'El proveedor mecánico es obligatorio',
  }),
  state: z.boolean().optional(),
});

export default function EditIncidenceForm({ incidence }: { incidence?: any }) {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: incidence || {},
  });

  useEffect(() => {
    if (incidence) {
      setValue('descriptionFailure', incidence.descriptionFailure);
      setValue('dateReport', incidence.dateReport);
      setValue('priority', incidence.priority);
      setValue('providerMechanical', incidence.providerMechanical);
      setValue('state', incidence.state);
    }
  }, [incidence, setValue]);

  const onSubmit = (data: {
    descriptionFailure: string;
    dateReport: string;
    priority: 'Baja' | 'Media' | 'Alta';
    providerMechanical: 'TOYOTA' | 'FERRARI' | 'RENAULT';
    state?: boolean;
  }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Form data:', data);
    }, 600);
  };

  return (
    <Form
      validationSchema={incidenceFormSchema}
      onSubmit={handleSubmit(onSubmit)}
      className="isomorphic-form flex flex-col gap-6"
    >
      {() => (
        <>
          <div>
            <Title as="h4" className="mb-2 font-semibold">
              Incidencia
            </Title>
            <Text className="mb-4 text-sm text-gray-500">
              datos requeridos de la incidencia.
            </Text>

            <Input
              label="Descripción de la falla"
              placeholder="Ej: Se quedó sin bomba de gasolina"
              {...register('descriptionFailure')}
              error={
                typeof errors.descriptionFailure?.message === 'string'
                  ? errors.descriptionFailure.message
                  : undefined
              }
            />

            <Input
              label="Fecha del reporte"
              type="date"
              {...register('dateReport')}
              error={
                typeof errors.descriptionFailure?.message === 'string'
                  ? errors.descriptionFailure.message
                  : undefined
              }
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  label="Prioridad"
                  options={priorityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={
                    typeof errors.descriptionFailure?.message === 'string'
                      ? errors.descriptionFailure.message
                      : undefined
                  }
                  getOptionValue={(option) => option.label}
                />
              )}
            />

            <Controller
              name="providerMechanical"
              control={control}
              render={({ field }) => (
                <Select
                  label="Proveedor Mecánico"
                  options={providers}
                  value={field.value}
                  onChange={field.onChange}
                  error={
                    typeof errors.descriptionFailure?.message === 'string'
                      ? errors.descriptionFailure.message
                      : undefined
                  }
                  getOptionValue={(option) => option.label}
                />
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  label="Estado"
                  options={[
                    { value: 'true', label: 'Completado' },
                    { value: 'false', label: 'Pendiente' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={
                    typeof errors.descriptionFailure?.message === 'string'
                      ? errors.descriptionFailure.message
                      : undefined
                  }
                  getOptionValue={(option) => option.label}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancelar</Button>
            <Button type="submit" isLoading={isLoading}>
              Guardar Cambios
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
