import {
  Button,
  CheckBox,
  FlexBox,
  Form,
  FormGroup,
  FormItem,
  Grid,
  Icon,
  Input,
  Label,
  Option,
  Select,
  Text,
} from "@ui5/webcomponents-react";
import React, { useState } from "react";
import "@ui5/webcomponents-icons/dist/map.js";

const Logistics = (props) => {
  const { fieldConfig, SalesOrderRenderInput, form, handleChange } = props;
  const [inputvalue, setInputValue] = useState([]);

  return (
    <FlexBox direction="Row" style={{ width: "100%", gap: "1rem" }}>
      <FlexBox direction="Column" style={{ flex: 1}}>
        <label
          style={{
            fontWeight: "bold", // makes text bold
            textAlign: "left", // ensures it can align right
            display: "block", // needed for textAlign to work
          }}
        >
          Ship-to Address
        </label>
        <br></br>
        <FlexBox direction="Column">
          <FlexBox direction="Row">
            <label
              style={{
                // makes text bold
                textAlign: "start", // ensures it can align right
                width: "150px", // ensures label has enough width
                display: "block", // needed for textAlign to work
              }}
            >
              BP Address:
            </label>
            <Select
              onChange={function Xs() {}}
              onClose={function Xs() {}}
              onLiveChange={function Xs() {}}
              onOpen={function Xs() {}}
              valueState="None"
            >
              <Option>Option 1</Option>
              <Option>Option 2</Option>
              <Option>Option 3</Option>
              <Option>Option 4</Option>
              <Option>Option 5</Option>
            </Select>
          </FlexBox>
          <FlexBox direction="Row">
            <label
              style={{
                // makes text bold
                textAlign: "start", // ensures it can align right
                width: "150px", // ensures label has enough width
                display: "block", // needed for textAlign to work
              }}
            >
              Address Summary:
            </label>
            <FlexBox direction="Column">
              <Text>Cavendish Court</Text>
              <Text>Sheffield</Text>
              <Text>S1 2DR</Text>
              <Text>UNITED KINGDON</Text>
              <Button size="small" style={{ width: "10px" }}>
                <Icon name="map"></Icon>
              </Button>
              <br></br>
              <FlexBox direction="Row" style={{ gap: "0.5rem" }}>
                <Button design="Emphasized" style={{ width: "50px" }}>
                  Edit
                </Button>
                <Button design="Transparent">Define now</Button>
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </FlexBox>
        <div
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "var(--sapList_BorderColor)",
            marginTop: "0.5rem",
          }}
        />
        <FlexBox direction="Column">
          <label
            style={{
              fontWeight: "bold", // makes text bold
              textAlign: "start", // ensures it can align right
              display: "block", // needed for textAlign to work
            }}
          >
            Preferences
          </label>
          <br></br>
          <FlexBox direction="Column">
            <FlexBox direction="Row">
              <label
                style={{
                  // makes text bold
                  textAlign: "start", // ensures it can align right
                  display: "block", // needed for textAlign to work
                  width: "150px", // ensures label has enough width
                }}
              >
                Shipping Type:
              </label>
              <Select
                onChange={function Xs() {}}
                onClose={function Xs() {}}
                onLiveChange={function Xs() {}}
                onOpen={function Xs() {}}
                valueState="None"
              >
                <Option>Motor Express</Option>
                <Option>Option 2</Option>
                <Option>Option 3</Option>
                <Option>Option 4</Option>
                <Option>Option 5</Option>
              </Select>
            </FlexBox>
            <FlexBox direction="Row">
              <label
                style={{
                  // makes text bold
                  textAlign: "start", // ensures it can align right
                  width: "150px", // ensures label has enough width
                  display: "block", // needed for textAlign to work
                }}
              >
                Confirmed:
              </label>
              <Select
                onChange={function Xs() {}}
                onClose={function Xs() {}}
                onLiveChange={function Xs() {}}
                onOpen={function Xs() {}}
                valueState="None"
              >
                <Option>Yes</Option>
                <Option>No</Option>
              </Select>
            </FlexBox>
            <FlexBox direction="Row">
              <label
                style={{
                  // makes text bold
                  textAlign: "start", // ensures it can align right
                  width: "150px", // ensures label has enough width
                  display: "block", // needed for textAlign to work
                }}
              >
                Allow Partial Delivery:
              </label>
              <Select
                onChange={function Xs() {}}
                onClose={function Xs() {}}
                onLiveChange={function Xs() {}}
                onOpen={function Xs() {}}
                valueState="None"
              >
                <Option>Yes</Option>
                <Option>No</Option>
              </Select>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </FlexBox>
      <FlexBox direction="Column" style={{ flex: 1 }}>
        <label
          style={{
            fontWeight: "bold", // makes text bold
            textAlign: "left", // ensures it can align right
            display: "block", // needed for textAlign to work
          }}
        >
          Bill to Address
        </label>
        <br></br>
        <FlexBox direction="Row">
          <label
            style={{
              // makes text bold
              textAlign: "start", // ensures it can align right
              width: "150px", // ensures label has enough width
              display: "block", // needed for textAlign to work
            }}
          >
            BP Address:
          </label>
          <Select
            onChange={function Xs() {}}
            onClose={function Xs() {}}
            onLiveChange={function Xs() {}}
            onOpen={function Xs() {}}
            valueState="None"
          >
            <Option>Bill To</Option>
            <Option>Option 2</Option>
            <Option>Option 3</Option>
            <Option>Option 4</Option>
            <Option>Option 5</Option>
          </Select>
        </FlexBox>
        <FlexBox direction="Row">
          <label
            style={{
              // makes text bold
              textAlign: "start", // ensures it can align right
              width: "150px", // ensures label has enough width
              display: "block", // needed for textAlign to work
            }}
          >
            Address Summary:
          </label>
          <FlexBox direction="Column">
            <Text>Cavendish Court</Text>
            <Text>Sheffield</Text>
            <Text>S1 2DR</Text>
            <Text>UNITED KINGDON</Text>
            <Button size="small" style={{ width: "10px" }}>
              <Icon name="map"></Icon>
            </Button>
            <br></br>
            <FlexBox direction="Row" style={{ gap: "0.5rem" }}>
              <Button design="Emphasized" style={{ width: "50px" }}>
                Edit
              </Button>
              <Button design="Transparent">Define now</Button>
            </FlexBox>
          </FlexBox>
        </FlexBox>
          <div
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "var(--sapList_BorderColor)",
            marginTop: "0.5rem",
          }}
        />
      </FlexBox>
    
    </FlexBox>
  );
};

export default Logistics;
