'use client';

import React, { useState } from 'react';
import { Text, Button, Modal } from 'rizzui';
import { createColumnHelper } from '@tanstack/react-table';
import AvatarCard from '@core/ui/avatar-card';
import { GrView } from 'react-icons/gr';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';

export interface AllJobsTableDataType {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  EPS?: string;
  typeDocument?: string;
  numberDocument?: string;
  regime?: string;
  affiliation?: string;
  phone?: string;
  city?: string;
  documentId?: string;
}

const DEFAULT_TEXTS = {
  noName: 'Sin Nombre',
  noAvatar: 'https://via.placeholder.com/150',
  noEmail: 'Sin EPS Asignada',
  noEPS: 'Sin EPS',
  noTypeDocument: 'Sin Tipo',
  noNumberDocument: 'Sin Número',
  noRegime: 'Sin Régimen',
  noAffiliation: 'Sin Afiliación',
  noPhone: 'Sin Teléfono',
  noCity: 'Sin Ciudad',
};

const columnHelper = createColumnHelper<AllJobsTableDataType>();

export const useAllJobsColumns = () => {
  return [
    columnHelper.display({
      id: 'ID',
      size: 40,
      header: 'ID',
      cell: ({ row }) => <Text>{row.original.id}</Text>,
    }),
    columnHelper.accessor('name', {
      id: 'name',
      size: 270,
      header: 'Paciente',
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <AvatarCard
          name={original.name || DEFAULT_TEXTS.noName}
          src={original.avatar || DEFAULT_TEXTS.noAvatar}
          description={original.email || DEFAULT_TEXTS.noEmail}
        />
      ),
    }),
    columnHelper.display({
      id: 'candidates',
      size: 120,
      header: 'EPS',
      cell: ({ row }) => <Text>{row.original.EPS || DEFAULT_TEXTS.noEPS}</Text>,
    }),
    columnHelper.display({
      id: 'typeDocument',
      size: 100,
      header: 'Tipo de Documento',
      cell: ({ row }) => (
        <Text>{row.original.typeDocument || DEFAULT_TEXTS.noTypeDocument}</Text>
      ),
    }),
    columnHelper.display({
      id: 'hired',
      size: 80,
      header: 'Número de Documento',
      cell: ({ row }) => (
        <Text>
          {row.original.numberDocument || DEFAULT_TEXTS.noNumberDocument}
        </Text>
      ),
    }),
    columnHelper.display({
      id: 'regime',
      size: 100,
      header: 'Régimen',
      cell: ({ row }) => (
        <Text>{row.original.regime || DEFAULT_TEXTS.noRegime}</Text>
      ),
    }),
    columnHelper.display({
      id: 'affiliation',
      size: 100,
      header: 'Tipo de Afiliación',
      cell: ({ row }) => (
        <Text>{row.original.affiliation || DEFAULT_TEXTS.noAffiliation}</Text>
      ),
    }),
    columnHelper.display({
      id: 'phone',
      size: 100,
      header: 'Teléfono',
      cell: ({ row }) => (
        <Text>{row.original.phone || DEFAULT_TEXTS.noPhone}</Text>
      ),
    }),
    columnHelper.display({
      id: 'city',
      size: 100,
      header: 'Ciudad de Residencia',
      cell: ({ row }) => (
        <Text>{row.original.city || DEFAULT_TEXTS.noCity}</Text>
      ),
    }),
  ];
};

export default useAllJobsColumns;
