import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }
const { token } = useSelector((state) => state.auth);
console.log("privateroute",token)
if (!user) {
  const stored = localStorage.getItem("user");
  if (stored) return null; // wait until Redux loads
  return <Navigate to="/login" />;
}
  return children;
}
