import JobDashboard from '@/app/shared/job-board/dashboard';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Todos los clientes'),
};

export default function JobBoardPage() {
  return <JobDashboard />;
}
