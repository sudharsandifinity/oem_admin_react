import { useState } from "react";
import TopNav from "../../Components/Header/TopNav";
import Admin from "../../Views/Admin/Admin";

export default function SideNavWrapper() {
  const [collapsed, setCollapsed] = useState(false);
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
        />
      )}
      <Admin collapsed={collapsed} setCollapsed={setCollapsed} />
    </>
  );
}
