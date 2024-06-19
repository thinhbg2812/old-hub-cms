import React from "react";
import EmployeeManagemnt from "../employee/List";
import UserManagemnt from "../user/List";
import OrgManagement from "../organization/List";


const protectedRoutes = [
  // { path: "employee/list", element: <EmployeeManagemnt /> },
  {path: "user/list", element: <UserManagemnt />},
  {path: "org/list", element: <OrgManagement />}
]

export default protectedRoutes;