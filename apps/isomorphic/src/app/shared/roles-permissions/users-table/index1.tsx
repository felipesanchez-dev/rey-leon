'use client';
import { useEffect, useState } from 'react';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { usersColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import { useSession } from 'next-auth/react';
import BasicUsersTable from './BasicUsersTable';
import CreateUser from '../create-user';
import Table from '@core/components/table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';


export type UsersTableDataType = {
  id: string | number;
  avatar: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
  permissions: string[];
  status: string;
};

export default function UsersTable() {
  const [data, setData] = useState<UsersTableDataType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();

  const { table, setData: setTableData } = useTanStackTable<UsersTableDataType>(
    {
      tableData: data,
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
            setTableData((prev) => prev.filter((r) => r.id !== row.id));
            table.resetRowSelection();
          },
          handleMultipleDelete: (rows) => {
            setTableData((prev) => prev.filter((r) => !rows.includes(r)));
            table.resetRowSelection();
          },
        },
        enableColumnResizing: false,
      },
    }
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!(session as any)?.jwt) {
          console.warn('Token JWT no disponible.');
          return;
        }

        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/users',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );

        const response = await res.json();
        console.log('Respuesta completa de la API:', response);

        const typedResponse = response as { data?: any[] };
        const usersArray = Array.isArray(response)
          ? response
          : Array.isArray(typedResponse?.data)
            ? typedResponse.data
            : [];

        if (usersArray.length === 0) {
          console.error('❌ La respuesta no contiene usuarios válidos.');
          return;
        }

        const mapped = usersArray.map((user: any) => ({
          id: user.id,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
          fullName: user.name,
          email: user.email,
          role: user.positionJob || 'Desconocido',
          createdAt: new Date(user.createdAt),
          permissions: ['Read'],
          status: user.blocked
            ? 'Deactivated'
            : user.confirmed
              ? 'Active'
              : 'Pending',
        }));

        setData(mapped);
        setTableData(mapped);
      } catch (err) {
        console.error('❌ Error al cargar usuarios:', err);
      }
    };

    fetchUsers();
  }, [session, setTableData]);

  return (
    // <div className="mt-14">
    //   <button
    //     onClick={() => setOpenModal(true)}
    //     className="mb-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    //   >
    //     Crear Usuario
    //   </button>

    //   {openModal && <CreateUser onClose={() => setOpenModal(false)} />}
    //   <BasicUsersTable data={data} />
    //   <TableFooter table={table} />
    // </div>
    <div className="mt-14">
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
  </div>
  );
}
