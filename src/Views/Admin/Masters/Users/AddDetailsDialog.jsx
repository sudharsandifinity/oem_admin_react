import {
  AnalyticalTable,
  Button,
  Dialog,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  FormItem,
  Grid,
  List,
  ListItemStandard,
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  Select,
  Title,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";
import * as yup from "yup";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Label } from "recharts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { fetchFormSection } from "../../../../store/slices/formsectionSlice";
import { useNavigate } from "react-router-dom";
import { fetchForm } from "../../../../store/slices/formmasterSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchFormFields } from "../../../../store/slices/FormFieldSlice";
import { fetchCompanyForms } from "../../../../store/slices/CompanyFormSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";

const tableData = [
  {
    salesOrderId: "SO001",

    customerName: "Customer A",
    orderDate: "2023-10-01",
    totalAmount: 1000,
  },
];

const schema = yup.object().shape({
  companyId: yup.string().required("companyId  is required"),
  branchId: yup.string().required("branchId  is required"),
});
const AddDetailsDialog = ({
  onSubmitFormField,
  defaultValues = {
    companyId: "",
    formId: [],
    branchId: "",
  },
  addDetailDialog,
  onClose,
  mode = "create",
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
  const { forms } = useSelector((state) => state.forms);
  const { companies } = useSelector((state) => state.companies);
  const { branches } = useSelector((state) => state.branches);
  const { companyforms } = useSelector((state) => state.companyforms);
  const { companyformfield } = useSelector((state) => state.companyformfield);
  const [formlist, setFormlist] = useState([]);
  const [brachlist, setBranchlist] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState({});

  const onRowSelect = (e) => {
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchFormSection()).unwrap();
        console.log("resusers", res);
        dispatch(fetchForm());
        dispatch(fetchBranch());
        dispatch(fetchCompanies());
        dispatch(fetchFormFields());
        dispatch(fetchCompanyForms());
        dispatch(fetchBranch());
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

  const handleselectedCompany = (company) => {
    console.log("handleselectedCompany", companyforms, branches, company);
    const companyList = companyforms.filter(
      (r) => r.status && company === r.Company.id
    );
    const uniqueform = Array.from(
      new Map(companyList.map((item) => [item.Form?.id, item])).values()
    );

    const uniquebranch = branches.filter(
      (r) => r.status && company === r.Company.id
    );
    setFormlist(uniqueform);
    setBranchlist(uniquebranch);
    console.log("uniqueform", companyList, uniqueform, uniquebranch);
  };
  return (
    <Dialog
      headerText={"Add Details"}
      open={addDetailDialog}
      style={{ width: "90%" }}
      onAfterClose={() => onClose(false)}
      footer={
        <FlexBox direction="Row" gap={2}>
          <Button
            design="Emphasized"
            form="form" /* ← link button to that form id */
            type="Submit"
            accessibleName="Save"
            icon="save"
            title="Save"
          >
            {mode === "edit" ? "Update" : "Create"}
          </Button>
          <Button onClick={() => onClose(false)}>Close</Button>
        </FlexBox>
      }
    >
      {" "}
      <div style={{ paddingBottom: "1rem" }}>
        <form
          ref={formRef}
          id="form"
          onSubmit={handleSubmit((data) => {
            console.log("formdata", data);
            onSubmitFormField(data);
            onClose(false);
          })}
        >
          <FlexBox
            wrap="Wrap" // allow line breaks
            style={{ gap: "1rem", paddingTop: "4rem" }}
          >
            <FlexBox direction="Column" style={{ flex: "28%" }}>
              <label>Company</label>
              <FormItem label={<Label required>companyId</Label>}>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="companyId"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleselectedCompany(e.target.value);
                      }}
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
              </FormItem>
            </FlexBox>

            <FlexBox direction="Column" style={{ flex: "28%" }}>
              <label>Form</label>
              <FormItem label={<Label required>formId</Label>}>
                <Controller
                  name="formId"
                  control={control}
                  render={({ field }) => (
                    <MultiComboBox
                      name="formId"
                      disabled={!formlist || formlist.length === 0}
                      value={field.value || []}
                      onSelectionChange={(e) => {
                        console.log("e.detail.selectedItems",e.detail.items)
                        const selectedIds = e.detail.items.map(
                          (item) => item.value
                        );
                        field.onChange(selectedIds);
                      }}
                      valueState={errors.formId ? "Error" : "None"}
                    >
                      {(formlist ?? []).map((r) => (
                        <MultiComboBoxItem
                          key={r.Form?.id}
                          value={r.Form?.id}
                          text={r.Form?.name}
                          selected={field.value?.includes(r.Form?.id)}
                        />
                      ))}
                    </MultiComboBox>
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
              </FormItem>
            </FlexBox>
            <FlexBox direction="Column" style={{ flex: "28%" }}>
              <label>Branch</label>
              <FormItem label={<Label required>branchId</Label>}>
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="branchId"
                      disabled={!brachlist || brachlist.length === 0}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      valueState={errors.branchId ? "Error" : "None"}
                    >
                      {console.log("brachlist", brachlist)}
                     <Option key="" value="">Select</Option>
                      {brachlist.map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.name}
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
              </FormItem>
            </FlexBox>
          </FlexBox>
        </form>
      </div>
    </Dialog>
  );
};

export default AddDetailsDialog;
