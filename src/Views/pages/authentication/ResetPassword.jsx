import { Link } from 'react-router-dom';



// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import ResetPasswordForm from '../auth-forms/ResetPasswordForm'

import Logo from 'ui-component/Logo';
import AuthFooter from './AuthFooter';
import { Card, FlexBox, Title } from '@ui5/webcomponents-react';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function ResetPassword() {

  return (
    <FlexBox direction="Column" style={{ minHeight: '100vh', justifyContent: 'space-between' }}>
      {/* Centered section */}
      <FlexBox
        direction="Column"
        style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
      >
        <Card
          style={{
            padding: '2rem',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--sapContent_Shadow1)',
          }}
        >
          <FlexBox direction="Column" style={{ alignItems: 'center', gap: '1rem' }}>
            {/* Logo / Title */}
            <Link style={{ textDecoration: 'none' }}>
              <Title level="H2">OEM</Title>
            </Link>

            {/* Subtitle */}
            <FlexBox direction="Column" style={{ alignItems: 'center' }}>
              <Title level="H3">Reset Password</Title>
            </FlexBox>

            {/* Form Section */}
            <ResetPasswordForm />
          </FlexBox>
        </Card>
      </FlexBox>

      {/* Footer */}
      <FlexBox style={{ padding: '1.5rem', justifyContent: 'center' }}>
        <AuthFooter />
      </FlexBox>
    </FlexBox>
  );
}
