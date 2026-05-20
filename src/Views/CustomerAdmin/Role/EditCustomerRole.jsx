import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { fetchPermissions } from '../../../store/slices/permissionSlice';
import { fetchBranch } from '../../../store/slices/branchesSlice';
import { fetchRoleById, updateRole } from '../../../store/slices/roleSlice';
import RoleForm from './RoleForm';
import { fetchCustomerAdminRoleById, updateCustomerAdminRole } from '../../../store/slices/customerAdminSlice';


const EditCustomerRole = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [apiError, setApiError] = useState(null);
    const { permissions, loading: permissionsLoading } = useSelector(state => state.permissions);
    const branches = useSelector(state => state.branches.branches);
      const { userList,companyList,roleList, loading } = useSelector((state) => state.customerAdmin);
    
      const currentCustomerAdminRole = roleList && roleList.find((c) => c.id === id);

    useEffect(() => {
        //dispatch(fetchPermissions());
        //dispatch(fetchRoleById(id));
 const fetchData = async () => {
          try {
            const res = dispatch(fetchCustomerAdminRoleById(id)).unwrap();
            await dispatch(fetchPermissions()).unwrap();
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
    }, [dispatch, id]);

  const handleUpdate = async (data) => {
    console.log("object",data)
    try {
        const payload = {
            id,
            data:{name: data.name,
        status: data.status,
        companyId: data.companyId,

        // user → use userMenus only
        userMenuIds: data.customermenus || []}
        };
   
      await dispatch(updateCustomerAdminRole(payload)).unwrap();
      navigate('/CustomerAdmin/RoleManagement');
    } catch (err) {
      setApiError(err.message || 'Failed to update role');
    }
  };


{console.log("currentCustomerAdminRole",currentCustomerAdminRole  )}
  return <RoleForm 
            onSubmit={handleUpdate} 
            defaultValues={{
                id: currentCustomerAdminRole.id,
                name: currentCustomerAdminRole.name || '',
                companyId: currentCustomerAdminRole.companyId||'',
                status: String(currentCustomerAdminRole.status ?? '1'),
                // permissionIds: Array.isArray(currentCustomerAdminRole.Permissions)
                // ? currentCustomerAdminRole.Permissions.map(p => p.id)
                // : [],
                 UserMenus: currentCustomerAdminRole.UserMenus ? currentCustomerAdminRole.UserMenus : []
            }}
            permissions={permissions} 
            apiError={apiError} 
            mode="edit"
        />;
};



export default EditCustomerRole