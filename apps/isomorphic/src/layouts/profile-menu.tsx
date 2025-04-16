'use client';

import { Title, Text, Avatar, Button, Popover } from 'rizzui';
import cn from '@core/utils/class-names';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  positionJob: string;
}

export default function ProfileMenu({
  buttonClassName,
  avatarClassName,
  username = false,
}: {
  buttonClassName?: string;
  avatarClassName?: string;
  username?: boolean;
}) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(
          'https://reyleonback.s.cloudesarrollosmoyan.com/api/users/me',
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.jwt}`,
            },
          }
        );
        const json = (await res.json()) as {
          id: number;
          username?: string;
          name?: string;
          email?: string;
          positionJob?: string;
        };
        const user = {
          id: json.id.toString(),
          username: json.username || 'Sin nombre', 
          name: json.name || 'Sin nombre',
          email: json.email || 'Sin email',
          positionJob: json.positionJob || 'Sin rol',
        };
        setUserData(user);
      } catch (err) {
        console.error('Error al obtener los datos del usuario:', err);
      }
    };

    if ((session as any)?.jwt) {
      fetchMe();
    }
  }, [session]);

  return (
    <ProfileMenuPopover>
      <Popover.Trigger>
        <button
          className={cn(
            'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10',
            buttonClassName
          )}
        >
          <Avatar
            src="/avatar.webp"
            name={userData?.name || 'Usuario'}
            className={cn('!h-9 w-9 sm:!h-10 sm:!w-10', avatarClassName)}
          />
          {!!username && userData && (
            <span className="username hidden text-gray-200 dark:text-gray-700 md:inline-flex">
              Hola, {userData.username}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Content className="z-[9999] p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
        <DropdownMenu userData={userData} />
      </Popover.Content>
    </ProfileMenuPopover>
  );
}

function ProfileMenuPopover({ children }: React.PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement="bottom-end"
    >
      {children}
    </Popover>
  );
}

function DropdownMenu({ userData }: { userData: UserData | null }) {
  return (
    <div className="w-64 text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
        <Avatar src="/avatar.webp" name={userData?.name || 'Usuario'} />
        <div className="ms-3">
          <Title as="h6" className="font-bold">
            {userData?.name || 'Sin nombre'}
          </Title>
          <Text className="text-gray-600">
            {userData?.email || 'Sin email'}
          </Text>
          <br />

          <Text className="text-gray-600 font-semibold">
            {userData?.positionJob || 'Sin rol'}
          </Text>
        </div>
      </div>
      <div className="border-t border-gray-300 px-6 pb-6 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
