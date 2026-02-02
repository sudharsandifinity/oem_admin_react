import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import { useEffect, useState } from "react";
import { createEmployee } from "../../../../store/slices/usersSlice";

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const [apiError, setApiError] = useState(null);
  const [addDetail, setAddDetail] = useState({
      companyId: "",
      formId: "",
      branchId: "",
    });

  const handleCreate = async (data) => {
    console.log("handlecreate", data,addDetail);
    try {
      
      const payload = {
        company_id: data.companyId,
        roleIds: data.roleIds,
        branchIds: data.branchIds,
      };
console.log("handlecreate payload", payload, addDetail);
      const res = await dispatch(createEmployee(payload)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/employees");
      }
    } catch (err) {
      console.log("err",err)
      setApiError(err?.message || "Failed to create Employee");
    }
  };

  return <EmployeeForm addDetail={addDetail} setAddDetail={setAddDetail}  defaultValues = {{
    roleIds: [],
    companyId: "",
    branchIds: [],
}} onSubmitCreate={handleCreate} mode="create" apiError={apiError}/>;
};


export default CreateEmployee