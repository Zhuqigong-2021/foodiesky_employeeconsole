import { FC } from "react";

import { Navigate } from "react-router-dom";

interface PropType {
  component: React.FC;
}

const PrivateRoute: FC<PropType> = ({ component: Component }) => {
  const accessToken = localStorage.getItem("currentUser");

  if (accessToken) return <Component />;
  return <Navigate to="/login" />;
};

export default PrivateRoute;
