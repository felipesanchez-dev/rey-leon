'use client';

import cn from '@core/utils/class-names';
import { jobData } from '@/data/job-data';
import { allJobsColumns } from './columns';
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
  const { table, setData } = useTanStackTable<AllJobsTableDataType>({
    tableData: jobData,
    columnConfig: allJobsColumns,
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
      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/patients',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );
        const json = (await res.json()) as { data: any[] };
        // console.log('Los datos obtenidos de la api son: ', json)

        const formattedData = json.data.map((item) => ({
          id: item.id.toString(),
          name: item.name || 'Sin Nombre',
          EPS: item.EPS || 'Sin EPS Asignada',
          typeDocument: item.typeDocument || 'Sin tipo de documento',
          numberDocument:
            Number(item.numberDocument) || 'Sin numero de documento',
          regime: item.regime || 'Sin regimen',
          affiliation: item.affiliation || 'Sin afiliaciion',
          gender: item.gender || 'Sin genero',
          type: item.type || 'Sin tipo de servicio',
          age: item.age || 'Sin edad',
          phone: item.phone || 'Sin telefono',
          zone: item.zone || 'Sin zona',
          email: item.email || 'Sin email',
          departament: item.departament || 'Sin departamento',
          city: item.city || 'Sin ciudad',
          responsiblePhone: item.responsiblePhone || 'Sin telefono responsable',
          address: item.addres || 'Sin direccion',
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
        console.error('Error fetching pacientes', err);
      }
    };

    if ((session as any)?.jwt) {
      fetchJobs();
    }
  }, [session, setData]);
  // console.log('La Sesion obtenida es: ', session);
  // console.log('Los datos obtenidos son: ', table.getRowModel().rows);

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
