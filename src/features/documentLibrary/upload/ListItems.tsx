import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { UploadFileItem, UploadFileList } from './types/index';

interface FileValidationFlags {
    type: boolean;
    size: boolean;
}
interface ToggleableIconmProps {
    fileStatus?: string;
    isFileValid?: FileValidationFlags;
}
interface listItemsProps {
    files: UploadFileList;
    handleFileClick: (name: string | undefined) => void;
    handleDelete: (name: string | undefined) => void;
    editingIndex: number;
}

const ToggleableIcon: React.FC<ToggleableIconmProps> = ({ fileStatus, isFileValid }) => {
    if (isFileValid && Object.values(isFileValid).some((value) => value === false))
        return <WarningIcon sx={{ color: 'red' }} />;
    if (fileStatus === 'READY') return <CheckCircleOutlineIcon color="primary" />;
    if (fileStatus === 'INCOMPLETE') return <ErrorOutlinedIcon style={{ color: '#FED86F' }} />;
};

export default function ItemsList({
    files,
    handleFileClick,
    handleDelete,
    editingIndex,
}: listItemsProps) {
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                overflow: 'auto',
                maxHeight: 300,
            }}
        >
            {files.length
                ? files.map(({ name, size, status, isValid }: UploadFileItem, index: number) => {
                      return (
                          <Tooltip title={name} arrow key={index}>
                              <ListItem
                                  key={index}
                                  alignItems="flex-start"
                                  sx={{
                                      border: 1,
                                      borderColor: 'divider',
                                      mb: 1,
                                      bgcolor: editingIndex === index ? '#D3D3D3' : 'white',
                                  }}
                              >
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <ToggleableIcon fileStatus={status} isFileValid={isValid} />
                                      <ListItemButton onClick={() => handleFileClick(name)}>
                                          <ListItemText
                                              primary={
                                                  <Typography variant="h4" noWrap>
                                                      {name}
                                                  </Typography>
                                              }
                                              sx={{ width: '200px' }}
                                              secondary={
                                                  <React.Fragment>
                                                      <Typography component={'span'} variant="h5">
                                                          {size}
                                                      </Typography>
                                                      <br />
                                                      {!isValid?.size && (
                                                          <Typography variant="error">
                                                              File size over 2 MB
                                                          </Typography>
                                                      )}
                                                  </React.Fragment>
                                              }
                                          />
                                      </ListItemButton>
                                      <ListItemButton
                                          onClick={() => {
                                              handleDelete(name);
                                          }}
                                      >
                                          <DeleteIcon color="primary" fontSize="small" />
                                      </ListItemButton>
                                  </Box>
                              </ListItem>
                          </Tooltip>
                      );
                  })
                : ''}
        </List>
    );
}
