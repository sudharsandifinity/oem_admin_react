import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// material-ui

// project imports

// redux slice
import { forgotPassword } from "../../../store/slices/authSlice";
import { AnimatedUI5Button } from "./AnimatedUI5Button";
import {
  BusyIndicator,
  Button,
  FlexBox,
  FormItem,
  Input,
  Label,
  MessageStrip,
} from "@ui5/webcomponents-react";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forgotStatus, forgotMessage } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <>
      {forgotStatus !== "succeeded" && forgotMessage && (
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
          style={{ marginBottom: "1rem" }}
        >
          {forgotMessage.message}
        </MessageStrip>
      )}

      {forgotStatus === "succeeded" && (
        <MessageStrip
          design="Positive"
          hideCloseButton={false}
          hideIcon={false}
          style={{ marginBottom: "1rem" }}
        >
          {forgotMessage}
        </MessageStrip>
      )}
      <form onSubmit={handleSubmit}>
       
         
          <FlexBox direction="Column" style={{ width: "100%", gap: "0.5rem" }}>
            {/* Email Row */}
            <FlexBox
              direction="Column"
              alignItems="Center"
              style={{ gap: "0.5rem" }}
            >
              <Input
                style={{ width: "100%" }}
                type="Email"
                value={email}
                name="email"
                required
                onInput={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
               
              />
            </FlexBox>
          </FlexBox>

        <FlexBox
          justifyContent="SpaceBetween"
          alignItems="Center"
          style={{ marginBottom: "1rem" }}
        >
          <div /> {/* Empty left grid equivalent */}
          <Link
            href="/login"
            design="Emphasized" // Optional for styling
            style={{ textDecoration: "none" }}
            onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
          >
            Login?
          </Link>
        </FlexBox>

        <FlexBox
          direction="Column"
          alignItems="Center"
          justifyContent="Center"
          style={{ marginTop: "1rem", width: "80%" }}
        >
          <Button
            design="Emphasized"
            type="Submit"
            disabled={forgotStatus === "loading"}
            //style={{ width: "80%" }}
          >
            {forgotStatus === "loading" ? (
              <BusyIndicator active size="Small" />
            ) : (
              "Sent Mail"
            )}
          </Button>
        </FlexBox>
      </form>
    </>
  );
}
