import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AnimatedUI5Button } from './AnimatedUI5Button';
import { Button, CheckBox, FlexBox, FormItem, Icon, Input, Label, Title } from '@ui5/webcomponents-react';

// ===========================|| JWT - REGISTER ||=========================== //

export default function AuthRegister() {

  
 const [showPwd, setShowPwd] = useState(false);
  const [checked, setChecked] = useState(false);

  const togglePwd = () => setShowPwd((p) => !p);
  const handleClickShowPassword = () => {
    setShowPwd(!showPwd);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FlexBox
      direction="Column"
      alignItems="Center"
      style={{ maxWidth: "480px", margin: "auto", gap: "1.5rem" }}
    >
      {/* Heading */}
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ marginBottom: "0.5rem" }}
      >
        <Title level="H4">Sign up with Email address</Title>
      </FlexBox>

      {/* First / Last name row */}
      <FlexBox
        direction="Row"
        wrap="Wrap"
        style={{ gap: "1rem", width: "100%" }}
      >
        <FormItem label={<Label required>First Name</Label>} style={{ flex: "1 1 48%" }}>
          <Input
            placeholder="First Name"
            value="Jhones"
            name="firstName"
          />
        </FormItem>

        <FormItem label={<Label required>Last Name</Label>} style={{ flex: "1 1 48%" }}>
          <Input
            placeholder="Last Name"
            value="Doe"
            name="lastName"
          />
        </FormItem>
      </FlexBox>

      {/* Email */}
      <FormItem label={<Label required>Email Address / Username</Label>} style={{ width: "100%" }}>
        <Input
          type="Email"
          placeholder="Enter email"
          value="jones@doe.com"
          name="email"
        />
      </FormItem>

      {/* Password with eye toggle */}
      <FormItem label={<Label required>Password</Label>} style={{ width: "100%" }}>
        <Input
          type={showPwd ? "Text" : "Password"}
          placeholder="Enter password"
          value="Jhones@123"
          name="password"
          showIcon
          icon={<Icon name={showPwd ? "hide" : "show"} />}
          onIconClick={togglePwd}
        />
      </FormItem>

      {/* Terms & Conditions */}
      <FlexBox justifyContent="Start" style={{ width: "100%" }}>
        <CheckBox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          text={
            <>
              Agree with&nbsp;
              <Link href="#" design="Emphasized">
                Terms &amp; Condition
              </Link>
              .
            </>
          }
        />
      </FlexBox>

      {/* Sign‑up button */}
      <Button design="Emphasized" style={{ width: "100%" }} onClick={() => {/* submit */}}>
        Sign up
      </Button>
    </FlexBox>
  );
}
