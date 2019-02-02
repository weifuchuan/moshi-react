import React, { FunctionComponent, useContext } from "react";
import "./index.scss";
import { menu } from "@/admin/router.config";
import Layout from "@/admin/layouts/Layout";

const Home: FunctionComponent = ({ children }) => {
  return (
    <div className={"Home"}>
      {menu}
      <div>
        <Layout>{children}</Layout>
      </div>
    </div>
  );
};

export default Home;
