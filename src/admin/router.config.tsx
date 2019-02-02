import React from "react";
import LoadingRoute from "@/common/components/LoadingRoute";
import authConfig from "./authority.config";
import { Menu, Icon } from "antd";
import { Control } from "react-keeper";
import _ from "lodash";

const normalize = require("normalize-path");

const { SubMenu, Item, ItemGroup } = Menu;

interface RouteConfig {
  path: string;
  component: () => Promise<any>;
  name: string;
  icon?: string;
  authority?: string[];
  flatChildren?: boolean;
  routes?: RouteConfig[];
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: "/login",
    component: () => import("./pages/Login"),
    name: "登录",
    authority: ["notLogin"]
  },
  {
    path: "/home",
    component: () => import("./pages/Home"),
    name: "首页",
    authority: ["hasLogin", "isManager"],
    routes: [
      {
        path: "/course",
        component: () => import("./pages/Course"),
        name: "课程管理",
        flatChildren: true,
        routes: [
          {
            path: "/apply",
            component: () => import("./pages/Course/pages/Application"),
            name: "申请管理"
          },
          {
            path: "/column",
            component: () => import("./pages/Course/pages/Column"),
            name: "专栏课程"
          },
          {
            path: "/video",
            component: () => import("./pages/Course/pages/VideoCourse"),
            name: "视频课程"
          }
        ]
      },
      {
        path: "/media",
        component: () => import("./pages/Media"),
        name: "媒体资源管理"
      },
      {
        path: "/user",
        component: () => import("./pages/User"),
        name: "用户管理",
        flatChildren: true,
        routes: [
          {
            path: "/role",
            component: () => import("./pages/User/pages/Role"),
            name: "角色管理"
          },
          {
            path: "/permission",
            component: () => import("./pages/User/pages/Permission"),
            name: "权限管理"
          }
        ]
      }
    ]
  },
  {
    path: "/",
    component: () => import("./pages/Home"),
    name: "首页",
    authority: ["hasLogin", "isManager", "toHome"]
  }
];

export default buildRoutes(routes);

export const menu = buildMenus(routes[1].routes!, routes[1].path);

function copyRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.map(route => ({
    ...route,
    routes: route.routes ? copyRoutes(route.routes) : undefined
  }));
}

function buildRoutes(routes: RouteConfig[]) {
  routes = copyRoutes(routes);

  return _.flatMap(
    routes.map(route => {
      let routes2 = [route];
      if (route.flatChildren && route.routes) {
        routes2 = route.routes.map(r => ({ ...r, path: route.path + r.path }));
        route.routes = undefined;
        route.path += ">";
        routes2.unshift(route);
      }
      return routes2.map(route => (
        <LoadingRoute
          key={route.path}
          path={route.path}
          imported={route.component}
          enterFilter={
            route.authority ? route.authority.map(key => authConfig[key]) : []
          }
        >
          {route.routes ? buildRoutes(route.routes) : undefined}
        </LoadingRoute>
      ));
    })
  );
}

function buildMenus(routes: RouteConfig[], basePath: string) {
  routes = copyRoutes(routes);

  return (
    <Menu
      onClick={({ keyPath }) => {
        keyPath = keyPath.filter(p => !/\?\?/.test(p));
        keyPath.push(basePath);
        const path = keyPath.reduceRight((prev, curr) => prev + "/" + curr, "");
        Control.go(normalize(path));
      }}
      theme={"dark"}
      mode="inline"
    >
      {routes
        .map(route => {
          if (route.hideInMenu) {
            return undefined;
          } else {
            if (!route.hideChildrenInMenu && route.routes) {
              return buildSubMenus(route, basePath);
            } else {
              return <Item key={route.path}>{route.name}</Item>;
            }
          }
        })
        .filter(x => !!x)}
    </Menu>
  );
}

function buildSubMenus(route: RouteConfig, basePath: string) {
  return (
    <SubMenu
      title={
        route.icon ? (
          <span>
            <Icon type={route.icon}/>
            <span>{route.name}</span>
          </span>
        ) : (
          <span>{route.name}</span>
        )
      }
      key={route.path}
    >
      <Item key={route.path + "??"}>{route.name}</Item>
      {route
        .routes!.map(route => {
        if (route.hideInMenu) {
          return undefined;
        } else {
          if (!route.hideChildrenInMenu && route.routes) {
            return buildSubMenus(route, basePath + "/" + route.path);
          } else {
            return <Item key={route.path}>{route.name}</Item>;
          }
        }
      })
        .filter(x => !!x)}
    </SubMenu>
  );
}

// function buildMenus(routes: RouteConfig[], basePath: string) {
//   return (
//     <Menu
//       inlineCollapsed={false}
//       onClick={({ keyPath }) => {
//         keyPath.push(basePath);
//         const path = keyPath.reduceRight((prev, curr) => prev + "/" + curr, "");
//         Control.go(normalize(path));
//       }}
//       theme={"dark"}
//       mode="inline"
//     >
//       {routes
//         .map(route => {
//           if (route.hideInMenu) {
//             return undefined;
//           } else {
//             if (!route.hideChildrenInMenu && route.routes) {
//               return buildSubMenus(route, basePath);
//             } else {
//               return <Item key={route.path}>{route.name}</Item>;
//             }
//           }
//         })
//         .filter(x => !!x)}
//     </Menu>
//   );
// }

// function buildSubMenus(route: RouteConfig, basePath: string) {
//   return (
//     <SubMenu
//       title={
//         route.icon ? (
//           <span>
//             <Icon type={route.icon} />
//             <span>{route.name}</span>
//           </span>
//         ) : (
//           <span>{route.name}</span>
//         )
//       }
//       key={route.path}
//       onTitleClick={
//         (({ key }: { key: string }) => {
//           console.log(key);
//           Control.go(normalize(basePath + "/" + key));
//         }) as any
//       }
//     >
//       {route
//         .routes!.map(route => {
//           if (route.hideInMenu) {
//             return undefined;
//           } else {
//             if (!route.hideChildrenInMenu && route.routes) {
//               return buildSubMenus(route, basePath + "/" + route.path);
//             } else {
//               return <Item key={route.path}>{route.name}</Item>;
//             }
//           }
//         })
//         .filter(x => !!x)}
//     </SubMenu>
//   );
// }
