import {
  PiCheckCircle,
  PiPauseCircle,
  PiDownloadSimple,
  PiClock,
} from 'react-icons/pi';

export const jobBoardStatData = [
  {
    title: 'EPS',
    amount: "string",
    increased: false,
    percentage: '32.40',
    icon: PiCheckCircle,
  },
  {
    title: 'EPS',
    amount: "salud total",
    increased: false,
    percentage: '40.29',
    icon: PiCheckCircle,
  },
  {
    title: 'EPS',
    amount: "prueba",
    increased: false,
    percentage: '32.40',
    icon: PiCheckCircle,
  },
  {
    title: 'EPS',
    amount: "nueva",
    increased: false,
    percentage: '32.40',
    icon: PiCheckCircle,
  },
];

export const jobOverviewDailyData = [
  {
    label: 'Sat',
    activeJobs: 9800,
    onHold: 8000,
    shortlisted: 1800,
  },
  {
    label: 'Sun',
    activeJobs: 8700,
    onHold: 4900,
    shortlisted: 1600,
  },
  {
    label: 'Mon',
    activeJobs: 5000,
    onHold: 8600,
    shortlisted: 3200,
  },
  {
    label: 'Tue',
    activeJobs: 4500,
    onHold: 6800,
    shortlisted: 1200,
  },
  {
    label: 'Wed',
    activeJobs: 2500,
    onHold: 3800,
    shortlisted: 1000,
  },
  {
    label: 'Thu',
    activeJobs: 8000,
    onHold: 5900,
    shortlisted: 1200,
  },
  {
    label: 'Fri',
    activeJobs: 8700,
    onHold: 4800,
    shortlisted: 1600,
  },
];

export const jobOverviewMonthlyData = [
  {
    label: 'Jan',
    activeJobs: 5650,
    onHold: 4540,
    shortlisted: 3200,
  },
  {
    label: 'Feb',
    activeJobs: 1890,
    onHold: 5510,
    shortlisted: 680,
  },
  {
    label: 'Mar',
    activeJobs: 4300,
    onHold: 3000,
    shortlisted: 1500,
  },
  {
    label: 'Apr',
    activeJobs: 5710,
    onHold: 5830,
    shortlisted: 2300,
  },
  {
    label: 'May',
    activeJobs: 5710,
    onHold: 5830,
    shortlisted: 2300,
  },
  {
    label: 'Jun',
    activeJobs: 5710,
    onHold: 5830,
    shortlisted: 2300,
  },
];

export const jobOverviewTicketStatus = [
  { name: 'Active Job' },
  { name: 'On Hold' },
  { name: 'Shortlisted' },
];

export const JOB_OVERVIEW_COLORS = ['#3962F7', '#2750AF', '#BBD6FF'];

export const openJobStatsDailyData = [
  {
    label: 'Sat',
    jobViewed: 980,
    jobApplied: 800,
  },
  {
    label: 'Sun',
    jobViewed: 870,
    jobApplied: 490,
  },
  {
    label: 'Mon',
    jobViewed: 500,
    jobApplied: 860,
  },
  {
    label: 'Tue',
    jobViewed: 450,
    jobApplied: 680,
  },
  {
    label: 'Wed',
    jobViewed: 250,
    jobApplied: 380,
  },
  {
    label: 'Thu',
    jobViewed: 800,
    jobApplied: 590,
  },
  {
    label: 'Fri',
    jobViewed: 870,
    jobApplied: 480,
  },
];

export const openJobStatsMonthlyData = [
  {
    label: 'Jan',
    jobViewed: 56500,
    jobApplied: 45400,
  },
  {
    label: 'Feb',
    jobViewed: 18900,
    jobApplied: 55100,
  },
  {
    label: 'Mar',
    jobViewed: 43000,
    jobApplied: 30000,
  },
  {
    label: 'Apr',
    jobViewed: 57100,
    jobApplied: 58300,
  },
  {
    label: 'May',
    jobViewed: 37100,
    jobApplied: 38300,
  },
  {
    label: 'Jun',
    jobViewed: 27100,
    jobApplied: 28300,
  },
];

export const openJobStatsTicketStatus = [
  { name: 'Job Viewed' },
  { name: 'Job Applied' },
];

export const jobOverviewOptions = [
  {
    label: 'Weekly',
    value: 'week',
  },
  {
    label: 'Monthly',
    value: 'month',
  },
];

export const jobData = [
  {
    id: '3416',
    date: '2022-11-10T06:22:01.621Z',
    title: 'Senior UI/UX Designer',
    candidates: 83,
    inProcess: 25,
    hired: 3,
    category: ['UI/UX', 'Design', 'Figma', 'Adobe', 'Sketch'],
    status: 'Live',
  },
];

export const activeUsersData = [
  {
    country: 'US',
    name: 'United States',
    value: 40,
    style: 'bg-[#E6B9DE]',
    colorCode: '#E6B9DE',
  },
  {
    country: 'CN',
    name: 'China',
    value: 20,
    style: 'bg-[#2750AF]',
    colorCode: '#2750AF',
  },
  {
    country: 'RU',
    name: 'Russia',
    value: 15,
    style: 'bg-[#3962F7]',
    colorCode: '#3962F7',
  },
  {
    country: 'CA',
    name: 'Canada',
    value: 5,
    style: 'bg-[#BBD6FF]',
    colorCode: '#BBD6FF',
  },
];
