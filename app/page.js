'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  InputBase,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Badge,
  Collapse,
  Snackbar,
  Fade,
  Tooltip,
  AppBar,
  Toolbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloseIcon from '@mui/icons-material/Close';
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
    showSnackbar(`Added 1 ${item} to inventory`);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        showSnackbar(`Removed ${item} from inventory`);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
        showSnackbar(`Removed 1 ${item} from inventory`);
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter((item) => item.name.toLowerCase().includes(event.target.value.toLowerCase())));
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{ bgcolor: '#f0f4f8' }}
    >
      <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Inventory Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        p={2}
      >
        <Modal open={open} onClose={handleClose}>
          <Fade in={open}>
            <Box
              position="absolute"
              top="40%"
              left="36%"
              transform="translate(-50%, -50%)"
              width={400}
              bgcolor="white"
              borderRadius={2}
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
            >
              <Typography variant="h6">Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addItem(itemName);
                    setItemName('');
                    handleClose();
                  }}
                  sx={{ bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' } }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Modal>

        {!showInventory ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              width="600px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
              p={4}
              sx={{ bgcolor: '#fff', textAlign: 'center', borderRadius: '12px', boxShadow: 3 }}
            >
              <Typography variant="h4" gutterBottom>
                Welcome to your Pantry!
              </Typography>
              <Typography variant="body1" paragraph>
                This inventory system helps you manage your pantry efficiently. You can add new items, update quantities, and search for existing items with ease.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowInventory(true)}
                sx={{ bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' } }}
              >
                View Inventory
              </Button>
            </Box>
          </motion.div>
        ) : (
          <Collapse in={showInventory}>
            <Box width="800px" px={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{ mb: 2, bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' } }}
              >
                Add New Item
              </Button>
              <Paper
                component="form"
                sx={{ display: 'flex', alignItems: 'center', width: 400, mb: 2, p: '2px 4px' }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search Inventory"
                  inputProps={{ 'aria-label': 'search inventory' }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
            <Box border="1px solid #e0e0e0" width="800px" borderRadius="8px" boxShadow={5} p={2} bgcolor="#fff">
              <Box
                width="100%"
                height="100px"
                bgcolor="#3498db"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="8px 8px 0 0"
              >
                <Typography variant="h2" color="#fff">
                  Inventory Items
                </Typography>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{ maxHeight: '500px', overflowY: 'auto', bgcolor: '#fff', borderRadius: '0 0 8px 8px', p: 2 }}
              >
                {filteredInventory.map(({ name, quantity }) => (
                  <Grid item xs={12} sm={6} md={4} key={name}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card sx={{ bgcolor: '#f9f9f9', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 } }}>
                        <CardContent>
                          <Typography variant="h5" color="#333" textAlign="center">
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Box display="flex" justifyContent="center" alignItems="center">
                            <Badge badgeContent={quantity} color="primary">
                              <Typography variant="h6" color="#333">
                                Quantity
                              </Typography>
                            </Badge>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                          <Tooltip title="Add one">
                            <Button
                              variant="contained"
                              style={{ backgroundColor: '#2ecc71', color: '#fff' }}
                              startIcon={<AddIcon />}
                              onClick={() => {
                                addItem(name);
                              }}
                            >
                              Add
                            </Button>
                          </Tooltip>
                          <Tooltip title="Remove one">
                            <Button
                              variant="contained"
                              style={{ backgroundColor: '#e74c3c', color: '#fff' }}
                              startIcon={<RemoveIcon />}
                              onClick={() => {
                                removeItem(name);
                              }}
                            >
                              Remove
                            </Button>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}