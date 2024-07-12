import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
// import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./FavouritesHome.css";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function FavouritesHome() {

    const parkings = [
        {
            location: 'Parking Location 1',
            description: 'Parking Description 1',
            parking_space_height: 2.5,
            parking_space_width: 2.0,
            parking_space_length: 5.0,
            rating: 4,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        {
            location: 'Parking Location 2',
            description: 'Parking Description 2',
            parking_space_height: 2.0,
            parking_space_width: 2.5,
            parking_space_length: 4.5,
            rating: 3,
        },
        // Add more parking objects as needed
    ];
    return (
        <div className='home'>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {parkings.map((parking, index) => (
                        <Grid key={index} xs={12} sm={6} md={4} lg={3} item>
                            <Item sx={{ minWidth: 275 }}>
                                <CardContent>
                                <Typography sx={{ mb:2 }} variant="h5" component="div">
                                        {parking.location}
                                    </Typography>
                                    <Typography sx={{ fontSize: 18, mb:2 }} color="text.secondary" gutterBottom>
                                        {parking.description}
                                    </Typography>
                                    
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {parking.parking_space_height}m x {parking.parking_space_width}m x {parking.parking_space_length}m
                                    </Typography>
                                    <Typography variant="body2">
                                        {parking.rating}/5
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Details</Button>
                                </CardActions>
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
}

export default FavouritesHome;
