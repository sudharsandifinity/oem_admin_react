import { useState } from "react";
import TopNav from "../../Components/Header/TopNav";
import Admin from "../../Views/Admin/Admin";

export default function SideNavWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const hideHeaderRoutes = ["/", "/Login", "/login", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && (
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      <Admin collapsed={collapsed} setCollapsed={setCollapsed} />
    </>
  );
}
