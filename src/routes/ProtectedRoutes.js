import React from "react";
import EmployeeManagemnt from "../employee/List";
import UserManagemnt from "../user/List";
import OrgManagement from "../organization/List";
import RoomManagement from "../room/RoomList";
import VehicleManagement from "../vehicle/VehicleManagement";


const protectedRoutes = [
  // { path: "employee/list", element: <EmployeeManagemnt /> },
  {path: "user/list", element: <UserManagemnt />},
  {path: "org/list", element: <OrgManagement />},
  {path: "room/list", element: <RoomManagement />},
  {path: "vehicle/list", element: <VehicleManagement />}
]

export default protectedRoutes;