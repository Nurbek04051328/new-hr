import {
  UsersIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  HomeIcon,
  Cog8ToothIcon,
} from '@heroicons/vue/24/outline'

import { setting } from '../setting/setting'

export const menu = [
  {
    path: '',
    name: 'home',
    component: () => import('@/components/home/homePage.vue'),
    meta: {
      title: {
        en: 'Home',
        ru: 'Главная',
        uz: 'Bosh sahifa',
        kr: 'Бош сахифа',
      },
      icon: HomeIcon,
      group: 'main',
      search: '',
    },
  },
  {
    path: 'department',
    name: 'department',
    component: () => import('@/components/department/departmentPage.vue'),
    meta: {
      title: {
        en: 'Department',
        ru: 'Отдел',
        uz: 'Bo‘lim',
        kr: 'Бўлим',
      },
      icon: BuildingLibraryIcon,
      group: 'main',
      search: '',
    },
    
  },
  {
    path: 'workers',
    name: 'workers',
    component: () => import('@/components/users/usersPage.vue'),
    meta: {
      title: {
        en: 'Workers',
        ru: 'Сотрудники',
        uz: 'Xodimlar',
        kr: 'Ходимлар',
      },
      icon: UsersIcon,
      group: 'main',
      search: '',
    },
  },
  // {
  //   path: 'worker',
  //   name: 'worker',
  //   component: () => import('@/components/workers/workerPage.vue'),
  //   meta: {
  //     title: {
  //       en: 'Workers',
  //       ru: 'Рабочие',
  //       uz: 'Ishchilar',
  //       kr: 'Ишчилар',
  //     },
  //     icon: UserGroupIcon,
  //     group: 'main',
  //     search: '',
  //   },
  // },
  {
    path: 'event',
    name: 'event',
    component: () => import('@/components/events/eventPage.vue'),
    meta: {
      title: {
        en: 'Events',
        ru: 'Записи',
        uz: 'Qayd yozuvi',
        kr: 'Қайд ёзуви',
      },
      icon: ClipboardDocumentCheckIcon,
      group: 'main',
      search: '',
    },
  },
  // {
  //   path: 'logger',
  //   name: 'logger',
  //   component: () => import('@/components/logger/loggerPage.vue'),
  //   meta: {
  //     title: {
  //       en: 'Logger',
  //       ru: 'Запись журнала',
  //       uz: 'Log yozuvi',
  //       kr: 'Log ёзуви',
  //     },
  //     icon: CalendarDaysIcon,
  //     group: 'main',
  //     search: '',
  //     children: [
  //       {
  //         path: 'logger-router',
  //         name: 'logger-router',
  //         component: () => import('@/components/logger/childloggerRouter.vue'),
  //         meta: {
  //           active: 'logger',
  //           group: 'main',
  //         }
  //       },
  //       {
  //         path: 'logger-door',
  //         name: 'logger-door',
  //         component: () => import('@/components/logger/childLoggerDoor.vue'),
  //         meta: {
  //           active: 'workers',
  //           group: 'main',
  //         }
  //       },
  //     ]
  //   },
  // },

  {
    path: 'settings/',
    name: 'settings',
    component: () => import('@/setting/settingPage.vue'),
    redirect: { name: 'branch' },
    meta: {
      title: {
        en: 'Settings',
        ru: 'Настройки',
        uz: 'Sozlamalar',
        kr: 'Созламалар',
      },
      icon: Cog8ToothIcon,
      group: 'setting',
      search: '',
    },
    children: [...setting],
  },
]
