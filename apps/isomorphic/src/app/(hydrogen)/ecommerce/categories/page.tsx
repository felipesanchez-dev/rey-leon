import { routes } from '@/config/routes';
import CategoryTable from '@/app/shared/ecommerce/category/category-list/table';
import CategoryPageHeader from './category-page-header';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Categories'),
};

const pageHeader = {
  title: 'Programar Mantenimiento Preventivo',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Mantenimiento Preventivo',
    },
    {
      href: routes.eCommerce.categories,
      name: 'Agendar',
    },
    {
      name: 'Lista de Mantenimientos programados',
    },
  ],
};

export default function CategoriesPage() {
  return (
    <>
      <CategoryPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <CategoryTable />
    </>
  );
}
