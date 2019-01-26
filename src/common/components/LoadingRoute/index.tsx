import React from "react";
import { RouteProps, Route } from "react-keeper";
import Loadable from "react-loadable";

interface AsyncRouteProps extends RouteProps {
  imported: any;
  loading?: () => JSX.Element;
}

function Loading() {
  return <div style={{ margin: "1em" }}>Loading...</div>;
}

export default function LoadingRoute(props: AsyncRouteProps) {
  const LoadableComponnet = Loadable({
    loader: () => props.imported, // oh no!
    loading: props.loading ? props.loading : Loading
  });
  return <Route {...props} component={LoadableComponnet} />;
}
