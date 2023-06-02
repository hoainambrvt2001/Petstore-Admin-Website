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
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState("")
  const indexOfLastService = (page + 1) * limit;
  const indexOfFirstService = indexOfLastService - limit;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);



  const handleDelete = (id) => {

    setDeleteId(id);
    setShowConfirmation(true);
  }
  const [deleteServiceMutation, { loading: mutationLoading, error: mutationError }] = useMutation(DELETE_SERVICE, {
    client: new ApolloClient({
      uri: 'https://thesis-backend-production-99f6.up.railway.app/graphql',
      cache: new InMemoryCache(),
    })
  })
  const handleConfirmationClose = async (confirmed) => {

    setShowConfirmation(false);
    if (confirmed) {
      try {
        const { data } = await deleteServiceMutation({
          variables: { deleteServiceTypeId: deleteId },
        })
        alert("The service is Deleted");

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
  const renderServicePrice = (service) => {
    if (service.price.length === 1) {
      return `$${service.price[0].priceNumber}`;
    }
    return service.price.map((price, index) => {
      return <div key={index}>{renderPrice(price)}</div>
    });
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
                  <TableCell>{service.description.length > 50
                    ? service.description.slice(0, service.description.lastIndexOf(" ", 50)) + " ..."
                    : service.description}
                  </TableCell>

                  <TableCell>{renderServicePrice(service)}</TableCell>
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
