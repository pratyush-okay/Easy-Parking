import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function TotalListings({title,title2,title3,count,count2,count3}) {
  
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}<span style={{ marginLeft: "5px" }}></span>{title2} <span style={{ marginLeft: "5px" }}>{title3}</span>
        </Typography>
        <Typography variant="h5">{count}<span style={{ marginLeft: "97px" }}>{count2}</span><span style={{ marginLeft: "60px" }}>{count3}</span></Typography>
      </CardContent>
    </Card>
  );
}

export default TotalListings;