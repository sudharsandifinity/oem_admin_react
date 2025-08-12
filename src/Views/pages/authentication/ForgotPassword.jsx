import { Link } from 'react-router-dom';


import ForgotPasswordForm from '../auth-forms/ForgotPasswordForm'

import AuthFooter from './AuthFooter';
import { Card, FlexBox, Text, Title } from '@ui5/webcomponents-react';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function ForgotPassword() {

  return (
    <FlexBox direction="Column" style={{ minHeight: '100vh', justifyContent: 'space-between' }}>
      {/* Centered content block */}
      <FlexBox
        direction="Column"
        style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
      >
        <Card
          style={{
            padding: '2rem',
            width: '400px',
            boxShadow: 'var(--sapContent_Shadow1)',
          }}
        >
          <FlexBox direction="Column" style={{ gap: '1.5rem', alignItems: 'center' }}>
            <img 
             width={"50px"}
                alt="person-placeholder"
                src="https://cdn.vectorstock.com/i/2000v/40/54/oem-original-equipment-manufacturing-vector-45464054.avif"
              />

            <FlexBox direction="Column" style={{ alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
              <Title level="H3">Forgot password?</Title>
              <Text>
                Enter your email address below and we'll send you a password reset link.
              </Text>
            </FlexBox>

            {/* Form Block */}
            <ForgotPasswordForm />
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
