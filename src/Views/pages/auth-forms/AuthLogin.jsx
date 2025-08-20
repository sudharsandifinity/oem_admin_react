import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// material-ui

// assets

// redux slice
import { login } from "../../../store/slices/authSlice";
import {
  BusyIndicator,
  Button,
  Card,
  CheckBox,
  FlexBox,
  FormItem,
  Icon,
  Input,
  Label,
  MessageStrip,
  Title,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
} from "@ui5/webcomponents-react";

export default function AuthLogin() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("authlogintoken", token);
    if (token) {
      navigate("/UserDashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(login(credentials));
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

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
            padding: "2rem",
            width: "400px",
            borderRadius: "1rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <FlexBox
            direction="Column"
            alignItems="Center"
            style={{ marginBottom: "1.5rem" }}
          >
            {/* <Title
              level="H1"
              style={{
                fontSize: "1.2rem",
                fontWeight: "200",
                color: "black",
                letterSpacing: "0.5px",
                fontFamily: "72, Arial, sans-serif",
                borderBottom: "3px solid rgb(13, 13, 14)", // Underline
                display: "inline-block", // Keeps underline to text width
                margin: "0.6rem",
              }}
            >
              OEM
            </Title> */}
            <img
              width={"50px"}
              alt="person-placeholder"
              src="https://cdn.vectorstock.com/i/2000v/40/54/oem-original-equipment-manufacturing-vector-45464054.avif"
            />
            <Title
              level="H5"
              style={{
                fontSize: "1rem",
                color: "#7e57c2",
                marginBottom: "0.25rem",
                marginTop: "1rem",
              }}
            >
              Hi, Welcome Back
            </Title>
            <span
              style={{
                fontSize: "1rem",
                color: "#6a6d70",
                fontFamily: "72, Arial, sans-serif",
              }}
            >
              Enter your credentials to continue
            </span>
          </FlexBox>

          {error && (
            <MessageStrip design="Negative" style={{ marginBottom: "1rem" }}>
              {error}
            </MessageStrip>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: "400px",
              margin: "auto",
              marginTop: "4rem",
              padding: "1rem",
            }}
          >
            <FlexBox
              direction={FlexBoxDirection.Column}
              alignItems={FlexBoxAlignItems.Center}
            >
              <Title level="H4">Sign in</Title>

              <Label for="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="Email"
                placeholder="Enter your email"
                required
                onInput={(e) =>
                  handleChange({
                    target: { name: "email", value: e.target.value },
                  })
                }
                style={{ width: "100%", marginBottom: "1rem" }}
              />

              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="Password"
                placeholder="Enter your password"
                required
                onInput={(e) =>
                  handleChange({
                    target: { name: "password", value: e.target.value },
                  })
                }
                icon={<Icon name={showPassword ? "hide" : "show"} />}
                onIconClick={() => setShowPassword(!showPassword)}
                showIcon
                style={{ width: "100%", marginBottom: "1rem" }}
              />

              <CheckBox
                name="remember"
                text="Remember me"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                style={{ alignSelf: "flex-start", marginBottom: "1rem" }}
              />

              <Button
                type="Submit"
                design="Emphasized"
                style={{ width: "100%" }}
              >
                Sign In
              </Button>

              <FlexBox
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                <Link
                  href="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot password?
                </Link>
                <Link href="#">Don't have an account? Sign Up</Link>
              </FlexBox>
            </FlexBox>
          </form>
        </Card>
      </FlexBox>
  );
}
