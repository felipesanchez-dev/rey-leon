'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';

interface ProductIdentifiersProps {
  className?: string;
}

interface FormValues {
  technicalMechanicalReview: {
    codeRTM: string;
    RTMInsuranceCompany: string;
    expirationDateRTM: string;
    fileTechnicalMechanicalReview?: File; // Si deseas permitir archivos
  };
}

export default function ProductIdentifiers({ className }: ProductIdentifiersProps) {
  const { register, formState: { errors } } = useFormContext<FormValues>();

  const onSubmit = (data: FormValues): void => {
    console.log('Datos completos:', data);
    // Aquí puedes hacer la petición a la API o lo que necesites
  };

  return (
    <FormGroup
      title="Revisión Técnico Mecánica"
      description="Completa los datos de la revisión técnico mecánica del vehículo."
      className={cn(className)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Código RTM</label>
          <Input
            type="text"
            {...register('technicalMechanicalReview.codeRTM', { required: 'Este campo es obligatorio' })}
            placeholder="Código RTM"
            error={(errors?.technicalMechanicalReview as any)?.codeRTM?.message as string}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Aseguradora</label>
          <Input
            type="text"
            {...register('technicalMechanicalReview.RTMInsuranceCompany', { required: 'Este campo es obligatorio' })}
            placeholder="Nombre de la aseguradora"
            error={(errors?.technicalMechanicalReview as any)?.RTMInsuranceCompany?.message}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de vencimiento</label>
          <Input
            type="date"
            {...register('technicalMechanicalReview.expirationDateRTM', { required: 'Este campo es obligatorio' })}
            error={(errors?.technicalMechanicalReview as any)?.expirationDateRTM?.message as string}
          />
        </div>

        {/* <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Subir archivo RTM</label>
          <Input
            type="file"
            {...register('technicalMechanicalReview.fileTechnicalMechanicalReview')}
          />
        </div> */}
      </div>
    </FormGroup>
  );
}
