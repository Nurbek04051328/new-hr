export const detailMenu = [
  // Users
  {
    path: 'workers/:id',
    name: 'detailWorker',
    component: () => import('@/components/users/userDetailPage.vue'),
    meta: {
      title: "Страница сотрудника",
      back:true,
      group: 'detail',
    },
    children: [
      {
        path: 'absence',
        name: 'absence',
        component: () => import('@/components/absence/absencePage.vue'),
        meta: {
          active: 'workers',
          group: 'main',
        }
      },
      {
        path: 'user-statistic',
        name: 'user-statistic',
        component: () => import('@/components/users/userStatistic.vue'),
        meta: {
          active: 'workers',
          group: 'main',
        }
      },
      {
        path: 'worker-events',
        name: 'worker-events',
        component: () => import('@/components/users/userEventTable.vue'),
        meta: {
          active: 'workers',
          group: 'main',
        }
      },
    ]
  },
]
