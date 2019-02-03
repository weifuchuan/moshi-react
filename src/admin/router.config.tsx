import LoadingRoute from '@/common/components/LoadingRoute';
import _ from 'lodash';
import React from 'react';
import authConfig from './authority.config';
import { Filter } from 'react-keeper';

export interface RouteConfig {
  path: string;
  component: () => Promise<any>;
  name: string;
  icon?: string;
  authority?: string[];
  flatChildren?: boolean;
  routes?: RouteConfig[];
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  cache?: boolean;
  index?: boolean;
  miss?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('./pages/Login'),
    name: '登录',
    authority: [ 'notLogin' ]
  },
  {
    path: '/home',
    component: () => import('./pages/Home'),
    name: '首页',
    authority: [ 'hasLogin', 'isManager' ],
    routes: [
      {
        path: '/course',
        component: () => import('./pages/Course'),
        name: '课程管理',
        flatChildren: true,
        routes: [
          {
            path: '/column',
            component: () => import('./pages/Column'),
            name: '专栏课程'
          },
          {
            path: '/video',
            component: () => import('./pages/VideoCourse'),
            name: '视频课程'
          }
        ]
      },
      {
        path: '/apply',
        component: () => import('./pages/Application'),
        name: '申请管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/unpassed',
            component: () => import('./pages/Application/pages/Unpassed'),
            name: '未通过的申请',
            cache: true,
            index: true
          },
          {
            path: '/success',
            component: () => import('./pages/Application/pages/Success'),
            name: '已成功的申请',
            cache: true
          },
          {
            path: '/fail',
            component: () => import('./pages/Application/pages/Fail'),
            name: '被打回的申请',
            cache: true
          }
        ]
      },
      {
        path: '/media',
        component: () => import('./pages/Media'),
        name: '媒体资源管理'
      },
      {
        path: '/user',
        component: () => import('./pages/User'),
        name: '用户管理',
        flatChildren: true,
        routes: [
          {
            path: '/role',
            component: () => import('./pages/Role'),
            name: '角色管理'
          },
          {
            path: '/permission',
            component: () => import('./pages/Permission'),
            name: '权限管理'
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('./pages/Home'),
    name: '首页',
    authority: [ 'hasLogin', 'isManager', 'toHome' ]
  }
];

export default buildRoutes(routes);

function copyRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.map((route) => ({
    ...route,
    routes: route.routes ? copyRoutes(route.routes) : undefined
  }));
}

function buildRoutes(routes: RouteConfig[]) {
  routes = copyRoutes(routes);

  return _.flatMap(
    routes.map((route) => {
      let routes2 = [ route ];
      if (route.flatChildren && route.routes) {
        routes2 = route.routes.map((r) => ({
          ...r,
          path: route.path + r.path
        }));
        route.routes = undefined;
        route.path += '>';
        routes2.unshift(route);
      }
      return routes2.map((route) => (
        <LoadingRoute
          key={route.path}
          path={route.path}
          imported={route.component}
          cache={route.cache}
          index={route.index}
          miss={route.miss}
          enterFilter={
            route.authority ? (
              [
                ...route.authority.map((key) => authConfig[key]),
                (cb) => {
                  bus.emit('routePathChange');
                  cb();
                }
              ]
            ) : (
              [
                (cb) => {
                  bus.emit('routePathChange');
                  cb();
                }
              ]
            )
          }
        >
          {route.routes ? buildRoutes(route.routes) : undefined}
        </LoadingRoute>
      ));
    })
  );
}
