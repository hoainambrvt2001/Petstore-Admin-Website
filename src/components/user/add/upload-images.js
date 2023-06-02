// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";

// Styled component for the upload image inside the dropzone area
const Img = styled("img")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    marginRight: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    width: 100,
  },
}));

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(4),
  },
}));

const FileUploaderSingle = ({ setImages }) => {
  // ** State
  const [files, setFiles] = useState([]);

  // ** Hook
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
      setImages(acceptedFiles);
    },
  });

  const handleLinkClick = (event) => {
    event.preventDefault();
  };

  const img = files.map((file) => (
    <img
      key={file.name}
      alt={file.name}
      className="single-file-image"
      src={file.url ? file.url : URL.createObjectURL(file)}
    />
  ));

  return (
    <Box
      {...getRootProps({ className: "dropzone" })}
      sx={acceptedFiles.length ? { height: 450 } : {}}
    >
      <input {...getInputProps()} />
      <Box
        sx={{ display: "flex", flexDirection: ["column", "column", "row"], alignItems: "center" }}
      >
        <Img width={150} alt="Upload img" src="/static/images/upload-photo.png" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: ["center", "center", "inherit"],
          }}
        >
          <HeadingTypography >Drop files here or click to upload.</HeadingTypography>
          {/* <Typography color="textSecondary">
            Drop files here or click{" "}
            <Link href="/" onClick={handleLinkClick}>
              browse
            </Link>{" "}
            thorough your machine
          </Typography> */}
        </Box>
      </Box>
      {files.length ? img : null}
    </Box>
  );
};

export default FileUploaderSingle;
