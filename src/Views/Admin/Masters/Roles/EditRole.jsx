import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RoleForm from './RoleForm';
import { useEffect, useState } from 'react';
import { fetchPermissions } from '../../../../store/slices/permissionSlice';
import { fetchRoleById, updateRole } from '../../../../store/slices/roleSlice';

const EditRole = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [apiError, setApiError] = useState(null);
    const { permissions, loading: permissionsLoading } = useSelector(state => state.permissions);
    const { currentRole, loading: roleLoading } = useSelector(state => state.roles);

    useEffect(() => {
        //dispatch(fetchPermissions());
        //dispatch(fetchRoleById(id));
 const fetchData = async () => {
          try {
            const res = await dispatch(fetchPermissions()).unwrap();
            console.log("resusers", res);
            dispatch(fetchRoleById(id));
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
            data: {
            name: data.name,
            scope: data.scope,
            status: parseInt(data.status),
            branchId: data.branchId === "null" ? "null" : data.branchId,
        ...(data.scope === "master"
          ? {
              // master → use permissionIds only
              permissionIds: (data.permissionIds || []).map((perm) =>
                typeof perm === "object" ? perm.id : perm
              ),
            }
          : {
              // user → use userMenus only
              userMenus: data.userMenus || [],
            }),
            }
        };
   
      await dispatch(updateRole(payload)).unwrap();
      navigate('/admin/roles');
    } catch (err) {
      setApiError(err.message || 'Failed to update role');
    }
  };

  if (roleLoading || permissionsLoading || !currentRole) {
    return <div>Loading...</div>;
  }
{console.log("currentRole",currentRole  )}
  return <RoleForm 
            onSubmit={handleUpdate} 
            defaultValues={{
                id: currentRole.id,
                name: currentRole.name || '',
                scope:currentRole.scope || 'user',
                branchId: currentRole.branchId ? String(currentRole.branchId) : 'null',
                status: String(currentRole.status ?? '1'),
                permissionIds: Array.isArray(currentRole.Permissions)
                ? currentRole.Permissions.map(p => p.id)
                : [],
                 UserMenus: currentRole.UserMenus ? currentRole.UserMenus : []
            }}
            permissions={permissions} 
            apiError={apiError} 
            mode="edit"
        />;
};

export default EditRole
