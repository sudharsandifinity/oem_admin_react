import {
  Bar,
  Button,
  FlexBox,
  Option,
  Select,
  SideNavigation,
  SideNavigationGroup,
  SideNavigationItem,
  SideNavigationSubItem,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import UserDashboard from "../../Components/Dashboard/UserDashboard";

const UserSideNav = ({
  collapsed,
  setCollapsed,
  selectedCompany,
  selectedBranch,
}) => {
  const { user } = useSelector((state) => state.auth);
  const authUserMenus = user
    ? user.Roles.map((role) => role.UserMenus).flat()
    : [];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menulist = selectedBranch
    ? authUserMenus.filter((menu) => menu.branchId === selectedBranch)
    : authUserMenus;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = "";
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

  return (
    <FlexBox style={{ height: "95vh" }}>
      <FlexBox
        direction="Column"
        style={{ width: collapsed ? "0px" : "260px" }}
      >
        <SideNavigation
          fixedItems={
            <>
              <SideNavigationItem
                text="Inventory"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/inventory`);
                }}
              ></SideNavigationItem>
              <SideNavigationItem
                text="Report"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/report`);
                }}
              ></SideNavigationItem>
            </>
          }
        >
          <SideNavigationGroup text="User Modules" expanded>
            {menulist.length > 0 &&
              menulist.map((menu) =>
                !menu.RoleMenu.can_list_view ? null : (
                  <SideNavigationItem
                    key={menu.id}
                    text={menu.display_name}
                    unselectable
                  >
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
      <FlexBox style={{ flex: 1, height: "100%" }}>
        <Outlet />
        <UserDashboard />
      </FlexBox>
    </FlexBox>
  );
};

export default UserSideNav;
