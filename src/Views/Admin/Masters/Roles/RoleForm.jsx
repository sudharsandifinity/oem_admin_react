import { useRef, useMemo, useEffect, useState, use } from "react";

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
  ListItemStandard,
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
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import AppBar from "../../../../Components/Module/Appbar";

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

const RoleForm = ({
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
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      userMenus: [], // ✅ ensures it's always an array
    },
    resolver: yupResolver(schema, { context: { mode } }),
  });

  const [selectedCompany, setSelectedCompany] = useState(
    defaultValues.companyId ? defaultValues.companyId : "",
  );

  const { companies } = useSelector((state) => state.companies);
  const { branches } = useSelector((state) => state.branches);
  const { usermenus, loading } = useSelector((state) => state.usermenus);

  const branchList = selectedCompany
    ? branches.filter((branch) => branch.Company.id === selectedCompany)
    : branches;

  const dispatch = useDispatch();
  const permissionIds = watch("permissionIds");
  const userMenus = watch("UserMenus");
  const branchid = watch("branchId");
  console.log("userMenus", userMenus);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [currScope, setCurrscope] = useState(
    mode === "edit" ? defaultValues.scope : "master",
  );
  const [selectedBranch, setSelectedBranch] = useState(
    branchid ? branchid : "",
  );

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
        await dispatch(fetchBranch()).unwrap();

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
  const handleChange = (e, permissionName, menuId) => {
    const checked = e.target.checked;

    if (currScope === "master") {
      // Master scope logic remains the same
      const permission = permissions.find(
        (per) => per.name === permissionName.toLowerCase(),
      );
      if (!permission) return;

      const id = permission.id;
      let updated = checked
        ? [...new Set([...permissionIds, id])]
        : permissionIds.filter((pid) => pid !== id);

      setValue("permissionIds", updated, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      // User scope
      let current = getValues("userMenus") || [];
      console.log("current", current, menuId);
      const existing = current.find((m) => m.menuId === menuId);
      const menu = menulist.find((m) => m.id === menuId);
      const defaultPermsParent = {
        menuId: menu && menu.parentUserMenuId ? menu.parentUserMenuId : "",
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: false,
        can_delete: false,
      };
      const defaultPerms = {
        menuId,
        can_list_view: false,
        can_create: false,
        can_edit: false,
        can_view: false,
        can_delete: false,
      };
      if (existing) {
        current = current.map((m) =>
          m.menuId === menuId ? { ...m, [permissionName]: checked } : m,
        );
      } else {
        //current = [...current,{...defaultPermsParent}, { ...defaultPerms, [permissionName]: checked }];
        const newEntries = [];

        // ✅ Add parent ONLY if it exists
        if (menu?.parentUserMenuId) {
          newEntries.push({
            menuId: menu.parentUserMenuId,
            can_list_view: true,
            can_create: false,
            can_edit: false,
            can_view: false,
            can_delete: false,
          });
        }

        // ✅ Always add current menu
        newEntries.push({
          menuId,
          can_list_view: false,
          can_create: false,
          can_edit: false,
          can_view: false,
          can_delete: false,
          [permissionName]: checked,
        });

        current = [...current, ...newEntries];
      }

      // Handle parent-child syncing only for List permission
      console.log("permissionName", permissionName, menulist);
      //if (permissionName === "can_list_view") {
      console.log("menu::->", menu);
      // 1️⃣ Child → Parent
      if (menu && menu.parentUserMenuId) {
        const siblings = menulist.filter(
          (m) => m.parentUserMenuId === menu.parentUserMenuId,
        );
        console.log("siblings", siblings);
        const anySiblingChecked = siblings.some((sib) =>
          sib.id === menuId
            ? checked
            : current.find((c) => c.menuId === sib.id)?.can_list_view,
        );
        console.log("anySiblingChecked", anySiblingChecked, current);
        current = current.map((m) =>
          m.menuId === menu.parentUserMenuId
            ? { ...m, can_list_view: anySiblingChecked }
            : m,
        );

        console.log("currentaftersiblng", current);
      }

      // 2️⃣ Parent → Child
      if (menu && !menu.parentUserMenuId) {
        const children = menulist.filter((m) => m.parentUserMenuId === menuId);
        current = current.map((m) =>
          children.some((c) => c.id === m.menuId)
            ? { ...m, can_list_view: checked }
            : m,
        );
      }
      //}

      setValue("userMenus", current, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const menulist = selectedBranch
    ? usermenus
        .map((menu) =>
          menu.children.filter((child) => child.branchId === selectedBranch),
        )
        .flat()
    : usermenus.map((menu) => menu.children).flat();
  console.log("menuList", usermenus, menulist, selectedBranch);
  // const filteredMenus = selectedCompany !
  //  selectedCompany !== ""
  //   ? usermenus.map(menu => ({
  //       ...menu,
  //       children: menu.children?.filter(child =>
  //         child.companyId === selectedCompany || child.companyId === ""
  //       ) || []
  //     }))
  //   : usermenus;

  useEffect(() => {
    console.log("userMenuPermission", userMenus);
    if (mode === "edit" && userMenus?.length) {
      const prefilled = userMenus.map((menu) => ({
        menuId: menu.id, // id from your API object
        can_list_view: menu.RoleMenu?.can_list_view ?? false,
        can_create: menu.RoleMenu?.can_create ?? false,
        can_edit: menu.RoleMenu?.can_edit ?? false,
        can_view: menu.RoleMenu?.can_view ?? false,
        can_delete: menu.RoleMenu?.can_delete ?? false,
      }));

      setValue("userMenus", prefilled, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [mode, userMenus, setValue]);
  const buildMenuListData = () => {
    const list = [];

    (selectedBranch
      ? usermenus.filter((m) => m.branchId === selectedBranch)
      : usermenus
    ).forEach((menu) => {
      // Add parent row
      list.push({
        Module: menu.name,
        id: menu.id,
        isParent: true,
        List: "",
        View: "",
        Create: "",
        Edit: "",
        Delete: "",
      });
      // Add children rows
      menu.children
        .filter((child) => !selectedBranch || child.branchId === selectedBranch)
        .forEach((child) => {
          list.push({
            Module: child.name,
            id: child.id,
            parentId: menu.id,
            isParent: false,
            List: "",
            View: "",
            Create: "",
            Edit: "",
            Delete: "",
          });
        });
    });
    console.log("buildmenulist", list);
    return list;
  };

  const menuListData = buildMenuListData();

  // const menuListData = menulist.map((menu) => ({
  //   Module: menu.name,
  //   id: menu.id,
  //   List: "",
  //   View: "",
  //   Create: "",
  //   Edit: "",
  //   Delete: "",
  // }));
  console.log("usermenus", usermenus, menulist, selectedBranch);

  const columns = useMemo(
    () => [
      { Header: "Module", accessor: "Module" },

      ...["List", "View", "Create", "Edit", "Delete"].map((col) => ({
        Header: col,
        accessor: col,
        Cell: ({ row }) => {
          const fieldMap = {
            List: "can_list_view",
            View: "can_view",
            Create: "can_create",
            Edit: "can_edit",
            Delete: "can_delete",
          };
          const permissionName = fieldMap[col];

          const isParent = row.original.isParent;
          const current = getValues("userMenus") || [];
          const existing = current.find((m) => m.menuId === row.original.id);
          const isChecked = existing ? existing[permissionName] : false;

          return (
            <CheckBox
              checked={isChecked}
              disabled={isParent && permissionName !== "can_list_view"} // optional: prevent editing parent for non-list
              onChange={(e) => handleChange(e, permissionName, row.original.id)}
            />
          );
        },
      })),
    ],
    [getValues, currScope, menuListData],
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
  ];
  return (
    <>
      <style>
        {`
                          ui5-page::part(content) {
                            padding: 15px;
                          }
                        `}
      </style>
      <FlexBox direction="Column" style={{ width: "100%" }}>
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
                <BreadcrumbsItem data-route="/admin/roles">
                  Roles
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/roles/create">
                  {mode === "edit" ? "Edit Role " : "Create Role"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {defaultValues.id ? "Edit Role" : "Create New Role"}
          </Title>
        </AppBar>
        <Page
          backgroundDesign="Solid"
          footer={
            <Bar
              style={{ padding: 0.5 }}
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
          }
          // header={
          //   <AppBar
          //     design="Header"
          //     endContent={
          //       <Button
          //         accessibleName="Settings"
          //         icon="decline"
          //         title="Go to Settings"
          //         onClick={() => navigate(-1)} // Go back to previous page
          //       />
          //     }
          //     startContent={
          //       <div style={{ width: "200px" }}>
          //         <Breadcrumbs
          //           design="Standard"
          //           onItemClick={(e) => {
          //             const route = e.detail.item.dataset.route;
          //             if (route) navigate(route);
          //           }}
          //           separators="Slash"
          //         >
          //           <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
          //           <BreadcrumbsItem data-route="/admin/roles">
          //             Roles
          //           </BreadcrumbsItem>
          //           <BreadcrumbsItem data-route="/admin/roles/create">
          //             {mode === "edit" ? "Edit Branch " : "Create Branch"}
          //           </BreadcrumbsItem>
          //         </Breadcrumbs>
          //       </div>
          //     }
          //   >
          //     <Title level="h4">
          //       {defaultValues.id ? "Edit Role" : "Create New Role"}
          //     </Title>
          //   </AppBar>
          // }
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
                        style={{ width: "80%" }}
                        name="scope"
                        value={field.value ?? "master"}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setCurrscope(e.target.value);
                        }}
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
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Company</Label>{" "}
                <FlexBox label={<Label required>Company</Label>}>
                  <Controller
                    name="companyId"
                    control={control}
                    style={{
                      width: "80%",
                      maxHeight: "20px",
                      overflowY: "auto",
                    }}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        disabled={currScope === "master"}
                        name="companyId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          console.log("e.targetliststandard", e.target);
                          field.onChange(e.target.value);
                          setSelectedCompany(e.target.value);
                        }}
                        valueState={errors.companyId ? "Error" : "None"}
                      >
                        <Option key="select" value="">
                          Select
                        </Option>
                        {console.log("companieasass", companies)}

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
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Branch</Label>{" "}
                <FlexBox label={<Label required>Branch</Label>}>
                  <Controller
                    name="branchId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        disabled={currScope === "master"}
                        name="branchId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setSelectedBranch(e.target.value);
                        }}
                        valueState={errors.branchId ? "Error" : "None"}
                      >
                        <Option key="select" value="">
                          Select
                        </Option>

                        {branchList
                          .filter((r) => r.status) /* active roles only    */
                          .map((r) => (
                            <Option key={r.id} value={r.id}>
                              {r.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  />

                  {errors.branchId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.branchId.message}
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
                        style={{ width: "80%" }}
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
                        style={{ width: "80%" }}
                        name="status"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.status ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>

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
                  data={currScope === "master" ? data : menuListData}
                  selectionMode="None"
                  visibleRows={10}
                />
              </FlexBox>
            </div>
          </form>
        </Page>
      </FlexBox>
    </>
  );
};

export default RoleForm;
