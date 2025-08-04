import { Can } from "../hooks/casl";

import { Outlet } from "react-router-dom";

const PrivateRoute = ({ permission, resource }) => {
  console.log({ permission, resource });

  return (
    <>
      <Can I={permission} this={resource}>
        {() => <Outlet />}
      </Can>
    </>
  );
};

export default PrivateRoute;
