import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function TotalListings({title,count}) {

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5">{count}</Typography>
      </CardContent>
    </Card>
  );
}

export default TotalListings;