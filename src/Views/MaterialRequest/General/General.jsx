import { useEffect, useRef } from "react";

import { Controller, set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  BusyIndicator,
  Button,
  Card,
  FileUploader,
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
} from "@ui5/webcomponents-react";
import React, { useContext, useState } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchSalesBusinessPartner,
  fetchCustomerOrder,
} from "../../../store/slices/CustomerOrderSlice";
import CardDialog from "./CardCodeDialog/CardDialog";
import { fetchPurBusinessPartner } from "../../../store/slices/purchaseorderSlice";
import ProjectCodeDialog from "./ProjectCodeDialog/ProjectCodeDialog";
import { fetchCustomerDetails } from "../../../store/slices/CustomerDetailsSlice";
import { fetchProjectsDetails } from "../../../store/slices/salesAdditionalDetailsSlice";
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  branch_code: yup.string().required("Branch Code is required"),
  companyId: yup.string().required("Company ID is required"),
  is_main: yup.string().required("is_main is required"),
  status: yup.string().required("Status is required"),
});
const General = ({
  onSubmit,
  setFormData,
  formData,
  defaultValues,
  pageId,
  mode = "create",
  selectedcardcode,
  setSelectedCardCode,
  formDetails,
  setCurrencyType,
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);
  const { id, formId } = useParams();

  const {
    fieldConfig,
    //CustomerDetails,
    //DocumentDetails
  } = useContext(FormConfigContext);

  const [generalData, setgeneralData] = useState([]);
  const [originalGeneralData, setOriginalgeneralData] = useState([]);
  const [originalProjectdata,setOriginalProjectData]=useState([])
  const [pageLoading, setPageLoading] = useState(true);
  const [inputValue, setInputValue] = useState([
    {
      CusCode: "",
      RequisitionNo: "",
      RequisitionDate: "",
      RequisitionTime: "",
      RequiredDate: "",
      ProjectCode: "",
      ProjectName: "",
      Remarks: "",
      BOQ: "",
      ExcelImport: "",
    },
  ]);
  const { customerorder, businessPartner, loading, error } = useSelector(
    (state) => state.customerorder,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCusCodeDialogOpen = () => setDialogOpen(true);
  const handleCardDialogClose = () => setDialogOpen(false);

  const [projectdialogOpen, setProjectDialogOpen] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectCodeDialogOpen = () => setProjectDialogOpen(true);
  const handleProjectDialogClose = () => setProjectDialogOpen(false);

  useEffect(() => {
    console.log("formdetailgeneral", formDetails);
    const fetchData = async () => {
      try {
        let res = [];

        res = await dispatch(fetchCustomerDetails()).unwrap();
        const projectDetails = await dispatch(fetchProjectsDetails()).unwrap();
        const projectdataConfig = projectDetails.value.map((item) => ({
            ProjectCode: item.Code,
            ProjectName: item.Name,
            status: item.Active === "tYES" ? "Active" : "Inactive",
          }))
        setProjectList(projectdataConfig);
        console.log("fetchCustomerDetailsres", res, projectDetails);

        if (res?.length > 0) {
          const dataconfig = res.map((item) => ({
            CardCode: item.CardCode,
            CardName: item.CardName,
            ContactPerson: item.ContactPerson,
            Series: item.Series,
            Currency: item.Currency,
          }));
          if (dialogOpen) {
            console.log("itemdatauseefect", generalData);
            setOriginalgeneralData(generalData); // backup (for reset/clear filter)
          }
          //if(projectdialogOpen){
            setOriginalProjectData(projectdataConfig)
         // }
          setgeneralData(dataconfig);
        }

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
      setPageLoading(false);
    };

    fetchData();
  }, [dispatch, formDetails, dialogOpen]);
  useEffect(() => {
    setCurrencyType(
      generalData.find((r) => r.CardCode === selectedcardcode)?.Currency ||
        "GBP",
    );
    console.log(
      "currencytype",
      generalData.find((r) => r.CardCode === selectedcardcode)?.Currency ||
        "GBP",
    );
  }, [selectedcardcode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const selectedData = selectedcardcode
    ? generalData.find((r) => r.CardCode === selectedcardcode)
    : null;
  console.log("selectedData", selectedData, generalData);
  const autoCardNameRef = selectedData?.CardName || "";
  const autoContactPersonRef = selectedData?.ContactPerson || "";
  const autoCustomerRef = selectedData?.Series || "";

  useEffect(() => {
    if (autoCustomerRef) {
      handleChange({
        target: { name: "CustomerRefNo", value: autoCustomerRef },
      });
    }

    if (autoContactPersonRef) {
      handleChange({
        target: { name: "ContactPerson", value: autoContactPersonRef },
      });
    }

    if (autoCardNameRef) {
      handleChange({
        target: { name: "CardName", value: autoCardNameRef },
      });
    }
  }, [autoCustomerRef, autoContactPersonRef, autoCardNameRef]);

  return (
    <div>
      {console.log("formData", formData)}
      {pageLoading && !formData ? (
        <FlexBox
          justifyContent="Center"
          alignItems="Center"
          style={{ height: "80vh", width: "100%" }}
        >
          <BusyIndicator active size="Medium" />
        </FlexBox>
      ) : (
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
          <div className="card-responsive-container">
            <Card>
              <FlexBox
                wrap="Wrap"
                justifyContent="SpaceBetween"
                style={{ padding: "40px 30px", gap: "150px" }}
              >
                {console.log("selectedcardcode", selectedcardcode)}
                <FlexBox
                  direction="Column"
                  style={{
                    flex: "1 1 300px", // grow, shrink, base width
                    minWidth: "250px",
                    gap: "8px",
                  }}
                >
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>Requisition No:</Label>
                    <Controller
                      name="RequisitionNo"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Select Requisition No"
                          name="RequisitionNo"
                          disabled
                          type="number"
                          style={{ width: "100%" }}
                          value={pageId}
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.RequisitionNo ? "Error" : "None"}
                        >
                          {errors.RequisitionNo && (
                            <span slot="valueStateMessage">
                              {errors.RequisitionNo.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>
                      {" "}
                      Requisition Date :
                    </Label>
                    <Controller
                      name="RequisitionDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Requisition Date"
                          name="RequisitionDate"
                          type="date"
                          style={{ width: "100%" }}
                          value={
                            formData.RequisitionDate
                              ? new Date(formData.RequisitionDate)
                                  .toISOString()
                                  .split("T")[0]
                              : new Date().toISOString().split("T")[0]
                          }
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.RequisitionDate ? "Error" : "None"}
                        >
                          {errors.RequisitionDate && (
                            <span slot="valueStateMessage">
                              {errors.RequisitionDate.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>
                      Requisition Time:
                    </Label>
                    <Controller
                      name="RequisitionTime"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Requisition Time"
                          name="RequisitionTime"
                          type="time"
                          disabled={mode === "view"}
                          style={{ width: "100%" }}
                          value={
                            formData.RequisitionTime
                              ? formData.RequisitionTime
                              : new Date().toTimeString().slice(0, 5)
                          }
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.RequisitionTime ? "Error" : "None"}
                        >
                          {errors.RequisitionTime && (
                            <span slot="valueStateMessage">
                              {errors.RequisitionTime.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>Required Date</Label>
                    <Controller
                      name="RequiredDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Required Date"
                          name="RequiredDate"
                          type="date"
                          disabled={mode === "view"}
                          style={{ width: "100%" }}
                          value={
                            formData.RequiredDate
                              ? new Date(formData.RequiredDate)
                                  .toISOString()
                                  .split("T")[0]
                              : new Date().toISOString().split("T")[0]
                          }
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.RequiredDate ? "Error" : "None"}
                        >
                          {errors.RequiredDate && (
                            <span slot="valueStateMessage">
                              {errors.RequiredDate.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                </FlexBox>
                <div
                  style={{
                    width: "1px",
                    background: "#ccc",
                    margin: "0 1rem",
                  }}
                />
                <FlexBox
                  direction="Column"
                  style={{
                    flex: "1 1 300px", // grow, shrink, base width
                    minWidth: "250px",
                    gap: "8px",
                  }}
                >
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>Customer code:</Label>
                    <Controller
                      name="CusCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Select Card"
                          name="RequisitionNo"
                          style={{ width: "100%" }}
                          value={formData.CusCode}
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.RequisitionNo ? "Error" : "None"}
                          icon={
                            <Icon
                              style={{ paddingTop: "0.5rem" }}
                              name="person-placeholder"
                              onClick={handleCusCodeDialogOpen}
                            />
                          }
                        >
                          {errors.RequisitionNo && (
                            <span slot="valueStateMessage">
                              {errors.RequisitionNo.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>Project Code:</Label>
                    <Controller
                      name="ProjectCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Project Code"
                          name="ProjectCode"
                          style={{ width: "100%" }}
                          value={formData.ProjectCode}
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.ProjectCode ? "Error" : "None"}
                          icon={
                            <Icon
                              style={{ paddingTop: "0.5rem" }}
                              name="person-placeholder"
                              onClick={handleProjectCodeDialogOpen}
                            />
                          }
                        >
                          {errors.ProjectCode && (
                            <span slot="valueStateMessage">
                              {errors.ProjectCode.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>Project Name:</Label>
                    <Controller
                      name="ProjectName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Project Name"
                          name="ProjectName"
                          disabled={mode === "view"}
                          min="2025-01-01"
                          style={{ width: "100%", minWidth: "150px" }}
                          value={formData.ProjectName}
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.ProjectName ? "Error" : "None"}
                        >
                          {errors.ProjectName && (
                            <span slot="valueStateMessage">
                              {errors.ProjectName.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>
                  <FlexBox alignItems="Center">
                    <Label style={{ minWidth: "200px" }}>Remarks:</Label>
                    <Controller
                      name="Remarks"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Remarks"
                          name="Remarks"
                          disabled={mode === "view"}
                          min="2025-01-01"
                          style={{ width: "100%", minWidth: "150px" }}
                          value={formData.Remarks}
                          onInput={(e) => field.onChange(e.target.value)}
                          onChange={handleChange}
                          valueState={errors.Remarks ? "Error" : "None"}
                        >
                          {errors.Remarks && (
                            <span slot="valueStateMessage">
                              {errors.Remarks.message}
                            </span>
                          )}
                        </Input>
                      )}
                    />
                  </FlexBox>

                  {console.log("customerorderlist", customerorder)}
                </FlexBox>
              </FlexBox>
            </Card>
          </div>
        </form>
      )}
      <CardDialog
        open={dialogOpen}
        handleCardDialogClose={handleCardDialogClose}
        generalData={generalData}
        setgeneralData={setgeneralData}
        setSelectedCardCode={setSelectedCardCode}
        setFormData={setFormData}
        originalGeneralData={originalGeneralData}
        setOriginalgeneralData={setOriginalgeneralData}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setSelectedCard={(card) => {
          setSelectedCard(card);
          setValue("CardCode", card.CardCode); // update RHF field
          setValue("CardName", card.CardName); // fill another field automatically
          setValue("ContactPerson", card.ContactPerson);
          setValue("Series", card.Series);
        }}
      />
      <ProjectCodeDialog
        open={projectdialogOpen}
        handleProjectDialogClose={handleProjectDialogClose}
        projectList={projectList}
        setProjectList={setProjectList}
        selectedProject={selectedProject}
        // setSelectedProject={setSelectedProject}
        setFormData={setFormData}
        originalProjectdata={originalProjectdata}
        setOriginalProjectData={setOriginalProjectData}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setSelectedProject={(project) => {
          setSelectedProject(project);
          setValue("ProjectCode", project.ProjectCode); // update RHF field
          setValue("ProjectName", project.ProjectName); 
        }}
      />
    </div>
  );
};

export default General;
