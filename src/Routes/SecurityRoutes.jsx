import { Route } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout";
import PrivateRoute from "../private/PrivateRoute";
import HistoryVisitorList from "../pages/HistoryVisitorList";
import VisitorForm from "../pages/security-views/VisitorForm";
import SecVisitorList from "../pages/security-views/SecVisitorList";

import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";

export const securityRoutes = [
  {
    key: "/Security",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Registration",
  },
  {
    type: "divider",
  },
  {
    key: "RegistrationGroup",
    label: (
      <span style={{ color: "#ac8342", fontWeight: "medium" }}>
        Registration
      </span>
    ),
    type: "group",
    children: [
      {
        key: "/Security/visitors-list",
        label: "Visitor List",
        icon: <UserOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
];

export default function SecurityRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={["Security"]} />}>
      <Route path="/Security" element={<MainLayout />}>
        {/* Set VisitorForm as the default (index) page */}
        <Route index element={<VisitorForm />} />
        <Route path="visitor-form/:visitorNo?" element={<VisitorForm />} />
        <Route path="visitors-list" element={<SecVisitorList />} />
        <Route path="history-list" element={<HistoryVisitorList />} />
      </Route>
    </Route>
  );
}
