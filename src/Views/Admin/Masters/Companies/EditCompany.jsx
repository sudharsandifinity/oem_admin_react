import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Companyformdetails from "./Companyformdetails";
import {
  fetchCompanyById,
  updateCompany,
} from "../../../../store/slices/companiesSlice";

const EditCompany = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { companies } = useSelector((state) => state.companies);
  const company = companies && companies.find((c) => c.id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!company) {
          const res = await dispatch(fetchCompanyById(id)).unwrap();
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
  }, [dispatch, id, company]);
  const handleUpdate = async (data) => {
    console.log("handleUpdate", data);

    try {
      const res = await dispatch(updateCompany({ id, data })).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/companies");
      }
      navigate("/admin/companies");
    } catch (error) {
      setApiError(error.error || "Failed to update company");
    }
  };
  return (
    <Companyformdetails
      onSubmit={handleUpdate}
      apiError={apiError}
      mode="edit"
      defaultValues={{
        name: company?.name,
        company_code: company?.company_code,
        company_db_name: company?.company_db_name,
        base_url: company?.base_url,
        sap_username: company?.sap_username,
        secret_key: company?.secret_key,
        is_branch: JSON.stringify(company?.is_branch),
        status: JSON.stringify(company?.status),
      }}
    />
  );
};

export default EditCompany;
