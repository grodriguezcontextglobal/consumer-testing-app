import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OptionsMainPage = () => {
  const navigate = useNavigate();
  return (
    <Grid container>
      <Grid
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        margin={"1rem auto 0rem"}
        item
        xs={10}
      >
        <Button
          onClick={() => navigate("/device-selection")}
          style={{
            display: "flex",
            padding: "12px 20px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            border: "1px solid var(--blue-dark-600, #155EEF)",
            // background: "var(--blue-dark-600, #155EEF)",
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            width: "100%",
          }}
        >
          <Typography
            textTransform={"none"}
            fontFamily={"Inter"}
            fontSize={"18px"}
            fontStyle={"normal"}
            fontWeight={600}
            lineHeight={"20px"}
            color={"var(--blue-dark-600, #155EEF"}
          >
            Create new order
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default OptionsMainPage;
