import { FlexBox, Page } from '@ui5/webcomponents-react'
import React, { useEffect, useState } from 'react'
import TopNav from '../../Components/Header/TopNav'
import UserSideBar from '../../Components/SideBar/UserSideBar'
import { Outlet, useLocation } from 'react-router-dom'

const UserMainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

 useEffect(() => {
  if (location.pathname != "/dashboard") {
    setCollapsed(true);
  }
}, [location.pathname]);

  return (
    <>
      <style>
        {`
          ui5-page::part(content) {
            padding: 0px;
          }
        `}
      </style>
      {/* <Page
        backgroundDesign="Solid"
        style={{
          height: '650px'
        }}
      > */}
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed}/>
        <FlexBox>
          <UserSideBar collapsed={collapsed} setCollapsed={setCollapsed}/>
          <Outlet />
        </FlexBox>
      {/* </Page> */}
    </>
  )
}

export default UserMainLayout
