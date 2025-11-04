import { BusyIndicator, Button, Card, CardHeader, FlexBox, Icon, Input, Label, Link, List, ListItemStandard, MessageStrip, Page, TextAlign, Title } from '@ui5/webcomponents-react'
import bgImage from "../../../assets/Image/oem-bg.png";
import logo from "../../../assets/Image/hamtinfotech-logo.webp";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../store/slices/authSlice';

const AuthLogin = () => {

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

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
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = dispatch(login(credentials));
        console.log(res);
        if (res.payload.message !== "Login successful") {
          navigate("/");
      } 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page
      backgroundDesign="Transparent"
      style={{
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <FlexBox
        alignItems="Center"
        direction="Row"
        justifyContent="End"
        wrap="NoWrap"
        style={{
          height: '100%'
        }}
      >
        <Card
          style={{
            width: '500px',
            opacity: '0.9'
          }}
        >
        <div 
          style={{
                display: 'flex',
                justifyContent: 'center',
              }}
        >
          <div
              style={{
                height: '80px',
                width: '280px',
                marginTop: '30px'
              }}
            >
            <img
              style={{
                height: '100%',
                width: '100%'
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
                padding: "1rem",
                paddingBottom: '50px',
                marginTop: '20px'
              }}
            >
              <FlexBox
                direction="Column"
              >
                 {error && (
            <MessageStrip design="Negative" style={{ marginBottom: "1rem" }}>
              {error}
            </MessageStrip>
          )}
                {/* <Title level="H4" style={{textAlign: 'center', marginBottom: '15px', marginTop: '25px'}}>Sign in</Title> */}
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
                  type={showPassword ? "Text" : "Password"}
                  placeholder="Enter your password"
                  required
                  onInput={(e) =>
                  handleChange({
                      target: { name: "password", value: e.target.value },
                    })
                  }
                  icon={<Icon name={showPassword ? "hide" : "show"} onClick={()=>setShowPassword(!showPassword)}/>}
                  showIcon
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
                <Button
                  type="Submit"
                  design="Emphasized"
                  disabled={loading}
                  style={{
                    width: "100%",
                    backgroundColor: '#005a77',
                    marginTop: '20px',
                    opacity: loading ? 0.8 : 1
                  }}
                >
                  {loading ?   <BusyIndicator
                      active
                      delay={0}
                      size="S"
                      style={{color: 'white'}}
                    /> : "Submit"}
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
                  >
                    Forgot password?
                  </Link>
                </FlexBox>
              </FlexBox>
            </form>
        </Card>
      </FlexBox>
    </Page>
  )
}

export default AuthLogin

