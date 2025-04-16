import { useFormContext } from 'react-hook-form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';

interface ProductMediaProps {
  className?: string;
}

export default function ProductMedia({ className }: ProductMediaProps) {
  const { getValues, setValue } = useFormContext();

  return (
    <FormGroup
      title="Foto del vehiculo"
      description="Cargue aqui foto del vehiculo"
      className={cn(className)}
    >
      <UploadZone
        className="col-span-full"
        name="productImages"
        getValues={getValues}
        setValue={setValue}
      />
    </FormGroup>
  );
}
