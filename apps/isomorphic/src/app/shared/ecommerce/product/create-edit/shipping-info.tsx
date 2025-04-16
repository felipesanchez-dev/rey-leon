'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';

interface ShippingInfoProps {
  className?: string;
}

interface FormValues {
  PreventiveReview: {
    codeRP: string;
    insuranceRP: string;
    expirationDateRP: string;
    fileRP?: File;
  };
}

export default function ShippingInfo({ className }: ShippingInfoProps) {
  const { register, formState: { errors } } = useFormContext<FormValues>();

  return (
    <FormGroup
      title="Revisión Preventiva"
      description="Ingresa los datos correspondientes a la revisión preventiva del vehículo."
      className={cn(className)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Código RP</label>
          <Input
            type="text"
            {...register('PreventiveReview.codeRP', { required: 'Este campo es obligatorio' })}
            placeholder="Código RP"
            error={(errors?.PreventiveReview as any)?.codeRP?.message}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Aseguradora</label>
          <Input
            type="text"
            {...register('PreventiveReview.insuranceRP', { required: 'Este campo es obligatorio' })}
            placeholder="Nombre de la aseguradora"
            error={(errors?.PreventiveReview as any)?.insuranceRP?.message}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de vencimiento</label>
          <Input
            type="date"
            {...register('PreventiveReview.expirationDateRP', { required: 'Este campo es obligatorio' })}
            error={(errors?.PreventiveReview as any)?.expirationDateRP?.message}
          />
        </div>

        {/* <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Subir archivo RP</label>
          <Input
            type="file"
            {...register('PreventiveReview.fileRP')}
          />
        </div> */}
      </div>
    </FormGroup>
  );
}
