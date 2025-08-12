import {
  Avatar,
  Button,
  ListItemStandard,
  Menu,
  MenuItem,
  MenuSeparator,
  Option,
  Select,
  ShellBar,
  ShellBarItem,
  ShellBarSearch,
} from "@ui5/webcomponents-react";
import React, { useEffect, useRef, useState } from "react";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemingParameters } from "@ui5/webcomponents-react-base";

import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { fetchCompanies } from "../../store/slices/companiesSlice";

const Header = () => {
  const [fioriTheme, setFioriTheme] = useState("sap_fiori_3");
  const { companies } = useSelector((state) => state.companies);
  const dispatch = useDispatch();


  useEffect(() => {
    setTheme(fioriTheme); // Apply theme globally
    document.body.style.setProperty(
      "background-color",
      ThemingParameters.sapBackgroundColor
    );
  }, [fioriTheme]);
  const navigate = useNavigate();
  const handleProductSwitchClick = () => {
    navigate("/admin");
  };
  const handleLogoClick = () => {
    navigate("/");
  };
  const logout = () => {
    navigate("/");
  };
  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
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
  return (
    <div>
      <div>
        <ShellBar
          logo={
            <img
              alt="SAP Logo"
              src="https://sap.github.io/ui5-webcomponents/images/sap-logo-svg.svg"
            />
          }
          menuItems={
            <>
            
             {companies.map((company) => (
            <MenuItem key={company.id} text={company.name}>
              {company.Branches.map((branch) => (
                <MenuItem key={branch.id} text={branch.name} />
              ))}
            </MenuItem>
          ))}
              </>
            
          }
          notificationsCount="10"
          onContentItemVisibilityChange={function Xs() {}}
          onLogoClick={handleLogoClick}
          onMenuItemClick={function Xs() {}}
          onNotificationsClick={function Xs() {}}
          onProfileClick={logout}
          onSearchButtonClick={function Xs() {}}
          onSearchFieldToggle={function Xs() {}}
          primaryTitle="Company"
          profile={
            <Avatar>
              <img
                alt="person-placeholder"
                src="https://thumbs.dreamstime.com/b/logout-glassy-cyan-blue-round-button-isolated-abstract-illustration-97912713.jpg"
              />
            </Avatar>
          }
          searchField={
            <ShellBarSearch placeholder="Search Apps, Products" showClearIcon />
          }
          showNotifications
          onProductSwitchClick={handleProductSwitchClick}
          showProductSwitch
          startButton={
            <Select
              onChange={(e) => setFioriTheme(e.target.value)}
              value={fioriTheme}
              style={{ width: "150px", marginLeft: "1rem" }}
            >
              <Option value="sap_fiori_3">Fiori 3</Option>
              <Option value="sap_fiori_3_dark">Fiori 3 Dark</Option>
              <Option value="sap_fiori_3_hcb">Fiori 3 HCB</Option>
              <Option value="sap_horizon">Horizon</Option>
              <Option value="sap_horizon_dark">Horizon Dark</Option>
            </Select>
          }
        >
        
          <ShellBarItem icon="sys-help" text="Help" />
        </ShellBar>
      </div>
    </div>
  );
};

export default Header;
