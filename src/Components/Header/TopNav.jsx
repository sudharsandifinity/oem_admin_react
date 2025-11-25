import menu2Icon from "@ui5/webcomponents-icons/dist/menu2.js";
import {
  Avatar,
  Button,
  Option,
  Select,
  ShellBar,
  ShellBarBranding,
  ShellBarSearch,
} from "@ui5/webcomponents-react";

import { useRef, useState } from 'react';
import avatarPng from '../../assets/Image/no-profile.png';
import SapLogoSvg from '../../assets/Image/hamtinfotech-logo.webp';
import ManageUser from '../ManageUser/ManageUser';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCompany, switchCompany } from '../../store/slices/userCompanySlice';

export default function TopNav({
  collapsed,
  setCollapsed,
  selectedCompany,
  setSelectedCompany,
  selectedBranch,
  setSelectedBranch,
  ...rest
}) {
  const userMenuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleMenuBtnClick = () => {
    setCollapsed((prev) => !prev);
  };

  const handleProfileClick = (e) => {
    if (userMenuRef.current) {
      userMenuRef.current.opener = e.detail.targetRef;
      setUserMenuOpen(true);
    }
  };
  const { user } = useSelector((state) => state.auth);
  const companies = user && user.Branches;

  const handleCompanyClick = (companyName) => {
    dispatch(setActiveCompany());
    dispatch(switchCompany({ companyId: companyName }));
    setSelectedCompany(companyName);
  };
  const handleBranchClick = (branchname) => {
    setSelectedBranch(branchname);
  };
  // Remove duplicate companies by Company.id
  const uniqueCompanies = companies
    ? Object.values(
        companies.reduce((acc, item) => {
          acc[item.Company.id] = item.Company; // store only company
          return acc;
        }, {})
      )
    : [];

  // Remove duplicate branches by branch.id
const uniqueBranches = selectedCompany
  ? Object.values(
      companies
        .filter((c) => c.companyId === selectedCompany) // ✔ get only selected company branches
        .reduce((acc, item) => {
          acc[item.id] = { id: item.id, name: item.name }; // ✔ remove duplicates
          return acc;
        }, {})
    )
  : [];
  console.log("selectedCompany",uniqueBranches)

  return (
    <>
      <ShellBar
        {...rest}
        id="shellbar"
        style={{ padding: "0 1rem" }}
        notificationsCount=""
        onProfileClick={handleProfileClick}
        startButton={
          <Button
            id="menu-button"
            icon={menu2Icon}
            style={{ color: collapsed ? "" : "#006d86" }}
            tooltip="Toggle side navigation"
            accessibleName="Toggle side navigation"
            onClick={handleMenuBtnClick}
          />
        }
        branding={
          <ShellBarBranding
            logo={
              <div
                style={{
                  height: "40px",
                  maxHeight: "max-content",
                  maxWidth: "max-content",
                }}
              >
                <img
                  src={SapLogoSvg}
                  alt="SAP Logo"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            }
          ></ShellBarBranding>
        }
        content={
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px",
              marginLeft: "15%",
            }}
          >
            {/* Company Dropdown */}
            <Select
              style={{ width: "100%", minWidth: "250px" }}
              onChange={(e) =>
                handleCompanyClick(e.detail.selectedOption.value)
              }
            >
              <Option value="">Select Company</Option>

              {uniqueCompanies.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>

            {/* Branch Dropdown */}
            <Select
              style={{ width: "100%", minWidth: "250px" }}
              disabled={!selectedCompany}
              onChange={(e) => handleBranchClick(e.detail.selectedOption.value)}
            >
              <Option value="">Select Branch</Option>

              {uniqueBranches.map((branch) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Option>
              ))}
            </Select>
          </div>
        }
        searchField={
          <ShellBarSearch
            id="search-scope"
            showClearIcon
            placeholder="Search"
          ></ShellBarSearch>
        }
        profile={
          <Avatar>
            <img src={avatarPng} alt="User Avatar" />
          </Avatar>
        }
      ></ShellBar>
      <ManageUser
        open={userMenuOpen}
        ref={userMenuRef}
        setOpen={setUserMenuOpen}
      />
    </>
  );
}
