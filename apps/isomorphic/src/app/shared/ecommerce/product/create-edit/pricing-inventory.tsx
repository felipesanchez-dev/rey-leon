'use client';

import { useState } from 'react';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';

interface FileData {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: string;
  related: { id: number; documentId: string }[];
  folder: { id: number; documentId: string };
}

interface SoatData {
  codeSoat: string;
  insuranceCompany: string;
  expirationDateSoat: string;
  fileSoat: FileData;
}

interface PricingInventoryProps {
  className?: string;
  onNext?: (data: any) => void;
  previousData: any; // Datos del vehículo desde el paso anterior
}

export default function PricingInventory({ className, onNext, previousData }: PricingInventoryProps) {
  const [soat, setSoat] = useState<SoatData>({
    codeSoat: '',
    insuranceCompany: '',
    expirationDateSoat: '',
    fileSoat: {
      id: 0,
      documentId: '',
      name: '',
      alternativeText: '',
      caption: '',
      width: 0,
      height: 0,
      formats: '',
      hash: '',
      ext: '',
      mime: '',
      size: 0,
      url: '',
      previewUrl: '',
      provider: '',
      provider_metadata: '',
      related: [{ id: 0, documentId: '' }],
      folder: { id: 0, documentId: '' },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSoat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const fullData = {
      ...previousData,
      soat: soat,
    };

    if (onNext) {
      onNext(fullData);
    } else {
      console.log('Datos completos:', fullData);
    }
  };

  return (
    <FormGroup
      title="Información del SOAT"
      description="Completa los datos del seguro obligatorio para el vehículo."
      className={cn(className)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Código SOAT</label>
          <input
            type="text"
            name="codeSoat"
            placeholder="Código del SOAT"
            onChange={handleChange}
            value={soat.codeSoat}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Aseguradora</label>
          <input
            type="text"
            name="insuranceCompany"
            placeholder="Compañía de seguros"
            onChange={handleChange}
            value={soat.insuranceCompany}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de vencimiento</label>
          <input
            type="date"
            name="expirationDateSoat"
            onChange={handleChange}
            value={soat.expirationDateSoat}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          />
        </div>

        {/* <input type="file" onChange={...} /> */}
      </div>

      {/* <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Guardar y continuar
      </button> */}
    </FormGroup>
  );
}
