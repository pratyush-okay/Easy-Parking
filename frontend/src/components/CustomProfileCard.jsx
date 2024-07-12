import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  borderRadius: 10,
  cursor: "pointer",
  transition: theme.transitions.create(["background", "background-color"], {
    duration: theme.transitions.duration.complex,
  }),
  '&:hover': {
    backgroundColor: 'rgb(237, 237, 237)',
  }
}));

const CustomListingCard = (props) => {
  const handleOnclick = props.handleOnclick;
  return (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        onClick={handleOnclick}
        style={{ cursor: "pointer" }}
      >
        <Item variant="outlined">
          <CardContent>
            <Typography sx={{ mb: 2, height: 30, fontSize: 18, fontWeight: "bold", }} variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography
              sx={{ fontSize: 14, mb: 2, height: 40 }}
              color="text.secondary"
              gutterBottom
            >
              {props.description}
            </Typography>
          </CardContent>
        </Item>
      </Grid>
  );
};

export default CustomListingCard;
