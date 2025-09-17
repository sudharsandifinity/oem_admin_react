import { Link } from 'react-router-dom';


import ForgotPasswordForm from '../auth-forms/ForgotPasswordForm'

import AuthFooter from './AuthFooter';
import { Button, Card, FlexBox, Text, Title } from '@ui5/webcomponents-react';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function ForgotPassword() {

  return (
    <FlexBox
        style={{
          display: "flex",
          height: "100vh",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >

        {/* Right Section */}
        <FlexBox
          style={{
            flex: 1,
            background: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {/* Illustration - Replace with your own if needed */}
          <img
            src="https://tonysourcing.com/wp-content/uploads/2021/11/OEM.jpg"
            alt="MFA illustration"
            style={{ width: "60%", marginBottom: "2rem" }}
          />
          <Title level="H5">MFA for all accounts</Title>
          <FlexBox style={{ maxWidth: "400px", color: "#444", margin: "1rem 0" }}>
            Secure online accounts with OneAuth 2FA. Back up OTP secrets and
            never lose access to your accounts.
          </FlexBox>
          <Button design="Transparent">Learn more</Button>
        </FlexBox>
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
   
  );
}
