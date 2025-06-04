import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    IconButton,
    MenuItem,
    Modal,
    Popover,
    Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import CreateEditGroup from '../../CreateEditGroup';
import snackbar from '../../../../utils/ts/helper/snackbar';
import { PropertyData } from '../../../../types/pageTypes';
import { deleteAssetGroup } from '../../../../services/assetManagement';
import { useAssetManagementStore } from '../../store/assetManagementStore';

interface AssetManagementProps {
    id: string;
    label: string;
    nestedItems?: any[];
    parentId?: string;
    onItemClick?: (label: string) => void;
    activeItem?: string;
    expandedSections?: string[];
    handleSectionToggle?: (section: string) => void;
    image?: string;
    test?: boolean;
    selectedCentre: number | null;
    flatAssetGroups: PropertyData[];
    getAssetGroupsForCentre: () => void;
}

const AssetManagementList: React.FC<AssetManagementProps> = ({
    id,
    parentId,
    label,
    nestedItems = [],
    onItemClick,
    activeItem,
    expandedSections,
    handleSectionToggle,
    image,
    selectedCentre = null,
    flatAssetGroups = [],
    getAssetGroupsForCentre,
}) => {
    // Get the selectedAssetGroupId from the store
    const selectedAssetGroupId = useAssetManagementStore((state) => state.selectedAssetGroupId);
    const setSelectedAssetGroupId = useAssetManagementStore(
        (state) => state.setSelectedAssetGroupId,
    );

    // Use the store value as fallback if activeItem is not provided
    const effectiveActiveItem = activeItem || selectedAssetGroupId || 'all-assets';

    const [expanded, setExpanded] = useState<boolean>(expandedSections?.includes(id) ?? false);
    const { t } = useTranslation();
    const [editDeleteOpen, setEditDeleteOpen] = useState<boolean>(false);
    const [editDeleteAnchorEl, setEditDeleteAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [hovered, setHovered] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteLoadingModal, setShowDeleteLoadingModal] = useState(false);

    const [showCreateGroupModal, setCreateGroupModal] = useState<string | null>(null);
    const [showPreventDeleteModal, setPreventDeleteModal] = useState(false);

    const handleToggle = () => {
        setExpanded((prev: boolean) => !prev);
        if (handleSectionToggle) {
            handleSectionToggle(label);
        }
    };

    const handleItemClick = () => {
        // Update the store when an item is clicked
        setSelectedAssetGroupId(id);
        onItemClick?.(id);
    };

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleAddIcon = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const handleEditDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setEditDeleteAnchorEl(event.currentTarget);
        setEditDeleteOpen(true);
    };

    const handleCloseEditDeletePopup = () => {
        setEditDeleteOpen(false);
    };

    const handleEdit = () => {
        handleCloseEditDeletePopup();
        setCreateGroupModal('edit');
    };

    const handleDeleteModal = () => {
        if (nestedItems?.length > 0) {
            setPreventDeleteModal(true);
        } else {
            setShowDeleteModal(true);
        }
        setEditDeleteOpen(false);
        handleCloseEditDeletePopup();
    };

    const handleDelete = async () => {
        setShowDeleteModal(false);
        setShowDeleteLoadingModal(true);
        await deleteAssetGroup(id);
        setShowDeleteLoadingModal(false);
        getAssetGroupsForCentre();

        snackbar(
            t('snackbar.deleted-successfully'),
            'default',
            { horizontal: 'center', vertical: 'bottom' },
            3000,
        );
    };

    const handleClosePopup = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                marginLeft: id === 'all-assets' ? '0' : '1rem',
                position: 'relative',
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    position: 'relative',
                }}
            >
                <MenuItem
                    key={effectiveActiveItem}
                    onClick={() => {
                        setExpanded(true);
                        handleItemClick();
                    }}
                    sx={{
                        width: '100%',
                        minHeight: '2.25rem',
                        padding: '0.75rem 0.75rem',
                        borderRadius: '0.25rem',
                        backgroundColor: effectiveActiveItem === id ? '#F5F5F5' : 'transparent',
                        '&:hover': {
                            backgroundColor: effectiveActiveItem === id ? '#F5F5F5' : '#FAFAFA',
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                            gap: '0.5rem',
                        }}
                    >
                        {nestedItems?.length > 0 ? (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle();
                                }}
                                sx={{
                                    padding: '0.125rem',
                                    marginRight: '0.125rem',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <ChevronRightIcon
                                    sx={{
                                        fontSize: '1.125rem',
                                        color: '#666666',
                                        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease',
                                    }}
                                />
                            </IconButton>
                        ) : (
                            <Box sx={{ width: '1.375rem' }} />
                        )}

                        {image && (
                            <img
                                src={image}
                                alt={label}
                                style={{
                                    width: '1.125rem',
                                    height: '1.125rem',
                                }}
                            />
                        )}

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#333333',
                                fontWeight: effectiveActiveItem === id ? 500 : 400,
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            visibility: hovered ? 'visible' : 'hidden',
                        }}
                    >
                        {id !== 'all-assets' && (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditDelete(e);
                                }}
                                sx={{
                                    padding: '0.25rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                <MoreHorizOutlinedIcon fontSize="small" sx={{ color: '#757575' }} />
                            </IconButton>
                        )}
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddIcon(e);
                            }}
                            sx={{
                                padding: '0.25rem',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            <AddOutlinedIcon fontSize="small" sx={{ color: '#757575' }} />
                        </IconButton>
                    </Box>
                </MenuItem>
            </Box>

            {nestedItems && (
                <Collapse in={expanded}>
                    <Box>
                        {nestedItems.map((item, index) => (
                            <AssetManagementList
                                key={index}
                                selectedCentre={selectedCentre}
                                id={item.id}
                                label={item?.attributes?.name}
                                nestedItems={item?.children || []}
                                parentId={id}
                                onItemClick={onItemClick}
                                activeItem={effectiveActiveItem}
                                expandedSections={expandedSections}
                                handleSectionToggle={handleSectionToggle}
                                image={item.image}
                                flatAssetGroups={flatAssetGroups}
                                getAssetGroupsForCentre={getAssetGroupsForCentre}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopup}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: '8rem',
                        boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.15)',
                        marginTop: '0.25rem',
                    },
                }}
            >
                <Box>
                    <MenuItem
                        onClick={() => {
                            setCreateGroupModal('create');
                            handleClosePopup();
                        }}
                        sx={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.875rem',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#F5F5F5',
                            },
                        }}
                    >
                        {t('asset.CreateGroup')}
                    </MenuItem>
                </Box>
            </Popover>
            <Popover
                open={Boolean(editDeleteOpen && editDeleteAnchorEl)}
                anchorEl={editDeleteAnchorEl ?? undefined}
                onClose={handleCloseEditDeletePopup}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: '8rem',
                        boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.15)',
                        marginTop: '0.25rem',
                    },
                }}
            >
                <Box>
                    <MenuItem
                        onClick={handleEdit}
                        sx={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.875rem',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#F5F5F5',
                            },
                        }}
                    >
                        {t('buttons.edit')}
                    </MenuItem>
                    <MenuItem
                        onClick={handleDeleteModal}
                        sx={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.875rem',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#F5F5F5',
                            },
                        }}
                    >
                        {t('buttons.delete')}
                    </MenuItem>
                </Box>
            </Popover>

            <Modal open={showCreateGroupModal !== null}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '0.125rem',
                        outline: 'none',
                    }}
                >
                    <CreateEditGroup
                        id={id}
                        parentId={showCreateGroupModal === 'edit' ? parentId : id}
                        mode={showCreateGroupModal}
                        groups={flatAssetGroups}
                        setCreateGroupModal={setCreateGroupModal}
                        centreId={selectedCentre || 0}
                        onClose={(reloadGroups = false) => {
                            setCreateGroupModal(null);
                            if (reloadGroups) {
                                getAssetGroupsForCentre();
                            }
                        }}
                    />
                </Box>
            </Modal>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Box
                    sx={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '0.125rem',
                        width: '18.75rem',
                        textAlign: 'center',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={() => setShowDeleteModal(false)}
                        sx={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            color: 'black',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" gutterBottom>
                            {t('asset.delete-asset-group')}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {t('asset.delete-asset-group-desc')}
                        </Typography>
                    </Box>
                    <Box
                        mt={2}
                        sx={{
                            gap: 2,
                            justifyContent: 'right',
                        }}
                        display="flex"
                    >
                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            onClick={() => setShowDeleteModal(false)}
                            sx={{
                                width: '30%',
                                height: '100%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                width: '30%',
                                height: '100%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                handleDelete();
                            }}
                        >
                            {t('buttons.confirm')}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={showDeleteLoadingModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '25rem',
                        bgcolor: 'background.paper',
                        borderRadius: '0.125rem',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <IconButton
                        onClick={() => setShowDeleteLoadingModal(false)}
                        sx={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                        }}
                    >
                        <Close />
                    </IconButton>

                    <CircularProgress size={40} sx={{ mb: 3 }} />

                    <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
                        {t('asset.deleting-asset-group')}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {t('asset.deleting-asset-group-desc')}
                    </Typography>
                </Box>
            </Modal>

            <Modal open={showPreventDeleteModal} onClose={() => setPreventDeleteModal(false)}>
                <Box
                    sx={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '0.125rem',
                        width: '21.875rem',
                        textAlign: 'center',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={() => setPreventDeleteModal(false)}
                        sx={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            color: 'black',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" gutterBottom>
                            Unable to delete Group
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Please make sure all Collections, Sub-collections and assets are removed
                            or reassigned to other groups or Sub-groups before deleting.
                        </Typography>
                    </Box>
                    <Box
                        mt={2}
                        sx={{
                            gap: '0.125rem',
                            justifyContent: 'right',
                        }}
                        display="flex"
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            size="medium"
                            onClick={() => setPreventDeleteModal(false)}
                            sx={{
                                width: '30%',
                                height: '100%',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AssetManagementList;
