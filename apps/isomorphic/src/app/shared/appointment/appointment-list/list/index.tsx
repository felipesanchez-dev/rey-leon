'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Table from '@core/components/table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { appointmentColumns } from './columns';
import { Box } from 'rizzui';

export default function AppointmentListTable() {
  const { data: session } = useSession();
  const { table, setData } = useTanStackTable({
    tableData: [],
    columnConfig: appointmentColumns,
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
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
          table.resetRowSelection();
        },
      },
      enableColumnResizing: false,
    },
  });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/client-contracts',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        const json = (await res.json()) as { data: any[] };

        const formattedData = json.data.map((item) => ({
          documentId: item.documentId || 'Sin documento',
          id: item.id.toString(),
          patient: {
            name: item.responsible || 'Sin nombre',
            email: ``,
          },
          doctor: {
            name: item.entity || 'Sin entidad',
            email: ``,
            avatar: `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-${Math.floor(
              Math.random() * 15 + 1
            )}.webp`,
          },
          type: item.typeContract || 'Sin tipo',
          dateRegister: item.dateRegister || '',
          datedateStart: item.dateStart || '',
          status: item.state || 'Scheduled',
          amount: Number(item.advance || 0),
          duration: 60,
          address: item.zone || 'Sin zona',
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error fetching contracts:', err);
      }
    };

    if ((session as any)?.jwt) {
      fetchContracts();
    }
  }, [session, setData]);

  return (
    <Box>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </Box>
  );
}
