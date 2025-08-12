import { Link, useNavigate } from 'react-router-dom';


import AuthRegister from '../auth-forms/AuthRegister';

import Logo from 'ui-component/Logo';
import AuthFooter from './AuthFooter';
import { Card, FlexBox, Text, Title } from '@ui5/webcomponents-react';

export default function Register() {
const navigate = useNavigate();

  return (
    <FlexBox
      direction="Column"
      style={{ minHeight: '100vh', justifyContent: 'space-between', padding: '1rem' }}
    >
      {/* Main Centered Content */}
      <FlexBox
        direction="Column"
        alignItems="Center"
        justifyContent="Center"
        style={{ flex: '1 0 auto', minHeight: 'calc(100vh - 68px)' }}
      >
        <Card style={{ padding: '2rem', maxWidth: '480px', width: '100%' }}>
          {/* Logo */}
          <FlexBox justifyContent="Center" style={{ marginBottom: '1rem' }}>
            <Link onClick={() => navigate('#')}>
              <Logo />
            </Link>
          </FlexBox>

          {/* Headings */}
          <FlexBox direction="Column" alignItems="Center" style={{ marginBottom: '1rem' }}>
            <Title level="H2">Sign Up</Title>
            <Text style={{ fontSize: '16px' }}>
              Enter your details to continue
            </Text>
          </FlexBox>

          {/* Registration Form */}
          <AuthRegister />

          {/* Divider */}

          {/* Already have account */}
          <FlexBox justifyContent="Center">
            <Link
              style={{ textDecoration: 'none', fontSize: '14px' }}
              onClick={() => navigate('/pages/login')}
            >
              Already have an account?
            </Link>
          </FlexBox>
        </Card>
      </FlexBox>

      {/* Footer */}
      <div style={{ padding: '0 1rem', marginTop: '1rem' }}>
        <AuthFooter />
      </div>
    </FlexBox>
  );
}
