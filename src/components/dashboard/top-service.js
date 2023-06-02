import { Avatar, Box, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import InventoryIcon from "@mui/icons-material/Inventory";

export const TopService = ({ topService }) => (
  <Card>
  <CardContent>
    <Typography color="textSecondary" gutterBottom variant="overline">
      TOP SERVICES
    </Typography>

    {topService.map((service, index) => (
      <Typography
        key={service.name}
        variant={index === 0 ? "h6" : index === 1 ? "subtitle1" : "body1"}
        fontWeight={index === 0 ? "bold" : index === 1 ? "bold" : "normal"}
        color={index === 0 ? "red" : "black"}
      >
        {`${service.name}`}
      </Typography>
    ))}
  </CardContent>
</Card>




);

