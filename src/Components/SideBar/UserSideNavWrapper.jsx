import { useState } from "react";
import TopNav from "../Header/TopNav";
import UserSideNav from "./UserSideNav";

export default function UserSideNavWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const hideHeaderRoutes = ["/", "/Login","/login", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />}
      <UserSideNav collapsed={collapsed} setCollapsed={setCollapsed} />
    </>
  );
}
