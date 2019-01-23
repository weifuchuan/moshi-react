import React, { useMemo } from "react";
import "./index.scss";
import Layout from "@/teacher/layouts/Layout";
import useTitle from "@/common/hooks/useTitle";
import { packToClassComponent } from "@/common/kit/functions";

function Home() {
  useTitle("默识 - 作者端");

  return (
    <Layout>
      <div className="Home">
        <div>

        </div>
      </div>
    </Layout>
  );
}

export default packToClassComponent(Home);