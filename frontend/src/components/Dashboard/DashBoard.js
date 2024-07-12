import React from "react";
import DashboardConsumer from "./DashboardConsumer/DashBoardConsumer";

function Dashboard({userEmail, userType}) {

  return (
    <div>
      <DashboardConsumer userEmail={userEmail} userType={userType}/>
    </div>
  );
}

export default Dashboard;
