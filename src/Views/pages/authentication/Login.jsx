import { Link } from 'react-router-dom';


// project imports
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';

import AuthFooter from './AuthFooter';
import { Card, FlexBox, Text, Title } from '@ui5/webcomponents-react';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function Login() {

  return (
    <FlexBox
      direction="Column"
      style={{ minHeight: "100vh", justifyContent: "space-between" }}
    >
      {/* --------------- CENTER wrapper ---------------------------------- */}
      <FlexBox
        direction="Column"
        justifyContent="Center"
        alignItems="Center"
        style={{ minHeight: "calc(100vh - 68px)" }} /* leave 68px if you had a top bar */
      >
        <AuthCardWrapper>
          <Card
            style={{
              padding: "2rem",
              maxWidth: "420px",
              width: "100%"
            }}
          >
            {/* --- Logo / OEM title ------------------------------------- */}
            <FlexBox
              direction="Column"
              alignItems="Center"
              style={{ marginBottom: "2rem" }}
            >
              <Link
                href="#"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Title level="H2">OEM</Title>
              </Link>
            </FlexBox>

            {/* --- Welcome text ---------------------------------------- */}
            <FlexBox
              direction="Column"
              alignItems="Center"
              style={{ gap: "0.25rem", marginBottom: "1.5rem" }}
            >
              <Title level="H3" style={{ color: "var(--sapTextColor)" }}>
                Hi, Welcome Back
              </Title>
              <Text style={{ fontSize: "16px", textAlign: "center" }}>
                Enter your credentials to continue
              </Text>
            </FlexBox>

            {/* --- Login form component -------------------------------- */}
            <AuthLogin />
          </Card>
        </AuthCardWrapper>
      </FlexBox>

      {/* --------------- Footer ---------------------------------------- */}
      <div style={{ padding: "1.5rem" }}>
        <AuthFooter />
      </div>
    </FlexBox>
  );
}
