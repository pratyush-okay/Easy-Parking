import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Link } from "react-router-dom";
import AlertContext from "../../../CustomAlert/AlertContext";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, IconButton } from "@mui/material";
import Map from "../../../Maps/EditMap/map";
import SmallMap from "../../../Maps/DisplayMap/small_map";
import TransCoorAddr from "../../../TransCoorAddr";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteFavourites";


// Style for the paper items in the grid
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

// Style for the modal
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const Favourites = () => {
    const [locations, setLocations] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const user_email = localStorage.getItem("UserEmail");
    const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedFavIdDelete, setSelectedFavIdDelete] = useState(null);
  // Rest of your state and useEffects remain the same

  const handleOpenModalDelete = (parkingId) => {
    setSelectedFavIdDelete(parkingId);
    setOpenModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setOpenModalDelete(false);
    setSelectedFavIdDelete(null);

  };

  const fetchData = async () => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/user/fav/get",
            {
                user_email: user_email,
            }
        );
        const data = JSON.parse(response.data);
        const locations = data.map((item) => ({
            location_id: item.pk,
            address: item.fields.location,
            name: item.fields.name,
            latitude: item.fields.latitude,
            longitude: item.fields.longitude,
        }));
        setLocations(locations);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

    useEffect(() => {
        fetchData();
    });


    // Modal open/close handlers
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // AddFavourite component rendered inside the modal
    const AddFavouriteModal = ({ handleClose }) => {

        const [currentCoord, setCurrentCoord] = useState({ lat: 0, lng: 0 }); 
        const [addressForSearch, setAddressForSearch] = useState("");
        const { customAlert } = useContext(AlertContext);
        const [location, setLocation] = useState("");
        const [name, setName] = useState("");

        const setAdd = async (add) => {
            const coor = await TransCoorAddr(add, "address_to_coor");
            setCurrentCoord(coor);
            console.log(coor);
        };
    
        useEffect(() => {
            if (addressForSearch) {
              setAdd(addressForSearch);
            }
          }, [addressForSearch]);


        const handleAddFavourite = async () => {
            if (!location || !name) {
                customAlert("Please fill in all fields");
                return;
            }

            try {
                await axios.post("http://localhost:8000/user/fav/set", {
                    user_email,
                    location,
                    latitude: currentCoord.lat,
                    longitude: currentCoord.lng,
                    name,
                });
                handleClose();
            } catch (error) {
                console.error("Error adding favorite location:", error);
            }
        };

        return (
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add a new favorite location
                </Typography>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e)=>{
                        setName(e.target.value);
                    }
                    }
                    fullWidth
                    sx={{ mt: 2, mb: 1 }}
                />
                <TextField
                    label="Location"
                    value={location}
                    onChange={(e)=>{
                        setLocation(e.target.value);
                    }}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="search"
                                    onClick={() => setAddressForSearch(location)}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Paper
                    elevation={3}
                    style={{
                        height: 300, 
                        width: "100%",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Map
                        currentLocation={{ lat: 40.7128, lng: -74.006 }}
                        coor={currentCoord}
                        setCurrentCoord={setCurrentCoord}
                    />
                </Paper>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFavourite}
                >
                    Add Favorite
                </Button>
            </Box>
        );
    };

    return (
        <div className="home">
            <div className="PagePath">
                <Link className="Link" to="/profile">Profile</Link>
                &nbsp;{">"}&nbsp; Favourite locations
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {locations.map((location, index) => (
                        <Grid key={index} xs={12} sm={6} md={4} lg={3} item>
                            <Item>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {location.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {location.address}
                                    </Typography>
                                    <SmallMap
                                        coor={{ lat: location.latitude, lng: location.longitude }}
                                    />
                                    <IconButton aria-label="delete" onClick={() => handleOpenModalDelete(location.name)}>
                <DeleteIcon />
              </IconButton>
                                </CardContent>
                            </Item>
                        </Grid>
                    ))}

                    {locations.length < 3 ? (
                        <Grid xs={12} sm={6} md={4} lg={3} item>
                            <Item>
                                <CardActions>
                                    <Button onClick={handleOpenModal} size="small">
                                        Add a Favourite
                                    </Button>
                                </CardActions>
                            </Item>
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Typography textAlign="center" color="error">
                                You have reached the maximum number of favourite locations.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="add-favourite-modal-title"
                aria-describedby="add-favourite-modal-description"
            >
                <AddFavouriteModal handleClose={handleCloseModal} />
            </Modal>
            {openModalDelete && (
                <DeleteModal
                    open={openModalDelete}
                    onClose={handleCloseModalDelete}
                    parkingId={selectedFavIdDelete}
                    fetchData={() => {
                        handleCloseModalDelete();
                        fetchData();
                    }}
                />
            )}

        </div>
    );
};

export default Favourites;
