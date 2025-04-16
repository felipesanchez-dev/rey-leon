'use client';

import { Checkbox, Text } from 'rizzui';
import { AllJobsTableDataType } from '.';
import { createColumnHelper } from '@tanstack/react-table';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import AvatarCard from '@core/ui/avatar-card';

const statusOptions = [
  { label: 'Live', value: 'Live' },
  { label: 'Closed', value: 'Closed' },
];

const columnHelper = createColumnHelper<AllJobsTableDataType>();

export const allJobsColumns = [
  columnHelper.display({
    id: 'select',
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
      />
    ),
  }),

  columnHelper.display({
    id: 'ID',
    size: 40,
    header: 'ID',
    cell: ({ row }) => <Text>{row.original.id}</Text>,
  }),
  columnHelper.accessor('item.name', {
    id: 'name',
    size: 270,
    header: 'Paciente',
    enableSorting: false,
    cell: ({ row: { original } }) => (
      <AvatarCard
        name={original.name || 'Sin Nombre'}
        src={original.avatar || 'https://via.placeholder.com/150'}
        description={original.email || 'Sin EPS Asignada'}
      />
    ),
  }),
  columnHelper.display({
    id: 'candidates',
    size: 120,
    header: 'EPS',
    cell: ({ row }) => <Text>{row.original.EPS}</Text>,
  }),
  columnHelper.display({
    id: 'typeDocument',
    size: 100,
    header: 'Tipo de Documento',
    cell: ({ row }) => <Text>{row.original.typeDocument}</Text>,
  }),
  columnHelper.display({
    id: 'hired',
    size: 80,
    header: 'Numero de Documento',
    cell: ({ row }) => <Text>{row.original.numberDocument}</Text>,
  }),
  columnHelper.display({
    id: 'rigine',
    size: 100,
    header: 'Regimen',
    cell: ({ row }) => <Text>{row.original.regime}</Text>,
  }),
  columnHelper.display({
    id: 'affiliation',
    size: 100,
    header: 'Tipo de afiliacion',
    cell: ({ row }) => <Text>{row.original.affiliation}</Text>,
  }),

  columnHelper.display({
    id: 'phone',
    size: 100,
    header: 'Telefono',
    cell: ({ row }) => <Text>{row.original.phone}</Text>,
  }),
  columnHelper.display({
    id: 'city',
    size: 100,
    header: 'Ciudad de residencia',
    cell: ({ row }) => <Text>{row.original.city}</Text>,
  }),
  columnHelper.display({
    id: 'actions',
    size: 140,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <TableRowActionGroup
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
      />
    ),
  }),
];
