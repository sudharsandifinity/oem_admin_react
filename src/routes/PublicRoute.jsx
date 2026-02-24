import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchAuthUser, fetchAuthUsercheck, login } from "../store/slices/authSlice";
import { fetchCompanies } from "../store/slices/companiesSlice";
import { fetchBranch } from "../store/slices/branchesSlice";

export default function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 important

  useEffect(() => {
    const fetchInitial = async () => {
      try {
          const res=await dispatch(fetchAuthUsercheck()).unwrap();
        
          
       console.log("fetchAuthUsercheck",res)
        setApiError(null);
        // Clear any previous errors on success
      } catch (err) {
        console.error("Error in fetchInitial:", err);
        setTimeout(() => {
          setApiError(err.message || "Failed to fetch user data");
        }, 2000); // Delay to ensure state updates correctly
        //setApiError(err.message || "Failed to fetch user data");

        
      } finally {
        setLoading(false); // 👈 stop loading after API completes
      }
    };

    fetchInitial();
  }, [dispatch, token, navigate]);

  // 👇 Wait until useEffect finishes
  if (loading) {
    return null; // or loader component
  }

  // 👇 Now this runs AFTER useEffect
  console.log("apiError",apiError)
    if (user && !apiError && token) {
    console.log("fetchuser")
    const isSuperUser = Boolean(user?.is_super_user);
    const redirectPath = isSuperUser ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
 

  return children;
}
