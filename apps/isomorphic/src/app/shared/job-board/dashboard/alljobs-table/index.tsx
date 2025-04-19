'use client';

import cn from '@core/utils/class-names';
import { jobData } from '@/data/job-data';
import { useAllJobsColumns } from './columns';
import Table from '@core/components/table';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export type AllJobsTableDataType = (typeof jobData)[number];

export default function AllJobsTable({ className }: { className?: string }) {
  const { data: session } = useSession();
  const jwt = (session as { jwt?: string })?.jwt || '';

  const { table, setData } = useTanStackTable<AllJobsTableDataType>({
    tableData: jobData,
    columnConfig: useAllJobsColumns(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
      },
      enableColumnResizing: false,
    },
  });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!jwt) return;

      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/patients',
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error en la respuesta: ${res.status}`);
        }

        const json = (await res.json()) as { data: any[] };

        const formattedData = json.data.map((item) => ({
          id: item.id?.toString() || 'Sin ID',
          documentId: item.documentId || 'Sin ID de documento',
          name: item.name || 'Sin Nombre',
          EPS: item.EPS || 'Sin EPS Asignada',
          typeDocument: item.typeDocument || 'Sin tipo de documento',
          numberDocument: item.numberDocument || 'Sin número de documento',
          regime: item.regime || 'Sin régimen',
          affiliation: item.affiliation || 'Sin afiliación',
          gender: item.gender || 'Sin género',
          type: item.type || 'Sin tipo de servicio',
          age: item.age || 'Sin edad',
          phone: item.phone || 'Sin teléfono',
          zone: item.zone || 'Sin zona',
          email: item.email || 'Sin email',
          departament: item.departament || 'Sin departamento',
          city: item.city || 'Sin ciudad',
          responsiblePhone: item.responsiblePhone || 'Sin teléfono responsable',
          address: item.address || 'Sin dirección',
          locality: item.locality || 'Sin localidad',
          coordinates: item.coordinates || 'No aplica',
          date: item.date || 'Sin fecha',
          title: item.title || 'Sin título',
          candidates: item.candidates || 0,
          inProcess: item.inProcess || 0,
          hired: item.hired || 0,
          category: item.category || [],
          status: item.status || 'Sin estado',
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error al obtener los pacientes:', err);
      }
    };

    fetchJobs();
  }, [jwt, setData]);

  return (
    <WidgetCard
      title="Todos los pacientes"
      className={cn('p-0 @container lg:p-0', className)}
      titleClassName="whitespace-nowrap font-inter"
      headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center pt-5 px-5 lg:pt-7 lg:px-7"
      actionClassName="grow @[57rem]:ps-11 ps-0 items-center w-full @[42rem]:w-full @[57rem]:w-auto "
      action={<Filters table={table} />}
    >
      <Table table={table} variant="modern" />
      <TablePagination table={table} className="p-4" />
    </WidgetCard>
  );
}