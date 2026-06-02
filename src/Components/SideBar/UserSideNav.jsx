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
//import UserDashboard from "../../Components/Dashboard/UserDashboard";
import UserDashboard from "../../Views/Dashboard/UserDashboard";

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
    <FlexBox style={{ height: screen.height+10, width: "100%" }}>
      <FlexBox
        direction="Column"
        className={"sidebar" + (collapsed ? "" : " open")}
        style={{ width: collapsed ? "0px" : "260px" }}
      >
        <SideNavigation
          style={{ height: "95%" }}
          fixedItems={
           
              <SideNavigationGroup text="Approver Module" >
            <SideNavigationItem  onClick={() => navigate("/approver")} text="Approver Status" unselectable>
              
              </SideNavigationItem>
            <SideNavigationItem  onClick={() => navigate("/approver/ApproverTemplate")} text="Approval Template" unselectable>
              
              </SideNavigationItem>
                  
            <SideNavigationItem  onClick={() => navigate("/workflowmanagement")} text="Workflow Management" unselectable>
             
            </SideNavigationItem>
             <SideNavigationItem onClick={() => navigate("/stagemanagement")} text="Stage Management" unselectable>
              
            </SideNavigationItem>
          </SideNavigationGroup>
          }
        >
          <SideNavigationGroup text="User Modules" expanded>{console.log("menulist",menulist)}
            {menulist.length > 0 &&
              menulist.filter((r) => r.status===1).map((menu) =>
                !menu.RoleMenu.can_list_view ? null : (
                  <SideNavigationItem
                    key={menu.id}
                    text={menu.display_name}
                    unselectable
                  >
                    {menu.children?.length > 0 &&
                       menu.children.filter((r) => r.status===1).map((child) => ( 
                        <SideNavigationSubItem
                          key={child.id}
                          text={child.display_name}
                          onClick={(e) => {
                            console.log("onclick")
                            e.preventDefault();
                            const slug = menu.display_name.replace(/\s+/g, "-");
                            console.log("slug", slug);
                            navigate(`/${slug}/${child.formId}`);
                            //const slug = child.display_name.replace(/\s+/g, "-");

                            //navigate(`/${menu.display_name}/${slug}`)
                          }}
                        />
                      ))}
                  </SideNavigationItem>
                ),
              )}
          </SideNavigationGroup>
          {/* <SideNavigationGroup text="Approver Module" expanded>
            <SideNavigationItem  onClick={() => navigate("/approver")} text="Approver Status" unselectable>
              
              </SideNavigationItem>
            <SideNavigationItem  onClick={() => navigate("/approver/ApproverTemplate")} text="Approval Template" unselectable>
              
              </SideNavigationItem>
                  
            <SideNavigationItem  onClick={() => navigate("/workflowmanagement")} text="Workflow Management" unselectable>
             
            </SideNavigationItem>
             <SideNavigationItem onClick={() => navigate("/stagemanagement")} text="Stage Management" unselectable>
              
            </SideNavigationItem>
          </SideNavigationGroup> */}
        </SideNavigation>
      </FlexBox>
      <FlexBox style={{ flex: 1 }}>
        {/* outlet will render whichever child route is active (dashboard, reports, etc.) */}
        <Outlet />
      </FlexBox>
    </FlexBox>
  );
};

export default UserSideNav;
