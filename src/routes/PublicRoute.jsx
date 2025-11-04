import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    const isSuperUser = Boolean(user?.is_super_user);
    const redirectPath = isSuperUser ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
