import { Can } from "../hooks/casl";

import { Outlet } from "react-router-dom";

const PrivateRoute = ({ permission, resource }) => (
  <Can I={permission} this={resource}>
    <Outlet />
  </Can>
);

export default PrivateRoute;
