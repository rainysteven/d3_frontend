import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/section',
  name: '依赖切面',
  component: LAYOUT,
  redirect: '/section/fileTable',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:file-tray-outline',
    title: t('routes.dashboard.section'),
    orderNo: 1,
  },
  children: [
    {
      path: 'fileTable',
      name: '文件列表',
      component: () => import('/@/views/section/index.vue'),
      meta: {
        title: t('routes.dashboard.fileTable'),
        icon: 'ion:list-circle-outline',
      },
      children: [
        {
          path: 'section_visualization/:id',
          name: '依赖切面可视化',
          component: () => import('/@/views/section/sectionVisualization.vue'),
          meta: {
            hideMenu: true,
            title: t('routes.dashboard.sectionVisualization'),
            ignoreKeepAlive: true,
            showMenu: false,
            currentActiveMenu: '/section/fileTable',
          },
        },
      ],
    },
  ],
};

export default dashboard;
