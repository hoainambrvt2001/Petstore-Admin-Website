import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { MdOutlineEdit, MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import { format } from "date-fns";
import { SeverityPill } from "../../severity-pill";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
const DELETE_SERVICE = gql`
mutation Mutation($deleteServiceTypeId: ID!) {
  deleteServiceType(id: $deleteServiceTypeId) {
    _id
  }
}
`
const ServiceListResults = ({ services, ...rest }) => {
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState("")
  const indexOfLastService = (page + 1) * limit;
  const indexOfFirstService = indexOfLastService - limit;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const handleSelectAll = (event) => {
    let newSelectedServiceIds;

    if (event.target.checked) {
      newSelectedServiceIds = services.map((service) => service._id);
    } else {
      newSelectedServiceIds = [];
    }

    setSelectedServiceIds(newSelectedServiceIds);

  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedServiceIds.indexOf(id);
    let newSelectedServiceIds = [];

    if (selectedIndex === -1) {
      newSelectedServiceIds = newSelectedServiceIds.concat(selectedServiceIds, id);
    } else if (selectedIndex === 0) {
      newSelectedServiceIds = newSelectedServiceIds.concat(selectedServiceIds.slice(1));
    } else if (selectedIndex === selectedServiceIds.length - 1) {
      newSelectedServiceIds = newSelectedServiceIds.concat(selectedServiceIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedServiceIds = newSelectedServiceIds.concat(
        selectedServiceIds.slice(0, selectedIndex),
        selectedServiceIds.slice(selectedIndex + 1)
      );
    }

    setSelectedServiceIds(newSelectedServiceIds);
  };
  const handleDelete = (id) => {
    console.log(id)
    setDeleteId(id);
    setShowConfirmation(true);
  }
  const [deleteServiceMutation, { loading: mutationLoading, error: mutationError }] = useMutation(DELETE_SERVICE, {
    client: new ApolloClient({
      uri: 'http://localhost:3000/graphql',
      cache: new InMemoryCache(),
    })
  })
  const handleConfirmationClose = async (confirmed) => {
    console.log("deleteId", deleteId);
    setShowConfirmation(false);
    if (confirmed) {
      try {
        const { data } = await deleteServiceMutation({
          variables: { deleteServiceTypeId: deleteId },
        })
        alert("The service is Deleted");
        console.log(data);
        window.location.href = "/services";
      }
      catch (error) {
        console.log(error);
        throw error;
      }
    }

  }
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const renderPrice = (price) => {
    if (price.minWeight === 0) {
      return <Typography>
        {`Less than ${price.maxWeight} Kg: $${price.priceNumber}`}
      </Typography>
    }
    if (price.maxWeight > 1000) {
      return <Typography>
        {`More than ${price.minWeight} Kg: $${price.priceNumber}`}
      </Typography>
    }
    else {
      return <Typography>
        {`${price.minWeight} Kg to ${price.maxWeight} Kg: $${price.priceNumber}`}
      </Typography>
    }



  }


  return (
    <Card {...rest}>
      <Grid container>
        <Grid item xs={12}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Prices</TableCell>
                <TableCell>Time Serve</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentServices.map((service) => (
                <TableRow>
                  <TableCell>{service.name}</TableCell>
                  <TableCell> {service.description}</TableCell>
                  <TableCell>{service.price.map((i) => (renderPrice(i)))}</TableCell>
                  <TableCell>{service.timeServe}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Link href={`/services/edit/${service._id}?isEdited=false`} passHref>
                        <a>
                          <MdOutlineRemoveRedEye
                            fontSize={24}
                            style={{ margin: "0px 5px", cursor: "pointer" }}
                          />
                        </a>
                      </Link>
                      <Link href={`/services/edit/${service._id}?isEdited=true`} passHref>
                        <a>
                          <MdOutlineEdit
                            fontSize={24}
                            style={{ margin: "0px 5px", cursor: "pointer" }}
                          />
                        </a>
                      </Link>
                      <a>
                        <MdDeleteOutline
                          fontSize={24}
                          style={{ margin: "0px 5px", cursor: "pointer" }}
                          onClick={() => handleDelete(service._id)}
                        />
                      </a>
                      {/*
                      <MdDeleteOutline
                        fontSize={24}
                        style={{ margin: "0px 5px", cursor: "pointer" }}
                      /> */}
                    </Box>
                  </TableCell>
                </TableRow>

              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <TablePagination
        component="div"
        count={services.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 20]}
      />

      <Box>
        <Dialog open={showConfirmation} onClose={() => handleConfirmationClose(false)}>
          <DialogTitle><Typography fontWeight={"bold"} fontSize={25}>Confirm Submission</Typography></DialogTitle>
          <DialogContent>
            <DialogContentText> Are you sure to delete this service? </DialogContentText>



          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleConfirmationClose(false)}>Go Back</Button>
            <Button onClick={() => handleConfirmationClose(true)}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>

  );
};

ServiceListResults.propTypes = {
  services: PropTypes.array.isRequired,
};

export default ServiceListResults;