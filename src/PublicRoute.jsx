import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const {user} = useSelector((state) => state.auth);
  
  if (user) {
    if (user.is_super_user === 0) {
      return <Navigate to="/UserDashboard" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}