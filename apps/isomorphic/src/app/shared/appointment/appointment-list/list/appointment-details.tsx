'use client';

import { useModal } from '@/app/shared/modal-views/use-modal';
import dayjs from 'dayjs';
import { PiCalendarCheckLight, PiMapPinLight, PiXBold } from 'react-icons/pi';
import { Text, ActionIcon, Title, Button } from 'rizzui';
import { AppointmentDataType } from '.';

export default function AppointmentDetails({
  data,
  onDelete,
  onEdit,
}: {
  data?: AppointmentDataType;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { closeModal } = useModal();

  return (
    <div className="block">
      <div className="flex items-center justify-between border-b border-gray-200 p-5 md:p-7">
        <Title
          as="h3"
          className="font-lexend text-xl font-semibold md:text-2xl"
        >
          Detalles del contrato
        </Title>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="size-5" />
        </ActionIcon>
      </div>
      <div className="p-5 md:px-7 md:pb-7 md:pt-6">
        <Title
          as="h3"
          className="mb-5 font-lexend text-lg font-medium md:text-xl"
        >
          Contrato - {data?.doctor?.name} - ID {data?.id}
        </Title>
        <Text className="mb-5 leading-relaxed">
          El presente contrato celebrado con la entidad <span className='font-bold'>{data?.doctor?.name}</span>
          {' '}tiene como objeto la prestación del servicio de tipo <span className='font-bold'>{data?.type}</span>
        </Text>
        {/* <Text className="mb-5 leading-relaxed">
          The passage experienced a surge in popularity during the 1960s when
          Letraset used it on their dry-transfer sheets, and again during the
          90s as desktop publishers bundled the text with their software. Learn
          more at www.ictexpo.com
        </Text> */}
        <ul className="mt-7 space-y-4 text-xs sm:text-sm">
          <li className="flex items-center">
            <PiCalendarCheckLight className="me-2 hidden w-5 shrink-0 text-xl" />
            Fecha de inicio:{' '}
            <span className="font-bold">
            {dayjs(data?.dateStart).format('DD MMM, YYYY')}
          </span>
          </li>
          {/* <li className="flex items-center">
            <PiCalendarCheckLight className="me-2 hidden w-5 shrink-0 text-xl" />
            Fecha Final:{' '}
            <span className="ps-2 font-medium text-gray-1000">
              {dayjs(data?.dateEnd)
                .add(data?.duration! / 60, 'h')
                .format('DD MMM, YYYY h:mm A')}
            </span>
          </li> */}
          <li className="flex items-center">
            <PiMapPinLight className="me-2 hidden w-5 shrink-0 text-xl" />
              Zona:{' '}
            <span className="ps-2 font-medium text-gray-1000">
              {data?.address}
            </span>
          </li>
        </ul>
        <div className="mt-7 flex justify-end gap-3">
          <Button
            variant="outline"
            className="min-w-[80px]"
            onClick={() => onEdit()}
          >
            Editar
          </Button>
          <Button
            variant="solid"
            className="min-w-[80px]"
            onClick={(e) => (onDelete(), closeModal())}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
