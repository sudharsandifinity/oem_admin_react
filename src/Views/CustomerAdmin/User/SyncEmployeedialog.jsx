import {
    Button,
  Dialog,
  FlexBox,
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  Select,
  Text,
} from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Label } from "recharts";

const SyncEmployeedialog = (props) => {
  const { open, setIsEmployeeSyncing ,companies,roles,handlesyncEmployees} = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = React.useRef(null);
  const [selectedCompany, setSelectedCompany] = React.useState("");
      const [roleList, setRoleList] = useState([]);
      const [selectedRoles, setSelectedRoles] = useState([]);

  

    const handleselectedCompany = (company) => {
    console.log(
      "handleselectedCompany",      
      company,roles
    );

    console.log("selectedCompany", selectedCompany,roles);

       const filteredRoles = roles.filter(
    (r) =>
      r.status &&
      r.companyId === company
  );

    console.log("rolelist", filteredRoles);
    setRoleList(filteredRoles);
  
}
  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());
    callback(data);
  };

  return (
    <div>{console.log("roleList",roleList)}
      <Dialog
        open={open}
        headerText="Sync Employees"
        style={{ width: "600px" }}
        onAfterClose={() => setIsEmployeeSyncing(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={() => {setIsEmployeeSyncing(false);handlesyncEmployees(selectedCompany, selectedRoles)}}>Sync</Button>
            <Button onClick={() => setIsEmployeeSyncing(false)}>Cancel</Button>
          </div>
        }
      >
        <form
          ref={formRef}
          id="form"
          onSubmit={handleSubmit((formData) => {
            const fullData = {
              ...formData,
            };
            onSubmitCreate(fullData); // you already pass it upward
          })}
        >
          <FlexBox
            wrap="Wrap" // allow line breaks
            style={{ gap: "1rem", margin: "2rem" }}
          >
            {" "}
            <FlexBox direction="Column" style={{ flex: " 28%" }}>
              <Text>Company</Text>{" "}
              <FlexBox label={<Label required>Company</Label>}>
                <Select
                  style={{ minWidth: "80%", maxWidth: "80%" }}

                  name="companyId"
                  value={""}
                  onChange={(e) => {
                    setSelectedCompany(e.target.value);
                    handleselectedCompany(e.target.value);
                  }}
                >
                  <Option key="select" value="">
                    Select
                  </Option>
{console.log("companies",companies)}
                  {companies
                    .map((r) => (
                      <Option key={r.id} value={r.id}>
                        {r.name}
                      </Option>
                    ))}
                </Select>
              </FlexBox>
            </FlexBox>
            <FlexBox direction="Column" style={{ flex: "28%" }}>
              <Text>Role</Text>
              <FlexBox label={<Label required>roleId</Label>}>
                <MultiComboBox
                  style={{ minWidth: "80%", maxWidth: "80%" }}
                  name="roleIds"
                  value={""} // 👈 make sure it's an array, not string
                  onSelectionChange={(e) => {
                    const selectedItems = e.detail.items.map((item) =>
                      item.getAttribute("value"),
                    );
                    setSelectedRoles(selectedItems);
                  }}
                >
                  {roleList.map((r) => (
                    <MultiComboBoxItem key={r.id} value={r.id} text={r.name}>
                      {r.name}
                    </MultiComboBoxItem>
                  ))}
                </MultiComboBox>
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </form>
      </Dialog>
    </div>
  );
};

export default SyncEmployeedialog;
