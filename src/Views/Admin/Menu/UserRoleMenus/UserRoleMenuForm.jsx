import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  AnalyticalTable,
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
  Tag,
  Title,
  Token,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import { fetchUserMenus } from "../../../../store/slices/usermenusSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchForm } from "../../../../store/slices/formmasterSlice";
import { fetchCompanyForms } from "../../../../store/slices/CompanyFormSlice";
import { fetchRoles } from "../../../../store/slices/roleSlice";
import AppBar from "../../../../Components/Module/Appbar";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("UserRoleMenu name is required"),
  status: yup.string().required(),
  permissionIds: yup.array().of(yup.string()),
});


const getOptionKey = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("list")) return "list";
  if (lower.includes("get") || lower.includes("view")) return "view";
  if (lower.includes("create")) return "create";
  if (lower.includes("update") || lower.includes("edit")) return "edit";
  if (lower.includes("delete")) return "delete";
  return null;
};

const UserRoleMenuForm = ({
  onSubmit,
  defaultValues,
  permissions,
  mode = "create",
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });

  const permissionIds = watch("permissionIds");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const { usermenus } = useSelector((state) => state.usermenus);
    const { roles } = useSelector((state) => state.roles);
  const {companies} = useSelector((state)=>state.companies)

  const [menuList,setMenuList] = useState([])


  const grouped = {};
  permissions.forEach((perm) => {
    const option = getOptionKey(perm.name);
    if (!option) return;
    if (!grouped[perm.module]) grouped[perm.module] = [];
    grouped[perm.module].push({ option, id: perm.id });
  });


    useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchUserMenus()).unwrap();
        dispatch(fetchForm());
        dispatch(fetchCompanyForms());
        dispatch(fetchCompanies());
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  // const handleChange = (row) => {

  //   const permissionName = row;
  //   console.log("handlechange",permissionName,permissions)
  //   const permission = permissions.find(per => per.name === permissionName.toLowerCase());
  //   console.log("permission",permission)

  //   if (!permission) return; // safeguard in case not found

  //   const existId = permission.id;
  //   const exists = permissionIds.includes(existId);

  //   const updated = exists
  //     ? permissionIds.filter(pid => pid !== existId) // remove if already selected
  //     : [...permissionIds, existId];       // add if not present
  // console.log("updated",updated,permissionIds,exists)

  //   setValue("permissionIds", updated);
  // };
  const handleChange = (e, permissionName) => {
    const permission = permissions.find(
      (per) => per.name === permissionName.toLowerCase()
    );

    if (!permission) return;

    const id = permission.id;
    let updated;

    if (e.target.checked) {
      // Add permission ID (ensure no duplicates)
      updated = Array.from(new Set([...permissionIds, id]));
    } else {
      // Remove permission ID
      updated = permissionIds.filter((pid) => pid !== id);
    }

    console.log("Updatef,", updated);
    setValue("permissionIds", updated);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Module",
        accessor: "Module",
      },

      {
        Header: "List",
        accessor: "List",
        Cell: ({ row }) => {
          const permName = (row.original.Module + "_list").toLowerCase();
          const permission = permissions.find((opt) => opt.name === permName);
          const isChecked = permission
            ? permissionIds.includes(permission.id)
            : false;

          return (
            <CheckBox
              checked={isChecked}
              onChange={(e) => handleChange(e, permName)}
            />
          );
        },
      },
      {
        Header: "View",
        accessor: "View",
        Cell: ({ row }) => {
          const permName = (row.original.Module + "_get").toLowerCase();
          const permission = permissions.find((opt) => opt.name === permName);
          const isChecked = permission
            ? permissionIds.includes(permission.id)
            : false;

          return (
            <CheckBox
              checked={isChecked}
              onChange={(e) => handleChange(e, permName)}
            />
          );
        },
      },
      {
        Header: "Create",
        accessor: "Create",
        Cell: ({ row }) => {
          const permName = (row.original.Module + "_create").toLowerCase();
          const permission = permissions.find((opt) => opt.name === permName);
          const isChecked = permission
            ? permissionIds.includes(permission.id)
            : false;

          return (
            <CheckBox
              checked={isChecked}
              onChange={(e) => handleChange(e, permName)}
            />
          );
        },
      },
      {
        Header: "Edit",
        accessor: "Edit",
        Cell: ({ row }) => {
          const permName = (row.original.Module + "_update").toLowerCase();
          const permission = permissions.find((opt) => opt.name === permName);
          const isChecked = permission
            ? permissionIds.includes(permission.id)
            : false;

          return (
            <CheckBox
              checked={isChecked}
              onChange={(e) => handleChange(e, permName)}
            />
          );
        },
      },
      {
        Header: "Delete",
        accessor: "Delete",
        Cell: ({ row }) => {
          const permName = (row.original.Module + "_delete").toLowerCase();
          const permission = permissions.find((opt) => opt.name === permName);
          const isChecked = permission
            ? permissionIds.includes(permission.id)
            : false;

          return (
            <CheckBox
              checked={isChecked}
              onChange={(e) => handleChange(e, permName)}
            />
          );
        },
      },
    ],
    [permissionIds, permissions]
  );
useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchRoles()).unwrap();
        dispatch(fetchUserMenus());
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  const handleSelectRole = (role)=>{
    const selectedMenus = usermenus.filter((r)=>r.status&&role===r.roleId)
    setMenuList(selectedMenus)
  }


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
                  {defaultValues.id
                    ? "Edit UserRoleMenu"
                    : "Create New UserRoleMenu"}
                </Button>
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
                <BreadcrumbsItem data-route="/admin/UserRoleMenus">
                  UserRoleMenus
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/UserRoleMenus/create">
                  {mode === "edit" ? "Edit Branch " : "Create Branch"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {defaultValues.id ? "Edit UserRoleMenu" : "Create New UserRoleMenu"}
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
          wrap="Wrap" 
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
                   style={{width:"80%"}}

                    name="companyId"
                    value={field.value ?? ""}
                    onChange={(e) => {field.onChange(e.target.value)}}
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
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Role</Label>
            <FlexBox label={<Label required>roleId</Label>}>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}

                    name="roleId"
                    value={field.value ?? ""}
                    onChange={(e) => {field.onChange(e.target.value);handleSelectRole()}}
                    valueState={errors.roleId ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>
                    {roles
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.name}
                        </Option>
                      ))}
                  </Select>
                )}
              />

              {errors.roleId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.roleId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
                      <Label>Status</Label>{" "}
                      <FlexBox label={<Label required>Status</Label>}>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select
                   style={{width:"80%"}}

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
         {/* <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Company</Label>
            <FlexBox label={<Label required>companyId</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                    name="companyId"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedCompany(e.target.value);
                      handleselectedCompany(e.target.value);
                    }}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>
                    {companies
                      .filter((r) => r.status) 
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

          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Form</Label>
            <FlexBox label={<Label required>formId</Label>}>
              <Controller
                name="formId"
                control={control}
                render={({ field }) => (
                  <Select
                    name="formId"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue("formId", e.target.value || "");
                    }}
                    valueState={errors.formId ? "Error" : "None"}
                  >
                    {console.log("field", field)}
                   <Option key="" value="">Select</Option>
                    {console.log("formList", formlist)}
                    {formlist.map((r) => (
                      <Option key={r.Form?.id} value={r.Form?.id}>
                        {r.Form?.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />

              {errors.formId && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.formId.message}
                </span>
              )}
            </FlexBox>
          </FlexBox>*/}
        </FlexBox> 
        <div>
          <FlexBox direction="Column" style={{ marginTop: "1rem" }}>
            <AnalyticalTable
              columns={columns}
              data={usermenus.map((module) => ({
                Module: module.name,
                List: "",
                View: "",
                Create: "",
                Edit: "",
                Delete: "",
              }))}
              selectionMode="None"
              visibleRows={8}
              onAutoResize={() => {}}
              onColumnsReorder={() => {}}
              onGroup={() => {}}
              onLoadMore={() => {}}
              onRowClick={() => {}}
              onRowExpandChange={() => {}}
              onRowSelect={() => {}}
              onSort={() => {}}
              onTableScroll={() => {}}
            />
          </FlexBox>
        </div>
      </form>
    </Page>
  );
};

export default UserRoleMenuForm;
