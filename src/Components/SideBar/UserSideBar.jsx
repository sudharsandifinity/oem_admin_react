import { Bar, Button, FlexBox, Option, Select, SideNavigation, SideNavigationGroup, SideNavigationItem, SideNavigationSubItem, Text, Title } from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function buildMenuTree(menus) {
  const grouped = {};

  menus.forEach((menu) => {
    const parentId = menu.parentUserMenuId;

    if (!grouped[parentId]) {
      grouped[parentId] = [];
    }

    grouped[parentId].push(menu);
  });

  return grouped;
}

const UserSideBar = (props) => {
  const { selectedCompany, setSelectedCompany, selectedBranch, setSelectedBranch,collapsed } =props;
    // const { Menuitems } = useContext(FormConfigContext);
  const { usermenus } = useSelector((state) => state.usermenus);
  const { user } = useSelector((state) => state.auth);
  const companies = user && user.Branches;
  const authUserMenus = user
    ? user.Roles.map((role) => role.UserMenus).flat()
    : [];

  const buttonRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menulist = selectedBranch
    ? authUserMenus.filter((menu) => menu.branchId === selectedBranch)
    : authUserMenus;
  const menuTree = buildMenuTree(
    menulist.length > 0 ? menulist : authUserMenus
  );
    useEffect(()=>{
      if(authUserMenus.length===0){
        navigate("/")
      }
  
    },[authUserMenus])
  const handleCompanyClick = (companyName) => {
    console.log("Selected company:", companyName);
    setSelectedCompany(companyName);
  };
  const handleBranchClick = (branchname) => {
    console.log("Selected branch:", branchname);
    setSelectedBranch(branchname);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = ""; //await dispatch(fetchauth()).unwrap();

        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch, navigate]);

  const userdata =
    authUserMenus.length > 0 &&
    authUserMenus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      display_name: menu.display_name,
      parent:
        authUserMenus.find((item) => item.id === menu.parentUserMenuId)
          ?.display_name || null,

      order_number: menu.order_number,
    }));

  const topLevelItems =
    userdata && userdata.filter((item) => item.parentUserMenuId === null);
  const childItems =
    userdata && userdata.filter((item) => item.parentUserMenuId !== null);

  // Group children by parent
  const groupedChildren =
    childItems &&
    childItems.reduce((acc, item) => {
      if (!acc[item.parentUserMenuId]) acc[item.parentUserMenuId] = [];
      acc[item.parentUserMenuId].push(item);
      return acc;
    }, {});
  return (
    <FlexBox style={{ height: "100vh" }}>
        <FlexBox direction="Column" style={{ display:collapsed ? "none" : "flex" }}>
          <Bar
            design="Header"
            style={{width: '256px', height: '180px' }}
          >
            <div style={{ display: "flex", flexDirection: 'column', gap: "0.5rem",padding: "1rem" }}>
                <div style={{ width: "220px" }}>
                <Select
                    style={{ width: "100%" }}
                    onChange={(e) =>
                    handleCompanyClick(e.detail.selectedOption.value)
                    }
                >
                    <Option key="" value="">
                    Company
                    </Option>
                    {companies&&companies.map((branch) => (
                    <Option key={branch.Company.id} value={branch.Company.id}>
                        {branch.Company.name}
                    </Option>
                    ))}
                </Select>
            </div>
            <div style={{ width: "220px" }}>
                <Select
                    style={{ width: "100%" }}
                    disabled={!selectedCompany}
                    onChange={(e) =>
                    handleBranchClick(e.detail.selectedOption.value)
                    }
                >
                    <Option>Branch</Option>
                    {companies&&companies.map((branch) => (
                    <Option key={branch.id} value={branch.id}>
                        {branch.name}
                    </Option>
                    ))}
                </Select>
                </div>
            </div>
          </Bar>
            
            {/* <Text style={{ paddingLeft: '16px', paddingBottom: '20px' }}>Menu List</Text> */}
            <SideNavigation>
              {/* <SideNavigationItem text="Dashboard" icon="bbyd-dashboard" /> */}
                <SideNavigationGroup text="User Modules" expanded>
                    {menulist.length > 0 &&
                    menulist.map((menu) =>
                        !menu.RoleMenu.can_list_view ? null : (
                        <SideNavigationItem key={menu.id} text={menu.display_name} unselectable>
                            {menu.children?.length > 0 &&
                            menu.children.map((child) => (
                                <SideNavigationSubItem
                                key={child.id}
                                text={child.display_name}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${menu.display_name}/${child.formId}`);
                                }}
                                />
                            ))}
                        </SideNavigationItem>
                        )
                    )}
                </SideNavigationGroup>
            </SideNavigation>
        </FlexBox>
    </FlexBox>
  )
}

export default UserSideBar
