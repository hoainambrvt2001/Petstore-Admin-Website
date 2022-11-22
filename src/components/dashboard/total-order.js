import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const TotalOrder = ({ totalOrder }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TOTAL ORDER
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {totalOrder}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <ShoppingCartIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
