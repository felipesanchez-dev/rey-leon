import { avatarIds } from '@core/utils/get-avatar';
import { getRandomArrayElement } from '@core/utils/get-random-array-element';

export const appointmentTypes = {
  'Routine Checkup': 'Routine Checkup',
  'Pregnant Yoga': 'Pregnant Yoga',
  Consultant: 'Consultant',
  Training: 'Training',
};
export const appointmentStatuses = {
  Scheduled: 'Scheduled',
  Waiting: 'Waiting',
};

export type Type = keyof typeof appointmentTypes;
export type StatusType = keyof typeof appointmentStatuses;

export const appointmentData = [
  {
    id: '3416',
    patient: {
      name: 'Kristie Ziemann',
      email: 'kristie@example.com',
    },
    doctor: {
      name: 'Dr. Johnnie Kassulke',
      email: 'johnnie.kassulke@example.com',
      avatar: `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-${getRandomArrayElement(
        avatarIds
      )}.webp`,
    },
    type: 'Routine Checkup',
    date: '2022-11-10T06:22:01.621Z',
    status: 'Scheduled',
    amount: 45.54,
    duration: 90,
    address: '1250 E Apache Blvd, Arkansas, USA',
  },
  {
    id: '3417',
    patient: {
      name: 'Susie Beatty',
      email: 'susie@example.com',
    },
    doctor: {
      name: 'Dr. Marcos McGlynn',
      email: 'marcos@example.com',
      avatar: `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-${getRandomArrayElement(
        avatarIds
      )}.webp`,
    },
    type: 'Consultant',
    date: '2023-02-06T17:46:26.713Z',
    status: 'Waiting',
    amount: 45.54,
    duration: 120,
    address: '1250 E Apache Blvd, Arkansas, USA',
  },
];
