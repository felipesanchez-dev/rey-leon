'use client';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge, Checkbox, Flex, Button } from 'rizzui';
import { UsersTableDataType } from '.';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group'; // corrección aquí
import { EyeIcon, PencilIcon } from 'lucide-react';

const columnHelper = createColumnHelper<UsersTableDataType>();

export const usersColumns = [
  columnHelper.display({
    id: 'select',
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all Rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select Row"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.display({
    id: 'id',
    size: 50,
    header: 'ID',
    cell: ({ row }) => <>{row.original.id}</>,
  }),
  columnHelper.accessor('name', {
    id: 'fullName',
    size: 300,
    header: 'Nombre Completo',
    enableSorting: false,
    cell: ({ row }) => (
      <AvatarCard
        src={
          row.original.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            row.original.name || 'Usuario'
          )}&background=random`
        }
        name={row.original.name || 'Usuario'}
        description={row.original.email}
      />
    ),
  }),
  columnHelper.display({
    id: 'firsName', // corregido
    size: 200,
    header: 'Nombre de usuario',
    cell: ({ row }) => <>{row.original.firsName}</>, // corregido
  }),
  columnHelper.accessor('typeDocument', {
    id: 'typeDocument',
    size: 200,
    header: 'Tipo de Identificación',
    cell: ({ row }) => row.original.typeDocument,
  }),
  columnHelper.accessor('numberDocument', {
    id: 'numberDocument',
    size: 200,
    header: 'Número de Identificación',
    cell: ({ row }) => row.original.numberDocument,
  }),
  columnHelper.accessor('address', {
    id: 'address',
    size: 200,
    header: 'Dirección',
    cell: ({ row }) => row.original.address,
  }),
  columnHelper.accessor('city', {
    id: 'city',
    size: 200,
    header: 'Ciudad',
    cell: ({ row }) => row.original.city,
  }),
  columnHelper.accessor('supplierType', {
    id: 'supplierType',
    size: 200,
    header: 'Tipo de empresa',
    cell: ({ row }) => row.original.supplierType,
  }),
  columnHelper.accessor('positionJob', {
    id: 'role',
    size: 150,
    header: 'Rol',
    cell: ({ row }) => row.original.positionJob,
  }),
  columnHelper.accessor('blocked', {
    id: 'blocked',
    size: 150,
    header: 'Estado',
    enableSorting: false,
    cell: ({ row }) =>
      getStatusBadge(row.original.blocked ? 'Inactivo' : 'Activo'),
  }),
   columnHelper.display({
    id: 'action',
    size: 140,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <TableRowActionGroup
        deletePopoverTitle={`Delete this user`}
        deletePopoverDescription={`Are you sure you want to delete this #${row.original.id} user?`}
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
      />
    )
  }),
];
