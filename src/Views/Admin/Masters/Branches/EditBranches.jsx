import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBranchFormsById, updateBranch } from "../../../../store/slices/branchesSlice";
import BranchForm from "./BranchForm";


const EditBranches = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { branches } = useSelector((state) => state.branches);
  const branche = branches && branches.find((c) => c.id === id);
    const { companies = [] } = useSelector((state) => state.companies);

    const selBranche = {
    companyId: branche.Company?.id,
        branch_code: branche.branch_code,
        name: branche.name,
        city: branche.city,
        address: branche.address,
        is_main: branche.is_main? "true" : "false",

        status: JSON.stringify(branche.status),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!branche) {
          const res = await dispatch(fetchBranchFormsById(id)).unwrap();
          if (res.message === "Please Login!") {
            navigate("/login");
          }
        }
      } catch (err) {
        setApiError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, branche]);
  const handleUpdate = async (data) => {
    console.log("handleUpdate", data);

    try {
      const res = await dispatch(updateBranch({ id, data })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/branches");
      }
      navigate("/admin/branches");
    } catch (error) {
      setApiError(error.error||"Failed to update branch");
    }
  };
  return (
    <BranchForm
      onSubmit={handleUpdate}
      companies={companies}
      apiError={apiError}
      mode="edit"
      defaultValues={selBranche}
    />
  );
};




export default EditBranches
