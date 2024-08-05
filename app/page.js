'use client';
import '@fontsource/comfortaa'; // Import Comfortaa font
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase'; // Ensure this path is correct
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, getDocs, query, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Update inventory list from Firestore
    const updateInventory = async () => {
        try {
            const snapshot = query(collection(firestore, 'inventory'));
            const docs = await getDocs(snapshot);
            const inventoryList = docs.docs.map(doc => ({
                name: doc.id,
                ...doc.data(),
            }));
            setInventory(inventoryList);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    // Remove item from inventory
    const removeItem = async (item) => {
        try {
            const docRef = doc(firestore, 'inventory', item);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                if (quantity > 1) {
                    await setDoc(docRef, { quantity: quantity - 1 });
                } else {
                    await deleteDoc(docRef);
                }
            } else {
                console.warn("Item does not exist:", item);
            }
            await updateInventory();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Add new item or update quantity
    const addItem = async (item) => {
        try {
            const docRef = doc(firestore, 'inventory', item);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                await setDoc(docRef, { quantity: quantity + 1 });
            } else {
                await setDoc(docRef, { quantity: 1 });
            }
            await updateInventory();
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    // Fetch inventory on component mount
    useEffect(() => {
        updateInventory();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Filter inventory based on search query
    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{
                backgroundImage: 'url("/pantry2.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: 'Comfortaa, Arial, sans-serif', // Apply Comfortaa font
            }}
            p={4}
        >
            <Modal open={open} onClose={handleClose}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width={400}
                    bgcolor="rgba(255, 255, 255, 0.8)"
                    border="2px solid transparent" // Transparent border
                    boxShadow={24}
                    p={4}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    sx={{ 
                        fontFamily: 'Comfortaa, Arial, sans-serif',
                        fontWeight: 300, // Lighter weight
                    }} 
                >
                    <Typography variant="h6" sx={{ fontWeight: 300 }}>Add Item</Typography>
                    <TextField
                        variant='outlined'
                        fullWidth
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        sx={{ 
                            fontFamily: 'Comfortaa, Arial, sans-serif', 
                            fontWeight: 300, // Lighter weight
                            '& .MuiOutlinedInput-root': {
                                borderColor: 'transparent', // Transparent border for the input
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                                fontFamily: 'Comfortaa, Arial, sans-serif',
                                fontWeight: 300 // Lighter weight
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent', // Transparent border for the input
                            }
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontFamily: 'Comfortaa, Arial, sans-serif', fontWeight: 300 } // Apply Comfortaa font
                        }}
                        InputProps={{
                            style: { color: 'white', fontFamily: 'Comfortaa, Arial, sans-serif', fontWeight: 300 } // Apply Comfortaa font
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            addItem(itemName);
                            setItemName('');
                            handleClose();
                        }}
                        sx={{ 
                            bgcolor: 'rgba(128, 128, 128, 0.5)',
                            fontFamily: 'Comfortaa, Arial, sans-serif',
                            fontWeight: 300 // Lighter weight
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Modal>
            <Box display="flex" gap={2} width="800px">
                <TextField
                    variant="outlined"
                    placeholder="Search items"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ 
                        bgcolor: 'rgba(128, 128, 128, 0.5)', 
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            height: '56px',
                            color: 'white',
                            borderColor: 'transparent', // Transparent border for the input
                            fontFamily: 'Comfortaa, Arial, sans-serif', // Apply Comfortaa font
                            fontWeight: 300 // Lighter weight
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white',
                            fontFamily: 'Comfortaa, Arial, sans-serif',
                            fontWeight: 300 // Lighter weight
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', // Transparent border for the input
                            fontFamily: 'Comfortaa, Arial, sans-serif',
                            fontWeight: 300 // Lighter weight
                        }
                    }}
                    InputLabelProps={{
                        style: { color: 'white', fontFamily: 'Comfortaa, Arial, sans-serif', fontWeight: 300 } // Apply Comfortaa font
                    }}
                    InputProps={{
                        style: { color: 'white', fontFamily: 'Comfortaa, Arial, sans-serif', fontWeight: 300 } // Apply Comfortaa font
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{ 
                        bgcolor: 'rgba(128, 128, 128, 0.5)', 
                        flex: 1,
                        height: '56px',
                        fontFamily: 'Comfortaa, Arial, sans-serif',
                        fontWeight: 300 // Lighter weight
                    }}
                >
                    Add New Item
                </Button>
            </Box>
            <Box 
                width="800px"
                border='2px solid transparent' // Transparent border
                sx={{ backgroundColor: 'rgba(128, 128, 128, 0.5)' }}
            >
                <Box
                    height="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant='h2' color='#333' sx={{ fontFamily: 'Comfortaa, Arial, sans-serif', fontWeight: 300 }}> {/* Apply Comfortaa font */}
                        Inventory Items
                    </Typography>
                </Box>
            </Box>
            <Stack width="800px" spacing={2} overflow="auto">
                {
                    filteredInventory.map(item => {
                        const { name, quantity } = item;
                        return (
                            <Box
                                key={name}
                                width="100%"
                                height="100px"
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between" // Align items to the start and end
                                bgcolor="rgba(255, 255, 255, 0.8)"
                                padding={2}
                                border="2px solid transparent" // Transparent border
                                sx={{ 
                                    fontFamily: 'Comfortaa, Arial, sans-serif',
                                    fontWeight: 300 // Lighter weight
                                }} 
                            >
                                <Typography variant='h3' color='#333' sx={{ fontWeight: 300, flex: 1, textAlign: 'left' }}>
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </Typography>
                                <Typography variant='h3' color='#333' sx={{ fontWeight: 300, flex: 1, textAlign: 'center' }}>
                                    {quantity}
                                </Typography>
                                <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => addItem(name)}
                                        sx={{ 
                                            bgcolor: 'rgba(128, 128, 128, 0.5)', 
                                            fontFamily: 'Comfortaa, Arial, sans-serif',
                                            fontWeight: 300 // Lighter weight
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => removeItem(name)}
                                        sx={{ 
                                            bgcolor: 'rgba(128, 128, 128, 0.5)', 
                                            fontFamily: 'Comfortaa, Arial, sans-serif',
                                            fontWeight: 300 // Lighter weight
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Stack>
                            </Box>
                        );
                    })
                }
            </Stack>
        </Box>
    );
}
