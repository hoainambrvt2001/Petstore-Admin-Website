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
const DELETE_PRODUCT = gql`
mutation DeleteProduct($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId) {
    success
    msg
  }
}
`
const ProductListResults = ({ products, ...rest }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState("")


  const handleSelectAll = (event) => {
    let newSelectedProductIds;

    if (event.target.checked) {
      newSelectedProductIds = products.map((product) => product.id);
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
  const [deleteProductMutation, { loading: mutationLoading, error: mutationError }] = useMutation(DELETE_PRODUCT, {
    client: new ApolloClient({
      uri: 'http://localhost:3000/graphql',
      cache: new InMemoryCache(),
    })
  })
  const handleConfirmationClose = async (confirmed) => {

    setShowConfirmation(false);
    if (confirmed) {
      try {
        const { data } = await deleteProductMutation({
          variables: { deleteProductId: deleteId },
        })
        alert("The product is Deleted");
        
        window.location.href = "/products";
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
                <Checkbox
                  checked={selectedProductIds.length === products.length}
                  color="primary"
                  indeterminate={
                    selectedProductIds.length > 0 && selectedProductIds.length < products.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * limit, (page + 1) * limit).map((product) => (
              <TableRow
                hover
                key={product.id}
                selected={selectedProductIds.indexOf(product.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProductIds.indexOf(product.id) !== -1}
                    onChange={(event) => handleSelectOne(event, product.id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Avatar
                      src={
                        product.images.length !== 0
                          ? product.images[0].url
                          : "/static/images/no-image-2.png"
                      }
                      alt={
                        product.images.length !== 0 ? product.images[0].image_name : "product image"
                      }
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      {getInitials(product.name)}
                    </Avatar>
                    <Typography color="textPrimary" variant="body1">
                      {product.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{product.productCode}</TableCell>
                <TableCell>{product.productSKU}</TableCell>
                <TableCell>{renderProductCategories(product.categories)}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Link href={`/products/edit/${product._id}?isEdited=false`} passHref>
                      <a>
                        <MdOutlineRemoveRedEye
                          fontSize={24}
                          style={{ margin: "0px 5px", cursor: "pointer" }}
                        />
                      </a>
                    </Link>

                    <Link href={`/products/edit/${product._id}?isEdited=true`} passHref>
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
                        onClick={() => handleDelete(product._id)}
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
        count={products.length}
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
            <DialogContentText> Are you sure to delete this product? </DialogContentText>

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

ProductListResults.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductListResults;
