import { FlexBox, Page } from '@ui5/webcomponents-react'
import React, { useState } from 'react'
import TopNav from '../../Components/Header/TopNav'
import UserSideBar from '../../Components/SideBar/UserSideNav'
import { Outlet } from 'react-router-dom'

const UserMainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
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
        <TopNav />
        <FlexBox>
          {/* <UserSideBar collapsed={collapsed} setCollapsed={setCollapsed}/> */}
          <Outlet />
        </FlexBox>
      {/* </Page> */}
    </>
  )
}

export default UserMainLayout
