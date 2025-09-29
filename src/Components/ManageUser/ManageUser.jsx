import actionSettingsIcon from '@ui5/webcomponents-icons/dist/action-settings.js';
import { ThemingParameters } from "@ui5/webcomponents-react-base";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import paletteIcon from '@ui5/webcomponents-icons/dist/initiative.js';
import { logout } from "../../store/slices/authSlice";

import {
  MessageBox,
  Text,
  UserMenu,
  UserMenuAccount,
  UserMenuItem
} from '@ui5/webcomponents-react';

import { forwardRef, useEffect, useState } from 'react';
import avatarPng from '../../assets/Image/no-profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const ManageUser = forwardRef((props, ref) => {
  const { open, setOpen } = props;

  const [accountsLoading, setAccountsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('0');
  const [messageBoxOpen, setMessageBoxOpen] = useState(false);
    const [fioriTheme, setFioriTheme] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

  const handleChangeAccount = (e) => {
    setAccountsLoading(true);
    setTimeout(() => {
      const key = e.detail.selectedAccount.dataset.key;
      setSelectedAccount(key);
      setAccountsLoading(false);
    }, 1000);
  };

  const handleSignOutClick = (e) => {
    e.preventDefault();
    setMessageBoxOpen(true);
  };

  const handleMessageBoxClose = (e) => {
    if (e === 'OK') {
      console.log('Signed out!');
      dispatch(logout());
      localStorage.removeItem("token");
      setOpen(false);
      navigate("/", { replace: true });
    }
    setMessageBoxOpen(false);
  };

  const handleSettingsClick = () => {
    setUserSettingsOpen(true);
  };

    useEffect(() => {
    if (fioriTheme) {
      setTheme(fioriTheme);
      document.body.style.setProperty(
        'background-color',
        ThemingParameters.sapBackgroundColor
      );
    }
  }, [fioriTheme]);

  return (
    <>
      <UserMenu
        ref={ref}
        open={open}
        onClose={() => setOpen(false)}
        onAvatarClick={() => console.log('Avatar clicked!')}
        onEditAccountsClick={() => console.log('Edit Account clicked!')}
        onChangeAccount={handleChangeAccount}
        onSignOutClick={handleSignOutClick}
        accounts={
          <>
            <UserMenuAccount
              loading={accountsLoading}
              avatarSrc={avatarPng}
              titleText={user.first_name+' '+user.last_name}
              subtitleText={user.email}
              description={user.Roles[0].name}
              data-key="0"
              selected={selectedAccount === '0'}
            />
            <UserMenuAccount
              loading={accountsLoading}
              avatarInitials="JW"
              titleText="John Walker"
              subtitleText="john.walker@sap.com"
              description="Project Manager"
              data-key="1"
              selected={selectedAccount === '1'}
            />
            <UserMenuAccount
              loading={accountsLoading}
              avatarInitials="DS"
              titleText="David Wilson"
              subtitleText="david.wilson@sap.com"
              description="Project Manager"
              data-key="2"
              selected={selectedAccount === '2'}
            />
          </>
        }
      >
        <UserMenuItem icon={actionSettingsIcon} text="Setting" data-id="setting" onClick={handleSettingsClick} />
         <UserMenuItem icon={paletteIcon} text="Theme">
          <UserMenuItem text="Fiori 3" onClick={() => setFioriTheme('sap_fiori_3')} />
          <UserMenuItem text="Fiori 3 Dark" onClick={() => setFioriTheme('sap_fiori_3_dark')} />
          <UserMenuItem text="Fiori 3 HCB" onClick={() => setFioriTheme('sap_fiori_3_hcb')} />
          <UserMenuItem text="Horizon" onClick={() => setFioriTheme('sap_horizon')} />
          <UserMenuItem text="Horizon Dark" onClick={() => setFioriTheme('sap_horizon_dark')} />
        </UserMenuItem>
      </UserMenu>

      <MessageBox open={messageBoxOpen} titleText="Sign Out" onClose={handleMessageBoxClose}>
        <Text>Are you sure you want to sign out?</Text>
      </MessageBox>
    </>
  );
});

ManageUser.displayName = 'ManageUser';
export default ManageUser;
