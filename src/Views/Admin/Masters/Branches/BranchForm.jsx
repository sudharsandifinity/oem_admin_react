import { useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchRoles } from "../../../../store/slices/roleSlice";
import { useDispatch } from "react-redux";
import {
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  CheckBox,
  FlexBox,
  Input,
  Label,
  List,
  MessageStrip,
  Option,
  Page,
  Select,
  Switch,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../../Components/Module/Appbar";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  branch_code: yup.string().required("Branch Code is required"),
  companyId: yup.string().required("Company ID is required"),
  is_main:yup.string().required("is_main is required"),
  status: yup.string().required("Status is required"),
});

const BranchForm = ({
  onSubmit,
  companies,
  defaultValues = {
    companyId: "",
    branch_code: "",
    name: "",
    city: "",
    address: "",
    status: "",
  },
  mode = "create",
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);

  const navigate = useNavigate();

  return (
    <Page
      backgroundDesign="Solid"
      footer={
          <Bar
          style={{ padding:0.5 }}
            design="FloatingFooter"
            endContent={
              <>
                <Button
                  design="Emphasized"
                  form="form" /* ← link button to that form id */
                  type="Submit"
                >
                  {mode === "edit" ? "Update Branch " : "Create Branch"}
                </Button>
              </>
            }
          />
      }
      header={
        <AppBar
          design="Header"
          endContent={
            <Button
              accessibleName="Settings"
              icon="decline"
              title="Go to Settings"
              onClick={() => navigate(-1)} // Go back to previous page
            />
          }
          startContent={
            <div style={{ width: "200px" }}>
              <Breadcrumbs
                design="Standard"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
                separators="Slash"
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/branches">
                  Branch
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/branches/create">
                  {mode === "edit" ? "Edit Branch " : "Create Branch"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Branch" : "Create New Branch"}
          </Title>
        </AppBar>
      }
    >
      {apiError && (
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
          style={{ marginBottom: "1rem" }}
        >
          {apiError}
        </MessageStrip>
      )}

      <form
        ref={formRef}
        id="form"
        onSubmit={handleSubmit((formData) => {
          const fullData = {
            ...formData,
          };
          onSubmit(fullData); // you already pass it upward
        })}
      >
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", paddingTop: "4rem" }}
        >
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Company</Label>
            <FlexBox label={<Label required>companyId</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                    style={{ width: "80%" }}
                    name="companyId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>
                    {companies
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.name}
                        </Option>
                      ))}
                  </Select>
                )}
              />

              {errors.companyId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.companyId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Branch Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FlexBox label={<Label required>Label Text</Label>}>
                  <Input
                    style={{ width: "80%" }}
                    placeholder="Branch Name"
                    name="name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.name ? "Error" : "None"} // red border on error
                  >
                    {errors.name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Branch Code</Label>
            <Controller
              name="branch_code"
              control={control}
              render={({ field }) => (
                <FlexBox label={<Label required>Label Text</Label>}>
                  <Input
                    style={{ width: "80%" }}
                    placeholder="Branch Name"
                    name="branch_code"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.branch_code ? "Error" : "None"} // red border on error
                  >
                    {errors.branch_code && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.branch_code.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>City</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FlexBox label={<Label required>City</Label>}>
                  <Input
                    style={{ width: "80%" }}
                    placeholder="City"
                    name="city"
                    value={field.value ?? ""}
                    onInput={(e) => field.onChange(e.target.value)}
                    valueState={errors.city ? "Error" : "None"}
                  >
                    {errors.city && (
                      <span slot="valueStateMessage">
                        {errors.city.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Address</Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <FlexBox label={<Label required>Address</Label>}>
                  <Input
                    style={{ width: "80%" }}
                    placeholder="Address"
                    name="address"
                    value={field.value ?? ""}
                    onInput={(e) => field.onChange(e.target.value)}
                    valueState={errors.address ? "Error" : "None"}
                  >
                    {errors.address && (
                      <span slot="valueStateMessage">
                        {errors.address.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Is Main</Label>{" "}
            <FlexBox label={<Label required>Is Main</Label>}>
              <Controller
                name="is_main"
                control={control}
                render={({ field }) => (
                  <Select
                    style={{ width: "80%" }}
                    name="is_main"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.is_main ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>

                    <Option value="true">Yes</Option>
                    <Option value="false">No</Option>
                  </Select>
                )}
              />

              {errors.is_main && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.is_main.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Status</Label>
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    style={{ width: "26%" }}
                    name="status"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.status ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>

                    <Option value="1">Active</Option>
                    <Option value="0">Inactive</Option>
                  </Select>
                )}
              />

              {errors.status && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.status.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </form>
    </Page>
  );
};

export default BranchForm;
