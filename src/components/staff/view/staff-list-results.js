import { useState } from "react";
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
import { getInitials } from "../../../utils/get-initials";
import { MdOutlineEdit, MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
const DELETE_STAFF = gql`
mutation Mutation($deleteUserId: ID!) {
  deleteUser(id: $deleteUserId) {
    id
  }
}
`
const StaffListResults = ({ staffs, ...rest }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState("")


  const handleSelectAll = (event) => {
    let newSelectedProductIds;

    if (event.target.checked) {
      newSelectedProductIds = staffs.map((staff) => staff.id);
    } else {
      newSelectedProductIds = [];
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProductIds.indexOf(id);
    let newSelectedProductIds = [];

    if (selectedIndex === -1) {
      newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds, id);
    } else if (selectedIndex === 0) {
      newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds.slice(1));
    } else if (selectedIndex === selectedProductIds.length - 1) {
      newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProductIds = newSelectedProductIds.concat(
        selectedProductIds.slice(0, selectedIndex),
        selectedProductIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const renderProductCategories = (categories) => {
    let renderStr = "";
    categories.forEach((category) => {
      renderStr += category.category_name + ", ";
    });

    return renderStr.slice(0, -2);
  };

  const handleDelete = (id) => {

    setDeleteId(id);
    setShowConfirmation(true);
  }
  const [deleteStaffMutation, { loading: mutationLoading, error: mutationError }] = useMutation(DELETE_STAFF, {
    client: new ApolloClient({
      uri: 'http://localhost:3000/graphql',
      cache: new InMemoryCache(),
    })
  })
  const handleConfirmationClose = async (confirmed) => {

    setShowConfirmation(false);
    if (confirmed) {
      try {
        const { data } = await deleteStaffMutation({
          variables: { deleteUserId: deleteId },
        })
        alert("The staff is Deleted");

        window.location.href = "/staffs";
      }
      catch (error) {
        console.log(error);
        throw error;
      }
    }

  }
  return (
    <Card {...rest}>
      <Grid container>
        <Grid item xs={12}></Grid>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">

              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.slice(page * limit, (page + 1) * limit).map((staff)=>(
              <TableRow
              hover
              key={staff.id}

            >
              <TableCell>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Avatar
                  src={
                    staff.avatar
                      ? staff.avatar.url
                      : "/static/images/avatars/blank_avatar.png"
                  }
                  sx={{ width: 56, height: 56, mr: 2 }}
                >
                  {getInitials(staff.name)}
                </Avatar>
              </Box>
            </TableCell>
            <TableCell>{staff.id}</TableCell>
            <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
            <TableCell>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Link href={`/staffs/edit/${staff.id}?isEdited=false`} passHref>
                      <a>
                        <MdOutlineRemoveRedEye
                          fontSize={24}
                          style={{ margin: "0px 5px", cursor: "pointer" }}
                        />
                      </a>
                    </Link>

                    <Link href={`/staffs/edit/${staff.id}?isEdited=true`} passHref>
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
                        onClick={() => handleDelete(staff.id)}
                      />
                    </a>
                  </Box>
                </TableCell>
            </TableRow>
            ))}
          </TableBody>


        </Table>
      </Grid>
      <TablePagination
        component="div"
        count={staffs.length}
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
            <DialogContentText> Are you sure to delete this staff? </DialogContentText>

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

StaffListResults.propTypes = {
  staffs: PropTypes.array.isRequired,
};

export default StaffListResults;
