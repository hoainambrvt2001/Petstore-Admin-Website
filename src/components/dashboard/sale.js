import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
export const Sale = ({ text, totalSale }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item xs={12}>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {text ? text : "Need text"}
          </Typography>
          <Typography color="textPrimary" variant="h4">
            ${totalSale.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <AttachMoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
