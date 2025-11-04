import menu2Icon from '@ui5/webcomponents-icons/dist/menu2.js';

import {
  Avatar,
  Button,
  ShellBar,
  ShellBarBranding,
  ShellBarSearch
} from '@ui5/webcomponents-react';

import { useRef, useState } from 'react';
import avatarPng from '../../assets/Image/no-profile.png';
import SapLogoSvg from '../../assets/Image/hamtinfotech-logo.webp';
import ManageUser from '../ManageUser/ManageUser';

export default function TopNav({ collapsed, setCollapsed, ...rest }) {
  const userMenuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

   const handleMenuBtnClick = () => {
    setCollapsed(prev => !prev);
  };

  const handleProfileClick = (e) => {
    if (userMenuRef.current) {
      userMenuRef.current.opener = e.detail.targetRef;
      setUserMenuOpen(true);
    }
  };
  
  return (
    <>
      <ShellBar
        {...rest}
        id="shellbar"
        style={{padding: '0 1rem'}}
        notificationsCount=""
        onProfileClick={handleProfileClick}
        startButton={
            <Button
              id="menu-button"
              icon={menu2Icon}
              style={{color:collapsed ? '':'#006d86'}}
              tooltip="Toggle side navigation"
              accessibleName="Toggle side navigation"
              onClick={handleMenuBtnClick}
            />
        }
        branding={
          <ShellBarBranding logo={<div style={{height: '40px', maxHeight: 'max-content', maxWidth: 'max-content'}}>
            <img src={SapLogoSvg} alt="SAP Logo" style={{width: '100%', height: '100%'}} />
          </div>}>
          </ShellBarBranding>
        }
        searchField={
          <ShellBarSearch
            id="search-scope"
            showClearIcon
            placeholder="Search"
          >
          </ShellBarSearch>
        }
        profile={
          <Avatar>
            <img src={avatarPng} alt="User Avatar" />
          </Avatar>
        }
      >
      </ShellBar>
      <ManageUser open={userMenuOpen} ref={userMenuRef} setOpen={setUserMenuOpen} />

    </>
  );
}