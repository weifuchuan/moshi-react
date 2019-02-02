import React from "react";
import NavBar from "../../components/NavBar";
import { Control } from "react-keeper"; 
 
interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <React.Fragment>
      <NavBar
        toLogin={() => Control.go("/login")}
        toReg={() => {}}
      />
      {children}
    </React.Fragment>
  );
}

export default Layout;
