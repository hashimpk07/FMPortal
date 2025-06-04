import { useState } from 'react';
import { Box, MenuItem, Button, FormControl, InputLabel, Select, Drawer } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Add from '@mui/icons-material/Add';
import EditTask from './EditTask';

const Controls = () => {
    const { t } = useTranslation();

    const [properties] = useState([
        { id: 1, name: 'Westwood Cross' },
        { id: 2, name: 'Eastwood Star & Cresent' },
        { id: 3, name: 'Hundred Acre Wood' },
        { id: 4, name: 'Northwood Ankh' },
    ]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [types] = useState([
        { id: 1, name: 'Case' },
        { id: 2, name: 'Work Order' },
        { id: 3, name: 'Inspection' },
        { id: 4, name: 'Property Compliance' },
    ]);
    const [selectedType, setSelectedType] = useState('');
    const [plans] = useState([
        { id: 1, name: 'Car Park' },
        { id: 2, name: 'Bathrooms' },
        { id: 3, name: 'Inspection' },
        { id: 4, name: 'Perimeter checks' },
    ]);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [assets] = useState([
        { id: 1, name: 'ATM level 0' },
        { id: 2, name: 'ATM level 1' },
        { id: 3, name: 'APS car park 1' },
        { id: 4, name: 'APS car park 2' },
        { id: 5, name: 'Barrier car park 1' },
    ]);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [statuses] = useState([
        { id: 1, name: 'Active' },
        { id: 2, name: 'Inactive' },
        { id: 3, name: 'Finished' },
    ]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showCreateTaskModal, setCreateTaskModal] = useState(false);

    const handleResetFilters = () => {
        setSelectedProperty('');
        setSelectedPlan('');
        setSelectedType('');
        setSelectedAsset('');
        setSelectedStatus('');
    };
    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '2em',
                        marginTop: '5px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        variant="contained"
                        size="medium"
                        startIcon={<Add />}
                        onClick={() => setCreateTaskModal(true)}
                    >
                        {t('buttons.create-task')}
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1em',
                        marginTop: '15px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <FormControl sx={{ flexBasis: 'calc(15% - 1em)' }}>
                        <InputLabel id="property-label">{t('common.property')}</InputLabel>
                        <Select
                            labelId="property-label"
                            value={selectedProperty}
                            label={t('common.property')}
                            onChange={(e) => {
                                setSelectedProperty(e.target.value);
                            }}
                        >
                            {properties.map((property) => (
                                <MenuItem key={property.id} value={property.id}>
                                    {property.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ flexBasis: 'calc(15% - 1em)' }}>
                        <InputLabel id="type-label">{t('common.type')}</InputLabel>
                        <Select
                            labelId="type-label"
                            value={selectedType}
                            label={t('common.type')}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                            }}
                        >
                            {types.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ flexBasis: 'calc(15% - 1em)' }}>
                        <InputLabel id="plan-label">{t('common.plan')}</InputLabel>
                        <Select
                            labelId="plan-label"
                            value={selectedPlan}
                            label={t('common.plan')}
                            onChange={(e) => {
                                setSelectedPlan(e.target.value);
                            }}
                        >
                            {plans.map((plan) => (
                                <MenuItem key={plan.id} value={plan.id}>
                                    {plan.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ flexBasis: 'calc(15% - 1em)' }}>
                        <InputLabel id="asset-label">{t('common.asset')}</InputLabel>
                        <Select
                            labelId="asset-label"
                            value={selectedAsset}
                            label={t('common.asset')}
                            onChange={(e) => {
                                setSelectedAsset(e.target.value);
                            }}
                        >
                            {assets.map((asset) => (
                                <MenuItem key={asset.id} value={asset.id}>
                                    {asset.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ flexBasis: 'calc(15% - 1em)' }}>
                        <InputLabel id="status-label">{t('common.status')}</InputLabel>
                        <Select
                            labelId="status-label"
                            value={selectedStatus}
                            label={t('common.status')}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                            }}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetFilters}
                        sx={{
                            fontSize: '10px',
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexBasis: 'calc(12.5% - 1em)', // Adjust the button width
                            height: 'auto',
                            minHeight: '3.6em',
                        }}
                    >
                        {t('buttons.clear-filter')}
                    </Button>

                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetFilters}
                        sx={{
                            fontSize: '10px',
                            fontWeight: 600,
                            fontFamily: 'Inter',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexBasis: 'calc(12.5% - 1em)', // Adjust the button width
                            height: 'auto',
                            minHeight: '3.6em',
                        }}
                    >
                        {t('common.filter_header.clear_sorting')}
                    </Button>
                </Box>
            </Box>

            <Drawer
                anchor="right"
                open={showCreateTaskModal}
                onClose={() => setCreateTaskModal(false)}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                <EditTask onClose={() => setCreateTaskModal(false)} />
            </Drawer>
        </>
    );
};

export default Controls;
