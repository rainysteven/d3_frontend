import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/fileManager',
  name: '文件管理',
  component: LAYOUT,
  redirect: '/fileManager/formTable',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:file-tray-outline',
    title: t('routes.dashboard.fileManager'),
    orderNo: 1,
  },
  children: [
    {
      path: 'formTable',
      name: 'formTalbe',
      component: () => import('/@/views/file/formTable/index.vue'),
      meta: {
        title: t('routes.dashboard.fileTable'),
        icon: 'ion:list-circle-outline',
      },
      children: [
        {
          path: 'file_visualization/:id',
          name: 'FileVisualization',
          component: () => import('/@/views/file/formTable/fileVisualization.vue'),
          meta: {
            hideMenu: true,
            title: t('routes.dashboard.fileVisualization'),
            ignoreKeepAlive: true,
            showMenu: false,
            currentActiveMenu: '/fileManager/formTable',
          },
        },
      ],
    },
  ],
};

export default dashboard;
