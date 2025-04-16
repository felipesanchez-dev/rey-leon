'use client';

import { STATUSES } from '@/data/users-data';
import { Badge, Box, Button, Flex, Input, Text, Title } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { PiMagnifyingGlassBold, PiTrashDuotone } from 'react-icons/pi';
import { rolesList } from '@/data/roles-permissions';
import ModalButton from '@/app/shared/modal-button';
import CreateUser from '../create-user';

const statusOptions = [
  {
    value: STATUSES.Active,
    label: STATUSES.Active,
  },
  {
    value: STATUSES.Deactivated,
    label: STATUSES.Deactivated,
  },
  {
    value: STATUSES.Pending,
    label: STATUSES.Pending,
  },
];

const roles = rolesList.map((role) => ({
  label: role.name,
  value: role.name,
}));

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

export default function Filters<TData extends Record<string, any>>({
  table,
}: TableToolbarProps<TData>) {
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;
  return (
    <Box className="mb-4 @container">
      <Flex
        gap="3"
        align="center"
        justify="between"
        className="w-full flex-wrap @4xl:flex-nowrap"
      >
        <Title
          as="h3"
          className="rizzui-title-h3 order-1 whitespace-nowrap pe-4 text-base font-semibold sm:text-lg"
        >
          Todos los usuarios
        </Title>
        <Flex
          align="center"
          direction="col"
          gap="2"
          className="order-4 @lg:grid @lg:grid-cols-2 @4xl:order-2 @4xl:flex @4xl:flex-row"
        >
        </Flex>
        <Input
          type="search"
          clearable={true}
          placeholder="Buscar usuario"
          value={table.getState().globalFilter ?? ''}
          onClear={() => table.setGlobalFilter('')}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          prefix={<PiMagnifyingGlassBold className="size-4" />}
          className="order-3 h-9 w-full @2xl:order-2 @2xl:ms-auto @2xl:h-auto @2xl:max-w-60 @4xl:order-3"
        />
        <Box className="order-2 ms-4 @2xl:order-3 @2xl:ms-0 @4xl:order-4 @4xl:shrink-0">
          <ModalButton
            label="Agregar usuario"
            view={<CreateUser onClose={() => console.log('Modal closed')} />}
            customSize={600}
            className="mt-0"
          />
        </Box>
      </Flex>
    </Box>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    case STATUSES.Active:
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case STATUSES.Deactivated:
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-orange-dark" />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {value}
          </Text>
        </div>
      );
  }
}
