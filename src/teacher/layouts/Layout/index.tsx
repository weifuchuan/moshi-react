import React from "react";
import NavBar from "@/teacher/components/NavBar";
import { Control } from "react-keeper";
import { GetProps } from "@/common/kit/type";
 
interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <React.Fragment>
      <NavBar
        toLogin={() => Control.go("/login")}
        toReg={() => Control.go("/reg")}
      />
      {children}
    </React.Fragment>
  );
}

export default Layout;
