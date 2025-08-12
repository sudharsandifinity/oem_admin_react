import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const {user} = useSelector((state) => state.auth);
  
  if (user) {
    return <Navigate to="/UserDashboard" replace />;
  }

  return children;
}