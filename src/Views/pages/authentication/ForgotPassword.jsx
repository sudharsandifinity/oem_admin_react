import { Link, useNavigate } from "react-router-dom";

import ForgotPasswordForm from "../auth-forms/ForgotPasswordForm";

import AuthFooter from "./AuthFooter";
import {
  Button,
  Card,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxDirection,
  Input,
  Label,
  Page,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import logo from "../../../assets/Image/hamtinfotech-logo.webp";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import bgImage from "../../../assets/Image/oem-bg.png";

import { forgotPassword } from "../../../store/slices/authSlice";
import AuthCardWrapper from "./AuthCardWrapper";

// ================================|| AUTH3 - LOGIN ||================================ //

export default function ForgotPassword() {
  const { error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forgotStatus, forgotMessage } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const res = dispatch(forgotPassword(email));

      console.log(res);
      //if (res.payload.message !== "Login successful") {
        navigate("/");
      //}
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page
      backgroundDesign="Transparent"
      style={{
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <FlexBox
        alignItems="Center"
        direction="Row"
        justifyContent="End"
        wrap="NoWrap"
        style={{
          height: "100%",
        }}
      >
        <Card
          style={{
            width: "500px",
            opacity: "0.9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: "80px",
                width: "280px",
                marginTop: "30px",
              }}
            >
              <img
                style={{
                  height: "100%",
                  width: "100%",
                }}
                alt="HLB-log"
                src={logo}
              />
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: "400px",
              margin: "auto",
              marginTop: "2rem",
              padding: "1rem",
            }}
          >
            <FlexBox
              direction={FlexBoxDirection.Column}
              alignItems={FlexBoxAlignItems.Center}
            >
              <Label for="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="Email"
                placeholder="Enter your email"
                required
                onInput={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <Button
                type="Submit"
                design="Emphasized"
                disabled={forgotStatus === "loading"}
                style={{
                  width: "100%",
                  backgroundColor: "#005a77",
                  marginTop: "20px",
                  opacity: forgotStatus === "loading" ? 0.8 : 1,
                }}
              >
                {forgotStatus === "loading" ? (
                  <BusyIndicator
                    active
                    delay={0}
                    size="S"
                    style={{ color: "white" }}
                  />
                ) : (
                  "Sent Mail"
                )}
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
                    navigate("/login");
                  }}
                >
                  Login?
                </Link>
              </FlexBox>
            </FlexBox>
          </form>
        </Card>
      </FlexBox>
    </Page>
  );
}
