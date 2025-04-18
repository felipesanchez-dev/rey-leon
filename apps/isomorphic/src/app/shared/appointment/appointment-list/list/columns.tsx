'use client';

import DeletePopover from '@core/components/delete-popover';
import { useModal } from '@/app/shared/modal-views/use-modal';
import EyeIcon from '@core/components/icons/eye';
import AvatarCard from '@core/ui/avatar-card';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Checkbox, Flex, Text, Tooltip } from 'rizzui';
import { AppointmentDataType } from '.';
import CreateUpdateAppointmentForm from '../appointment-form';
import AppointmentDetails from './appointment-details';
import { useSession } from 'next-auth/react';

const statusOptions = [
  { label: 'Waiting', value: 'Waiting' },
  { label: 'Scheduled', value: 'Scheduled' },
];

const columnHelper = createColumnHelper<AppointmentDataType>();

export const appointmentColumns = [
  columnHelper.display({
    id: 'serialNo',
    size: 50,
    header: 'ID',
    cell: ({ row }) => <Text>{row.original.id}</Text>,
  }),

  columnHelper.accessor('doctor.name', {
    id: 'doctorName',
    size: 210,
    header: 'Entidad',
    enableSorting: false,
    cell: ({ row: { original } }) => (
      <AvatarCard
        src={original.doctor.avatar}
        name={original.doctor.name}
        description={original.doctor.email}
      />
    ),
  }),
  columnHelper.accessor('patient.name', {
    id: 'patientName',
    size: 190,
    header: 'Responsable',
    enableSorting: false,
    cell: ({ row: { original } }) => (
      <div>
        <Text className="text-sm font-medium text-gray-900 dark:text-gray-700">
          {original.patient.name}
        </Text>
        {original.patient.email && (
          <Text className="text-[13px] text-gray-500">
            {original.patient.email}
          </Text>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('type', {
    id: 'type',
    size: 180,
    header: 'Tipo de servicio',
    cell: ({ row }) => (
      <Text className="whitespace-nowrap font-medium text-gray-900">
        {row.original.type}
      </Text>
    ),
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 150,
    header: 'Estado',
    cell: ({ row }) => (
      <Text className="whitespace-nowrap font-medium text-gray-900">
        {row.original.status}
      </Text>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    size: 80,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <AppointmentListActions
        row={row.original}
        onDelete={() => meta?.handleDeleteRow?.(row.original)}
      />
    ),
  }),
];

function AppointmentListActions({
  row,
  onDelete,
}: {
  row: AppointmentDataType;
  onDelete: () => void;
}) {
  const { openModal, closeModal } = useModal();
  const { data: session } = useSession();

  async function handleDelete() {
    try {
      const response = await fetch(
        `https://reyleonback.s.cloudesarrollosmoyan.com/api/client-contracts/${row.documentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar el contrato');
      }

      onDelete();
    } catch (error) {
      console.error('Error eliminando el contrato:', error);
      alert('Hubo un error al intentar eliminar el contrato.');
    }
  }

  return (
    <Flex align="center" justify="end" gap="3" className="pe-3">
      <Tooltip
        size="sm"
        content={'View Appointment'}
        placement="top"
        color="invert"
      >
        <ActionIcon
          as="span"
          size="sm"
          variant="outline"
          aria-label={'Ver informacion'}
          className="hover:!border-gray-900 hover:text-gray-700"
          onClick={() =>
            openModal({
              view: (
                <AppointmentDetails
                  data={row}
                  onDelete={onDelete}
                  onEdit={() => {
                    closeModal();
                    openModal({
                      view: <CreateUpdateAppointmentForm />,
                      customSize: 700,
                    });
                  }}
                />
              ),
              customSize: 900,
            })
          }
        >
          <EyeIcon className="size-4" />
        </ActionIcon>
      </Tooltip>
      <DeletePopover
        title={`Eliminar contrato`}
        description={`¿Está seguro de que desea eliminar este contrato #${row.id}?`}
        onDelete={handleDelete}
      />
    </Flex>
  );
}

