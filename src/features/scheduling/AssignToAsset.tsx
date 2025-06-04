import { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Breadcrumbs,
    Link,
    Checkbox,
    IconButton,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Stack,
} from '@mui/material';
import {
    ArrowRight,
    Close,
    Inventory,
    Search,
    SourceOutlined,
    SubjectOutlined,
} from '@mui/icons-material';
import { t } from 'i18next';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface AssetItem {
    id: number;
    name: string;
    hasCheckbox?: boolean;
    children?: AssetItem[];
    icon?: any;
}

const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    width: '90%',
    height: '90%',
    overflow: 'scroll',
    overflowX: 'auto',
};

const headerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    display: 'flex',
    alignItems: 'center',
};

// Hierarchical data representing the structure in the image
const assets: AssetItem[] = [
    {
        id: 11,
        name: 'Building Systems',
        icon: <Inventory />,
        children: [
            { id: 1, name: 'Electrical Systems', icon: <SourceOutlined /> },
            { id: 8, name: 'HVAC Systems', icon: <SourceOutlined /> },
            { id: 9, name: 'Natural Gas Systems', icon: <SourceOutlined /> },
            {
                id: 2,
                name: 'Plumbing',
                icon: <SourceOutlined />,
                children: [
                    { id: 31, name: 'Pipelines', icon: <SubjectOutlined /> },
                    {
                        id: 3,
                        name: 'Water Pumps',
                        icon: <SubjectOutlined />,
                        children: [
                            {
                                id: 4,
                                name: 'Portable Pumps',
                                icon: <SubjectOutlined />,
                                children: [
                                    {
                                        id: 5,
                                        name: 'Portable Pump L',
                                        hasCheckbox: true,
                                    },
                                    {
                                        id: 6,
                                        name: 'Portable Pump XL 01',
                                        hasCheckbox: true,
                                    },
                                    {
                                        id: 7,
                                        name: 'Portable Pump XL 02',
                                        hasCheckbox: true,
                                    },
                                ],
                            },
                            {
                                id: 55,
                                name: 'Hot Water Pump',
                                hasCheckbox: true,
                            },
                            {
                                id: 56,
                                name: 'Cold Water Pump',
                                hasCheckbox: true,
                            },
                            {
                                id: 57,
                                name: 'Grey Water Pump',
                                hasCheckbox: true,
                            },
                            {
                                id: 58,
                                name: 'Rainfall Recovery Tank Water Pump',
                                hasCheckbox: true,
                            },
                        ],
                    },
                    {
                        id: 32,
                        name: 'Water Treatment',
                        icon: <SubjectOutlined />,
                    },
                    { id: 51, name: 'Water Feature #1', hasCheckbox: true },
                    { id: 52, name: 'Water Feature #2', hasCheckbox: true },
                    {
                        id: 53,
                        name: 'Water Feature Cascade',
                        hasCheckbox: true,
                    },
                    { id: 54, name: 'Fountain 01', hasCheckbox: true },
                ],
            },
        ],
    },
    {
        id: 12,
        name: 'Fire Safety Equipment',
        icon: <Inventory />,
    },
    {
        id: 13,
        name: 'Security Systems',
        icon: <Inventory />,
    },
];

const AssignToAsset = ({ selectedAssets, setSelectedAssets, onClose }: any) => {
    const [selectedPaths, setSelectedPaths] = useState<AssetItem[]>([]);
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    const [searchAsset, setSearchAsset] = useState('');

    const handleItemClick = (item: AssetItem, level: number) => {
        setActiveItemId(item.id); // Set the active item ID
        if (!item.hasCheckbox) {
            const newPath = [...selectedPaths.slice(0, level), item];
            setSelectedPaths(newPath);
        }
    };

    const handleCheckboxToggle = (itemName: string) => {
        setSelectedAssets((prev: string[]) =>
            prev.includes(itemName)
                ? prev.filter((item: string) => item !== itemName)
                : [...prev, itemName],
        );
    };

    const currentChildren =
        selectedPaths.length > 0 ? selectedPaths[selectedPaths.length - 1].children : assets;

    return (
        <Box width="100%" height="100vh" display="flex" flexDirection="column" p={2} sx={boxStyle}>
            <Box sx={headerStyle}>
                <Typography variant="h6" sx={{ textAlign: 'left', flexGrow: 1 }}>
                    {t('scheduling.assign-asset')}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'black' }} title="Close">
                    <Close />
                </IconButton>
            </Box>
            {/* Breadcrumbs */}
            <Box my={2} display="flex" justifyContent="space-between" alignItems="center">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                    <Link
                        component="button"
                        onClick={() => setSelectedPaths(selectedPaths.slice(0, 1))}
                        underline="hover"
                        color="textSecondary"
                    >
                        {t('scheduling.all-assets')}
                    </Link>
                    {selectedPaths.map((item, index) => (
                        <Link
                            key={item.id}
                            component="button"
                            onClick={() => setSelectedPaths(selectedPaths.slice(0, index + 1))}
                            underline="hover"
                            color="textSecondary"
                        >
                            {item.name}
                        </Link>
                    ))}
                </Breadcrumbs>
                <TextField
                    variant="outlined"
                    placeholder="Search"
                    size="small"
                    value={searchAsset}
                    onChange={(e) => setSearchAsset(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            {/* Parent Box containing child boxes */}
            <Box
                display="flex"
                flexDirection="row"
                overflow="auto"
                border="1px solid lightgray"
                height="60vh"
            >
                {selectedPaths.map((_, index) => (
                    <Box
                        key={index}
                        minWidth="300px"
                        maxWidth="300px"
                        border="1px solid lightgray"
                        overflow="auto"
                    >
                        <List>
                            {(index === 0 ? assets : selectedPaths[index - 1].children)?.map(
                                (item) => (
                                    <ListItem
                                        key={item.id}
                                        disablePadding
                                        secondaryAction={
                                            item.hasCheckbox ? (
                                                <Checkbox
                                                    edge="end"
                                                    checked={selectedAssets.includes(item.name)}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent opening new box
                                                        handleCheckboxToggle(item.name); // Handle checkbox toggle
                                                    }}
                                                />
                                            ) : null
                                        }
                                        style={{
                                            background:
                                                activeItemId === item.id
                                                    ? '#F6FBFF'
                                                    : 'transparent', // Highlight selected/active items
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={() => handleItemClick(item, index)}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                                width="100%"
                                                justifyContent="space-between"
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    {item.icon}
                                                    <ListItemText primary={item.name} />
                                                </div>
                                                {!item.hasCheckbox && (
                                                    <IconButton edge="end">
                                                        <ArrowRight />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                        </ListItemButton>
                                    </ListItem>
                                ),
                            )}
                        </List>
                    </Box>
                ))}

                {/* Current children list */}
                <Box minWidth="300px" maxWidth="300px" overflow="auto" border="1px solid lightgray">
                    <List>
                        {currentChildren?.map((child) => (
                            <ListItem
                                key={child.id}
                                disablePadding
                                secondaryAction={
                                    child.hasCheckbox ? (
                                        <Checkbox
                                            edge="end"
                                            checked={selectedAssets.includes(child.name)}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent opening new box
                                                handleCheckboxToggle(child.name); // Handle checkbox toggle
                                            }}
                                        />
                                    ) : null
                                }
                                style={{
                                    background:
                                        activeItemId === child.id ? '#F6FBFF' : 'transparent', // Highlight selected/active items
                                }}
                            >
                                <ListItemButton
                                    onClick={() => handleItemClick(child, selectedPaths.length)}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        width="100%"
                                        justifyContent="space-between"
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            {child.icon}
                                            <ListItemText primary={child.name} />
                                        </div>
                                        {!child.hasCheckbox && (
                                            <IconButton edge="end">
                                                <ArrowRight />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Box>
                    <Button variant="outlined" sx={{ marginRight: 2 }} onClick={onClose}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        disabled={selectedAssets.length === 0}
                    >
                        {t('buttons.assign')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AssignToAsset;
