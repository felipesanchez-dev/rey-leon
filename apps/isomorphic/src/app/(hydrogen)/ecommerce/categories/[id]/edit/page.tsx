import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CreateCategory from '@/app/shared/ecommerce/category/create-category';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  return metaObject(`Edit Maintenance #${id}`);
}

const pageHeader = {
  title: 'Editar Mantenimiento Correctivo',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Inicio',
    },
    {
      href: routes.eCommerce.categories,
      name: 'Mantenimientos',
    },
    {
      name: 'Editar',
    },
  ],
};

const maintenanceData = {
  documentId: '',
  descriptionFailure: '',
  dateReport: '',
  priority: '',
  providerMechanical: '',
  state: true,
  name: '',
  slug: '',
};

export default async function EditMaintenancePage({ params }: any) {
  const id = (await params).id;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.categories}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancelar
          </Button>
        </Link>
      </PageHeader>

      <CreateCategory id={id} category={maintenanceData} />
    </>
  );
}
