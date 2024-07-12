import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import ApiCallGet from "../../../action/ApiCallGet.jsx";
import { useNavigate } from "react-router-dom";
import CustomProfileCard from "../../CustomProfileCard.jsx";
import AnayticsAdmin from "./AnalyticsOverallPart.jsx";
import { Container } from "@mui/material";

function AnalyticsDashboard() {
    const navigate = useNavigate();
    const [allGuest, setAllGuest] = React.useState(null);
    const [allHost, setAllHost] = React.useState(null);
    const [allGuestCount, setAllGuestCount] = React.useState(0);
    const [allHostCount, setAllHostCount] = React.useState(0);

    React.useEffect(() => {
        getAllUsers();
    }, []);

    /* get all user */
    const getAllUsers = async () => {
        const data = await ApiCallGet("user/all", {}, "", false);
        if (data) {
            const dataName = JSON.parse(data);
            const guests = [];
            const hosts = [];
            dataName.forEach((user) => {
                const user_type = user.fields.user_type;
                const email = user.fields.email;
                const name = user.fields.name;
                if (user_type === "guest") {
                    guests.push({ email, name });
                } else if (user_type === "host") {
                    hosts.push({ email, name });
                }
            });
            setAllGuest(guests);
            setAllHost(hosts);
        }
    };

    const directToHost = () => {
        if (allHost && allHost.length > 0) {
            navigate("/admin/analytics/host", { state: { allHost } });
        } else {
            navigate("/admin/analytics/host", { state: { allHost: null } });
        }
    };

    const directToGuest = () => {
        
        if (allHost && allHost.length > 0) {
            navigate("/admin/analytics/guest", { state: { allGuest } });
        } else {
            navigate("/admin/analytics/guest", { state: { allGuest: null } });
        }
    };

    const items = {
        host: {
            Guest: directToGuest,
            Host: directToHost,
        },
    };

    const description = {
        Guest: `${allGuestCount}`,
        Host: `${allHostCount}`,
    };

    return (
          <Container maxWidth="lg">
            <Grid
                container
                justifyContent="center"
                spacing={3}
                sx={{ width: "100%"}}
            >
                {Object.entries(items.host).map(([key, value]) => {
                    return (
                        <CustomProfileCard
                            handleOnclick={value}
                            title={key}
                            description={description[key]}
                        />
                    );
                })}
            </Grid>
            <AnayticsAdmin setAllGuestCount={setAllGuestCount} setAllHostCount={setAllHostCount} />
        </Container>
    );
}

export default AnalyticsDashboard;
