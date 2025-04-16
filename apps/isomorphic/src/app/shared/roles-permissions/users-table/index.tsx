'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Table from '@core/components/table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { usersColumns } from './columns';

export type UsersTableDataType = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  firsName: string;
  typeUser: string | null;
  typeDocument: string;
  numberDocument: number;
  phone: string;
  positionJob: string;
  area: string | null;
  address: string;
  sectorCategory: string;
  supplierType: string;
  city: string;
  categoryLicence: string | null;
  expirationDate: string | null;
  lastSocialSecutityPayment: string | null;
  avatar?: string;
};

export default function UsersTable() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const { table, setData } = useTanStackTable<UsersTableDataType>({
    tableData: [],
    columnConfig: usersColumns,
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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/users',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        if (!res.ok) throw new Error('Error al cargar usuarios');

        const users = (await res.json()) as UsersTableDataType[];

        const usersWithAvatars = users.map((user: UsersTableDataType) => ({
          ...user,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=random`,
        }));

        setData(usersWithAvatars);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    if ((session as any)?.jwt) {
      fetchUsers();
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
