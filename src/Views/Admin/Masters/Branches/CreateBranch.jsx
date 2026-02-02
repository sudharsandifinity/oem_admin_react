import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BranchForm from "./BranchForm";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { createBranch } from "../../../../store/slices/branchesSlice";
import { set } from "react-hook-form";

const CreateBranch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const { companies } = useSelector((state) => state.companies);

  useEffect(() => {
    //dispatch(fetchCompanies());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        setApiError(err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);

  const handleSubmit = async (data) => {
    try {
      const res = await dispatch(createBranch(data)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      }
      navigate("/admin/branches");
    } catch (err) {
      setApiError(err?.message || "Failed to create branch");
    }
  };

  return (
    <BranchForm
      onSubmit={handleSubmit}
      companies={companies}
      defaultValues={{
        companyId: "",
        is_main: "1",
        name: "",
        city: "",
        address: "",
        status: "1",
      }}
      apiError={apiError}
    />
  );
};

export default CreateBranch;
