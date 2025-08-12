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
} from "@ui5/webcomponents-react";

export default function AuthLogin() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
    <>
      {console.log("error", error)}
      {error && (
        <MessageStrip
          design="Negative" // For "error" severity
          hideCloseButton={false}
          hideIcon={false}
          style={{ marginBottom: "1rem" }}
        >
          {error.message}
        </MessageStrip>
      )}
      <FlexBox
        direction="Column"
        justifyContent="Center"
        alignItems="Center"
        style={{ height: "90vh", backgroundColor: "#f3f6f9" }}
      >
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
              style={{ fontSize: "1rem",color: "#7e57c2", marginBottom: "0.25rem",marginTop:"1rem" }}
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

          <FlexBox direction="Column" style={{ width: "100%", gap: "0.5rem" }}>
            {/* Email Row */}
            <FlexBox
              direction="Column"
              alignItems="Center"
              style={{ gap: "0.5rem" }}
            >
              <Input
                style={{ width: "80%" }}
                type="Email"
                value={credentials.email}
                name="email"
                placeholder="Enter email"
                onInput={(e) =>
                  handleChange({
                    target: { name: "email", value: e.target.value },
                  })
                }
              />
            </FlexBox>

            {/* Password Row */}
            <FlexBox
              direction="Column"
              alignItems="Center"
              style={{ gap: "1rem" }}
            >
              <Input
                style={{ width: "80%" }}
                type={showPassword ? "Text" : "Password"}
                value={credentials.password}
                name="password"
                placeholder="Enter password"
                onInput={(e) =>
                  handleChange({
                    target: { name: "password", value: e.target.value },
                  })
                }
                icon={<Icon name={showPassword ? "hide" : "show"} />}
                onIconClick={() => setShowPassword(!showPassword)}
                showIcon
              />
            </FlexBox>
          </FlexBox>

          <FlexBox
            justifyContent="SpaceBetween"
            alignItems="Center"
            style={{
              marginLeft: "2rem",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
            direction="Row"
          >
            <CheckBox
              text="Keep me logged in"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          
            <Link
              href="/forgot-password"
              design="Emphasized"
              style={{ textDecoration: "none", marginRight: "2rem" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Forgot Password?
            </Link>{" "}
          </FlexBox>

          <FlexBox alignItems="Center">
            <Button
              design="Emphasized"
              disabled={status === "loading"}
              onClick={handleSubmit} // Replace with your form submit handler
              style={{
                width: "80%",
                marginLeft: "2.5rem",
                marginBottom: "2rem",
              }}
            >
              {status === "loading" ? (
                <BusyIndicator size="Small" active />
              ) : (
                "Sign In"
              )}
            </Button>
          </FlexBox>
        </Card>
      </FlexBox>
    </>
  );
}
