'use client'; 
import { Button } from 'rizzui/button';
import { Text } from 'rizzui/typography';
import { ActionIcon } from 'rizzui/action-icon';
import cn from '@core/utils/class-names';
import WidgetCard from '@core/components/cards/widget-card';
import CircleProgressBar from '@core/components/charts/circle-progressbar';
import { PiSlidersHorizontalDuotone } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function CircleProgressBars({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [roles, setRoles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRoles = async () => {
      if (session?.jwt) {
        try {
          const res = await fetch(
            'https://reyleonback.s.cloudesarrollosmoyan.com/api/users-permissions/roles',
            {
              headers: {
                Authorization: `Bearer ${session.jwt}`,
              },
            }
          );
          const result = (await res.json()) as { roles?: any[] };
          setRoles(result.roles || []);
        } catch (error) {
          console.error('Error fetching roles:', error);
        }
      }
    };
    fetchRoles();
  }, [session?.jwt]); 

  return (
    <>
      {roles.map((role) => (
        <WidgetCard
          key={role.id}
          title={role.name}
          description={"Rol " + role.name} 
          rounded="lg"
          // action={
          //   <ActionIcon variant="outline" rounded="full">
          //     <PiSlidersHorizontalDuotone className="h-auto w-5" />
          //   </ActionIcon>
          // }
          descriptionClassName="text-gray-500 mt-1.5"
          className={cn(className)}
        >
          <div className="mt-5 grid w-full grid-cols-1 justify-around gap-6 @container @sm:py-2 @7xl:gap-8">
            <div className="text-center">
              <div className="mx-auto mb-5 mt-2 w-full max-w-[180px] sm:mb-7 xl:mb-8 2xl:mb-10 2xl:mt-4">
              <Text className="font-lexend text-xl font-bold text-gray-900 @xs:text-2xl">
                      {role.name}
                    </Text>
              </div>
              <Text className="leading-relaxed">
                <Text as="strong" className="font-semibold">
                  ID: {role.id}
                </Text>{' '}
                 
              </Text>
            </div>

            {/* <Button
              size="lg"
              className={cn(
                'text-sm font-semibold text-white',
                'bg-[#7928ca] hover:bg-[#601da3]',
                'active:enabled:bg-[#4c2889]'
              )}
            >
              View Details
            </Button> */}
          </div>
        </WidgetCard>
      ))}
    </>
  );
}
