'use client';

import { useEffect, useState } from 'react';
import cn from '@core/utils/class-names';
import { IconType } from 'react-icons/lib';
import { Box, Text } from 'rizzui';
import { FaHospital, FaTimes } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

type StatType = {
  icon: IconType;
  title: string;
  amount: number;
  users: any[];
};

type StatCardProps = {
  className?: string;
  transaction: StatType;
  onClick?: () => void;
};

export default function JobStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<StatType[]>([]);
  const [selectedEPS, setSelectedEPS] = useState<StatType | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
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
        const clients = json.data;

        const epsData: { [key: string]: any[] } = {};

        clients.forEach((client: any) => {
          const eps = client.EPS || 'No especificada';
          if (!epsData[eps]) epsData[eps] = [];
          epsData[eps].push(client);
        });

        const statsArray: StatType[] = Object.entries(epsData).map(
          ([eps, users]) => ({
            icon: FaHospital,
            title: eps,
            amount: users.length,
            users: users,
          })
        );

        setStats(statsArray);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    fetchData();
  }, [session]);

  return (
    <div className={cn('@container', className)}>
      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <div className="flex items-start gap-4 @md:gap-6 3xl:gap-8">
          {stats.map((stat: StatType, index: number) => (
            <StatCard
              key={'stat-card-' + index}
              transaction={stat}
              className="w-full cursor-pointer transition-shadow duration-300 hover:shadow-lg"
              onClick={() => setSelectedEPS(stat)}
            />
          ))}
        </div>
      </div>

      {selectedEPS && (
        <div className="relative mt-6 rounded-lg border bg-white p-4 shadow-md">
          <button
            onClick={() => setSelectedEPS(null)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
          >
            <FaTimes className="h-5 w-5" />
          </button>
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Usuarios afiliados a{' '}
            <span className="text-blue-600">{selectedEPS.title}</span>
          </h2>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-blue-50 text-blue-900">
                <tr>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Tipo Doc</th>
                  <th className="p-2 text-left"># Documento</th>
                  <th className="p-2 text-left">Teléfono</th>
                  <th className="p-2 text-left">Correo</th>
                </tr>
              </thead>
              <tbody>
                {selectedEPS.users.map((user, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.typeDocument}</td>
                    <td className="p-2">{user.numberDocument}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ className, transaction, onClick }: StatCardProps) {
  const { icon: Icon, title, amount } = transaction;

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-300 hover:border-blue-400 @2xl:p-5',
        className
      )}
    >
      <div className="mb-4 flex items-start gap-5">
        <span className="flex rounded-lg bg-[#E2EEFF] p-3 text-[#3962F7] dark:bg-[#75A1E3]/10 dark:text-[#3b66ec]">
          <Icon className="h-auto w-[28px]" strokeWidth={4} />
        </span>
        <Box className="space-y-1">
          <Text className="font-medium text-gray-700">{title}</Text>
          <Text className="text-[22px] font-bold text-gray-900 dark:text-gray-700 2xl:text-[20px] 3xl:text-3xl">
            {amount} pacientes
          </Text>
        </Box>
      </div>
    </div>
  );
}
