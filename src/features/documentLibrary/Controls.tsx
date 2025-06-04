import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { DocumentsData as DocumentsDataType } from '../../types/pageTypes';
import { API_BASE_URL, API_VERSION } from '../../constants';
import HTTP from '../../utils/api/helpers/axios';
import fetchCentresList, { CentreData } from '../../services/centres';

interface Type {
    id: string;
    attributes: {
        name: string;
    };
}

interface DocumentTypeData {
    id: string;
    name: string;
}

interface TransformedType {
    id: string;
    name: string;
}

interface TransformedCentres {
    id: string;
    name: string;
}

interface PropertyData {
    id: string;
    name: string;
}

interface ControlsProps {
    search: string;
    setSearch: (value: string) => void;
    setRows: React.Dispatch<React.SetStateAction<DocumentsDataType[]>>;
    selectedProperty: string;
    setSelectedProperty: React.Dispatch<React.SetStateAction<string>>;
    selectedFileType: string;
    setSelectedFileType: React.Dispatch<React.SetStateAction<string>>;
    selectedExpiry: string;
    setSelectedExpiry: React.Dispatch<React.SetStateAction<string>>;
}

const Controls = ({
    search,
    setSearch,
    selectedProperty,
    setSelectedProperty,
    selectedFileType,
    setSelectedFileType,
    selectedExpiry,
    setSelectedExpiry,
}: ControlsProps) => {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentTypeData[]>([]);
    const [expiryList, setExpiryList] = useState<any>([]);

    const { t } = useTranslation();

    const expiryListValues = [
        { id: 1, name: t('common.last-7-days') },
        { id: 2, name: t('common.last-14-days') },
        { id: 3, name: t('common.last-30-days') },
        { id: 4, name: t('common.last-90-days') },
        { id: 5, name: t('common.last-180-days') },
    ];

    const handleResetFilters = () => {
        setSelectedProperty('');
        setSelectedFileType('');
        setSelectedExpiry('');
    };

    const getType = async () => {
        try {
            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/documents/types`);
            const typesData = response.data.data;

            if (Array.isArray(typesData)) {
                const transformedData: TransformedType[] = typesData.map((item: Type) => ({
                    id: String(item.id),
                    name: item.attributes.name,
                }));
                setDocumentTypes(transformedData);
            } else {
                console.error("Response data 'data' is not an array", typesData);
            }
        } catch (error) {
            console.error('Type not fetch ', error);
        }
    };

    const getProperties = async () => {
        try {
            const response = await fetchCentresList();
            const centresData = response.data;
            if (Array.isArray(centresData)) {
                const transformedData: TransformedCentres[] = centresData.map(
                    (item: CentreData) => ({
                        id: String(item.id),
                        name: item.attributes.name,
                    }),
                );
                setProperties(transformedData);
            } else {
                console.error("Response data 'data' is not an array", centresData);
            }
        } catch (error) {
            console.error('Properties not fetch ', error);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                getProperties();
                getType();
                setExpiryList(expiryListValues);
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1em',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        id="input-with-icon-textfield"
                        label={t('common.search')}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: '40%' }}
                        variant="outlined"
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1em',
                            alignItems: 'center',
                        }}
                    ></Box>
                </Box>

                <Box sx={{ display: 'flex', gap: '2em', marginTop: '15px' }}>
                    <TextField
                        select
                        label={t('common.property')}
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                        variant="outlined"
                        sx={{ width: '20%' }}
                    >
                        {properties.map((prop) => (
                            <MenuItem key={prop.id} value={prop.id}>
                                {prop.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label={t('common.type')}
                        value={selectedFileType || ''}
                        onChange={(e) => setSelectedFileType(e.target.value)}
                        variant="outlined"
                        sx={{ width: '20%' }}
                    >
                        {documentTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label={t('common.expires')}
                        value={selectedExpiry}
                        onChange={(e) => setSelectedExpiry(e.target.value)}
                        variant="outlined"
                        sx={{ width: '20%' }}
                    >
                        {expiryList.map((list: any) => (
                            <MenuItem key={list.id} value={list.id}>
                                {list.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetFilters}
                        sx={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginLeft: 'auto',
                            display: 'block',
                            width: '20%',
                        }}
                    >
                        {t('buttons.clear-filter')}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Controls;
