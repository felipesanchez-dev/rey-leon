'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Table from '@core/components/table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { categoriesColumns } from './columns';

export type CategoryDataType = {
  id: number;
  documentId: string;
  descriptionFailure: string;
  dateReport: string;
  dateStart: string;
  dateEnd: string;
  priority: string;
  providerMechanical: string;
  state: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export default function CategoryTable() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const { table, setData } = useTanStackTable<CategoryDataType>({
    tableData: [],
    columnConfig: categoriesColumns,
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
          table.resetRowSelection();
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
    const fetchMaintenances = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/corrective-maintenances',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        if (!res.ok)
          throw new Error('Error al cargar mantenimientos correctivos');

        const responseData = (await res.json()) as { data: CategoryDataType[] };
        setData(responseData.data);
      } catch (error) {
        console.error('Error cargando mantenimientos:', error);
      } finally {
        setLoading(false);
      }
    };

    if ((session as any)?.jwt) {
      fetchMaintenances();
    }
  }, [session, setData]);

  return (
    <div className="mt-14">
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        isLoading={loading}
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </div>
  );
}
