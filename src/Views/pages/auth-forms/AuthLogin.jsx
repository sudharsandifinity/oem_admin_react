// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../../../store/slices/authSlice";
// import {
//   BusyIndicator,
//   Button,
//   Card,
//   CheckBox,
//   FlexBox,
//   FormItem,
//   Icon,
//   Input,
//   Label,
//   MessageStrip,
//   Title,
//   FlexBoxDirection,
//   FlexBoxAlignItems,
//   FlexBoxJustifyContent,
// } from "@ui5/webcomponents-react";
// import logo from "../../../assets/Image/HLB-logo.png";
// import outlinelogo from "../../../assets/Image/HLB-Hamt-Logo-outline-01 (1).svg";
// import bgImage from "../../../assets/Image/oem-bg.png";

// export default function AuthLogin() {
//   const dispatch = useDispatch();
//   const { error } = useSelector((state) => state.auth);

//   const [showPassword, setShowPassword] = useState(false);
//   const [credentials, setCredentials] = useState({
//     email: "",
//     password: ""
//   });
//   const navigate = useNavigate();
//   const { token } = useSelector((state) => state.auth);

//   useEffect(() => {
//     console.log("authlogintoken", token);
//     if (token) {
//       navigate("/UserDashboard");
//     }
//   }, [token, navigate]);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await dispatch(login(credentials));
//       console.log(res);
//        if (res.payload.message !== "Login successful") {
//         navigate("/");
//       } 
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
   
//       <FlexBox
//         style={{
//           display: "flex",
//           height: "97vh",
//           fontFamily: "Segoe UI, sans-serif",
//           // background: "#005a77",
//             backgroundImage: {bgImage},

//         }}
//       >

//         {/* Right Section */}
//         <FlexBox
//           style={{
//             flex: 1,
//             //background: "#080808ff",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: "2rem",
//             textAlign: "center",
//           }}
//         >
//         </FlexBox>
//         <Card
//           style={{
//             padding: "2rem",
//             width: "400px",
//             borderRadius: "1rem",
//             boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//             background: "#4d8ba0",
//           }}
//         >
//           <FlexBox
//             direction="Column"
//             alignItems="Center"
//             style={{ marginBottom: "1.5rem" }}
//             backgroundColor="#d9e6eb"
//           >
//             <img
//               width={"50px"}
//               style={{margin:"1rem"}}
//               alt="person-placeholder"
//               //src="https://cdn.vectorstock.com/i/2000v/40/54/oem-original-equipment-manufacturing-vector-45464054.avif"
//             src={logo} 
//             />
//             <Title
//               level="H5"
//               style={{
//                 fontSize: "1rem",
//                 color: "#7e57c2",
//                 marginBottom: "0.25rem",
//                 marginTop: "1rem",
//               }}
//             >
//               Hi, Welcome Back
//             </Title>
//             <span
//               style={{
//                 fontSize: "1rem",
//                 color: "#6a6d70",
//                 fontFamily: "72, Arial, sans-serif",
//               }}
//             >
//               Enter your credentials to continue
//             </span>
//           </FlexBox>

//           {error && (
//             <MessageStrip design="Negative" style={{ marginBottom: "1rem" }}>
//               {error}
//             </MessageStrip>
//           )}

//           <form
//             onSubmit={handleSubmit}
//             style={{
//               maxWidth: "400px",
//               margin: "auto",
//               marginTop: "2rem",
//               padding: "1rem",
//             }}
//           >
//             <FlexBox
//               direction={FlexBoxDirection.Column}
//               alignItems={FlexBoxAlignItems.Center}
//             >
//               <Title level="H4">Sign in</Title>
//               <br></br>
//               <Label for="email">Email Address</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="Email"
//                 placeholder="Enter your email"
//                 required
//                 onInput={(e) =>
//                   handleChange({
//                     target: { name: "email", value: e.target.value },
//                   })
//                 }
//                 style={{ width: "100%", marginBottom: "1rem" }}
//               />

//               <Label for="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "Text" : "Password"}
//                 placeholder="Enter your password"
//                 required
//                 onInput={(e) =>
//                   handleChange({
//                     target: { name: "password", value: e.target.value },
//                   })
//                 }
//                 icon={<Icon name={showPassword ? "hide" : "show"} onClick={()=>setShowPassword(!showPassword)}/>}
//                 showIcon
//                 style={{ width: "100%", marginBottom: "1rem" }}
//               />
//               <Button
//                 type="Submit"
//                 design="Emphasized"
//                 style={{ width: "100%" }}
//               >
//                 Sign In
//               </Button>

//               <FlexBox
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   width: "100%",
//                   marginTop: "1rem",
//                 }}
//               >
//                 <Link
//                   href="/forgot-password"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     navigate("/forgot-password");
//                   }}
//                 >
//                   Forgot password?
//                 </Link>
//               </FlexBox>
//             </FlexBox>
//           </form>
//         </Card>
//       </FlexBox>
//   );
// }


import { Button, Card, CardHeader, FlexBox, Icon, Input, Label, Link, List, ListItemStandard, MessageStrip, Page, TextAlign, Title } from '@ui5/webcomponents-react'
import bgImage from "../../../assets/Image/oem-bg.png";
import logo from "../../../assets/Image/HLB-Hamt-Logo.svg";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../store/slices/authSlice';

const AuthLogin = () => {

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

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
                height: '80px',
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
                  style={{ width: "100%", backgroundColor: '#005a77', marginTop: '20px' }}
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

