import React from "react";
import LoadingRoute from "@/common/components/LoadingRoute";
import authConfig from "@/admin/authority.config";
import { Menu, Icon } from "antd";
import { Control } from "react-keeper";
import _ from "lodash";
import { RouteConfig, routes } from '@/admin/router.config';

const normalize = require("normalize-path");

const { SubMenu, Item, ItemGroup } = Menu;

export const menu = buildMenus(routes[1].routes!, routes[1].path);

function copyRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.map(route => ({
    ...route,
    routes: route.routes ? copyRoutes(route.routes) : undefined
  }));
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