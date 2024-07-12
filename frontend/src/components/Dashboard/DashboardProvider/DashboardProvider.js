import React from "react";
import AllListingsProvider from "./AllListingsProvider/AllListingsProvider";

const DashboardProvider = () => {
  return (
    <div>
      {/*
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {breadcrumbs}
      </Breadcrumbs>
      */}

      <h1>My Listings</h1>
      {/* <h1>Analytics</h1> */}
      <AllListingsProvider />
    </div>
  );
};

export default DashboardProvider;
