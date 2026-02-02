import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxDirection,
  Input,
  Label,
  Page,
  Title,
  BusyIndicator,
  MessageStrip,
} from "@ui5/webcomponents-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import logo from "../../../assets/Image/hamtinfotech-logo.webp";
import bgImage from "../../../assets/Image/oem-bg.png";
import { changePassword } from "../../../store/slices/authSlice";

// 👉 import your redux action
// import { changePassword } from "../../../store/slices/authSlice";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { changePasswordStatus, changePasswordError } = useSelector(
    (state) => state.auth,
  );

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setValidationError("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setValidationError(
        "New password and confirm password do not match",
      );
    }

    if (currentPassword === newPassword) {
      return setValidationError(
        "New password must be different from current password",
      );
    }
const payload = {currentPassword: currentPassword, newPassword: newPassword, confirmPassword:confirmPassword}
    // ✅ Dispatch change password action
      dispatch(changePassword(payload)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
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
        style={{ height: "100%" }}
      >
        <Card style={{ width: "500px", opacity: 0.95 }}>
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
            <Title level="H4" style={{ marginBottom: "1rem" }}>
              Change Password
            </Title>

            {(validationError || changePasswordError) && (
              <MessageStrip design="Negative" style={{ marginBottom: "1rem" }}>
                {validationError || changePasswordError}
              </MessageStrip>
            )}

            <FlexBox direction={FlexBoxDirection.Column}
            alignItems={FlexBoxAlignItems.Start}>
              <Label>Current Password</Label>
              <Input
                type="Password"
                value={form.currentPassword}
                onInput={(e) => handleChange(e, "currentPassword")}
                required
                style={{ width: "100%", marginBottom: "1rem" }}
              />

              <Label>New Password</Label>
              <Input
                type="Password"
                value={form.newPassword}
                onInput={(e) => handleChange(e, "newPassword")}
                required
                style={{ width: "100%", marginBottom: "1rem" }}
              />

              <Label>Confirm New Password</Label>
              <Input
                type="Password"
                value={form.confirmPassword}
                onInput={(e) => handleChange(e, "confirmPassword")}
                required
                style={{ width: "100%", marginBottom: "1rem" }}
              />

              <Button
                type="Submit"
                design="Emphasized"
                disabled={changePasswordStatus === "loading"}
                style={{ marginTop: "1rem" }}
              >
                {changePasswordStatus === "loading" ? (
                  <BusyIndicator active size="S" />
                ) : (
                  "Update Password"
                )}
              </Button>

              <Link
                href="/login"
                style={{ marginTop: "1rem", textAlign: "center" }}
                onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
              >
                Back to Login
              </Link>
            </FlexBox>
          </form>
        </Card>
      </FlexBox>
    </Page>
  );
}
