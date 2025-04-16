import { ROLES } from '@/config/constants';
import { avatarIds } from '@core/utils/get-avatar';
import { getRandomArrayElement } from '@core/utils/get-random-array-element';

export type User = {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  role: keyof typeof ROLES;
  createdAt: Date;
  permissions: keyof typeof PERMISSIONS;
  status: keyof typeof STATUSES;
};

export const PERMISSIONS = {
  Read: 'Read',
  Write: 'Write',
  Delete: 'Delete',
} as const;

export const STATUSES = {
  Pending: 'Pendiente',
  Active: 'Activo',
  Deactivated: 'Desactivado',
} as const;

export const usersData = [
  {
    id: '2',
    avatar: `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-${getRandomArrayElement(
      avatarIds
    )}.webp`,
    fullName: 'test',
    email: 'test@gmail.com',
    role: ROLES.Administrator,
    createdAt: '2025-03-12T19:43:14.369Z',
    permissions: [PERMISSIONS.Read],
    status: STATUSES.Pending,
  },
  {
    id: '6177',
    avatar: `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-${getRandomArrayElement(
      avatarIds
    )}.webp`,
    fullName: 'Joshua Green',
    email: 'ayla_schuster28@yahoo.com',
    role: ROLES.Support,
    createdAt: '2027-11-01T13:23:52.903Z',
    permissions: [PERMISSIONS.Write],
    status: STATUSES.Pending,
  },
];
