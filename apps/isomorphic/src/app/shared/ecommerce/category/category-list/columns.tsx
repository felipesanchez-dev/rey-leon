'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { ActionIcon, Checkbox, Text, Title, Tooltip } from 'rizzui';
import { CategoryDataType } from './table';

const columnHelper = createColumnHelper<CategoryDataType>();

export const categoriesColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 55,

    cell: ({ getValue }) => <Text className="text-sm">{getValue()}</Text>,
  }),
  columnHelper.accessor('descriptionFailure', {
    header: 'Falla Reportada',
    size: 100,

    cell: ({ getValue }) => (
      <Text className="truncate !text-sm">{getValue()}</Text>
    ),
  }),
  columnHelper.accessor('dateReport', {
    header: 'Fecha de Reporte',
    size: 70,
    cell: ({ getValue }) => <Text className="text-sm">{getValue()}</Text>,
  }),
  columnHelper.accessor('priority', {
    header: 'Prioridad',
    size: 60,

    cell: ({ getValue }) => <Text className="text-sm">{getValue()}</Text>,
  }),
  columnHelper.accessor('providerMechanical', {
    header: 'Proveedor Mecánico',
    size: 66,

    cell: ({ getValue }) => <Text className="text-sm">{getValue()}</Text>,
  }),
  columnHelper.accessor('state', {
    header: 'Estado',
    size: 55,
    cell: ({ getValue }) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-semibold ${
          getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {getValue() ? 'Completado' : 'Pendiente'}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'action',
    size: 100,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <div className="flex items-center justify-end gap-2 pe-4">
        <Tooltip
          content={'Editar Mantenimiento'}
          placement="top"
          color="invert"
        >
          <Link href={routes.eCommerce.editCategory(String(row.original.id))}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Eliminar mantenimiento`}
          description={`¿Seguro que quieres eliminar el mantenimiento #${row.original.id}?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];