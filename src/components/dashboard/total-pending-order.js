import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export const TotalPendingOrder = ({ totalPendingOrder }) => (
  <Card>
    <CardContent>
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TOTAL PENDING ORDER
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {totalPendingOrder}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <ShoppingCartCheckoutIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
