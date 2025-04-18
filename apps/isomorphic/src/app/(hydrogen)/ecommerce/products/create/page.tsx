import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';

export const metadata = {
  ...metaObject('Crear Nuevo Vehículos'),
};

const pageHeader = {
  title: 'Crear Nuevo Vehículo',
  breadcrumb: [
    {
      name: 'Vehículos',
    },
    {
      name: 'Nuevo Vehículos',
    },
    {
      name: 'Crear',
    },
  ],
};

export default function CreateProductPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createProduct}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Nuevo Vehículo
          </Button>
        </Link>
      </PageHeader>

      <CreateEditProduct />
    </>
  );
}
