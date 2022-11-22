import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import InventoryIcon from "@mui/icons-material/Inventory";

export const TotalSoldProduct = ({ totalSoldProduct }) => (
  <Card>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TOTAL SOLD PRODUCTS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {totalSoldProduct}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <InventoryIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
