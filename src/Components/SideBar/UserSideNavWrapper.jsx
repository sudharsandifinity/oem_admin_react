import { useState } from "react";
import TopNav from "../Header/TopNav";
import UserSideNav from "./UserSideNav";

export default function UserSideNavWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const isDashboardSelected = ["/dashboard"].includes(location.pathname);
  const hideHeaderRoutes = ["/", "/Login", "/login", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  return (
    <>
      {!shouldHideHeader && (
        <TopNav
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          isDashboardSelected={isDashboardSelected}
        />
      )}
      <UserSideNav
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        selectedCompany={selectedCompany}
        selectedBranch={selectedBranch}
      />
    </>
  );
}
