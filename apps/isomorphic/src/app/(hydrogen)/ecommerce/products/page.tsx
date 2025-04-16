
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import GetVehiculos from './GetVehiculos';

export const metadata = {
  ...metaObject('Products'),
};

const pageHeader = {
  title: 'Todos los Vehículos',
  breadcrumb: [
    {
      name: 'Vehículos',
    },
    {
      name: 'Todos los Vehículos',
    },
    {
      name: 'Lista',
    },
  ],
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
        </div>
      </PageHeader>
      <GetVehiculos />
    </>
  );
}
