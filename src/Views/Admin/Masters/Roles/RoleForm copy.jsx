import {
 
  useRef,
  useMemo,
  useEffect,
  useState,
} from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchUserMenus } from "../../../../store/slices/usermenusSlice";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Role name is required"),
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

const RoleForm = ({ onSubmit, defaultValues, permissions,mode = "create", apiError }) => {
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

  const { companies } = useSelector((state) => state.companies);
  const { usermenus, loading } = useSelector((state) => state.usermenus);


  const dispatch = useDispatch()
  const permissionIds = watch("permissionIds");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [currScope,setCurrscope] = useState("master")
  const [selectedCompany, setSelectedCompany] = useState("");

  const grouped = {};
  permissions.forEach((perm) => {
    const option = getOptionKey(perm.name);
    if (!option) return;
    if (!grouped[perm.module]) grouped[perm.module] = [];
    grouped[perm.module].push({ option, id: perm.id });
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
        await dispatch(fetchUserMenus()).unwrap();
       
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
    console.log("handleChange", permissionName, permissions);
    const permission = permissions.find(
      (per) => per.name === permissionName.toLowerCase()
    );

  if (!permission) return;

  const id = permission.id;
  let updated;

  if (e.target.checked) {
    updated = [...new Set([...permissionIds, id])]; // add
  } else {
    updated = permissionIds.filter((pid) => pid !== id); // remove
  }

  console.log("Updated Permission IDs:", updated);

  // 🔑 Notify RHF so it re-renders
  setValue("permissionIds", updated, {
    shouldValidate: true,
    shouldDirty: true,
    shouldTouch: true,
  });
};


const menulist =usermenus.map(menu => menu.children?.filter(child => 
  child.companyId === selectedCompany || child.companyId === ""
) || [])
.flat();
// const filteredMenus = selectedCompany !
//  selectedCompany !== ""
//   ? usermenus.map(menu => ({
//       ...menu,
//       children: menu.children?.filter(child => 
//         child.companyId === selectedCompany || child.companyId === ""
//       ) || []
//     }))
//   : usermenus;
const menuListData = menulist.map((menu) => ({
  Module: menu.name,
  List: "",
  View: "",
  Create: "",
  Edit: "",
  Delete: "",
}));
console.log("usermenus", usermenus, menulist, selectedCompany);
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
              onChange={(e) =>{ handleChange(e, permName); console.log("onchange",permName)}}
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
  const data = [
                               
                  {
                    Module: "Company", 
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                  {
                    Module: "Branch",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                   {
                    Module: "Role",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                   {
                    Module: "User",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                  {
                    Module: "Form",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                   {
                    Module: "Form_Section",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                  {
                    Module: "Form_Field",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                  {
                    Module: "User_Menu",
                    List: "",
                    View: "",
                    Create: "",
                    Edit: "",
                    Delete: "",
                  },
                ] 
  return (
    <Page
      backgroundDesign="Solid"
      footer={
        <div>
          <Bar
            design="FloatingFooter"
            endContent={
              <>
                <Button
                  design="Emphasized"
                  form="form" /* ← link button to that form id */
                  type="Submit"
                >
                  {defaultValues.id ? "Edit Role" : "Create New Role"}
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
        </div>
      }
      header={
        <Bar
          design="Header"
          endContent={
            <Button
              accessibleName="Settings"
              icon="settings"
              title="Go to Settings"
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
                <BreadcrumbsItem data-route="/admin/roles">
                  Roles
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/roles/create">
                   {mode === "edit" ? "Edit Branch " : "Create Branch"}

                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {defaultValues.id ? "Edit Role" : "Create New Role"}
          </Title>
        </Bar>
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
        <FlexBox style={{ paddingTop: "2rem" }}>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Scope</Label>{" "}
            <FlexBox label={<Label required>Scope</Label>}>
              <Controller
                name="scope"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}

                    name="scope"
                    value={field.value ?? "master"}

                    onChange={(e) => {field.onChange(e.target.value);setCurrscope(e.target.value)
                    }
                    }
                    valueState={errors.scope ? "Error" : "None"}
                  >
                    <Option value="master">master</Option>

                    <Option value="user">User</Option>
                    
                  </Select>
                )}
              />

              {errors.scope && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.scope.message}
                </span>
              )}
            </FlexBox>
          </FlexBox><FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Company</Label>{" "}
            <FlexBox label={<Label required>Company</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                   style={{width:"80%"}}
                  disabled={currScope ==="master"}
                    name="companyId"
                    value={field.value ?? ""}
                    onChange={(e) => {field.onChange(e.target.value);setSelectedCompany(e.target.value)}}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                    <Option key="select" value="">Select</Option>

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
            <Label>Role Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                   style={{width:"80%"}}

                    placeholder="Form Name"
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
        </FlexBox>
        <div>
          <FlexBox direction="Column" style={{ marginTop: "1rem" }}>
            <AnalyticalTable
              columns={columns}
              data={
                currScope ==="master"?data:menuListData
              }
              selectionMode="None"
              visibleRows={10}
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

export default RoleForm;
