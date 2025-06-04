import { Box, Card, CardContent, CircularProgress, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import HTTP from '../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../constants';
import FileInputImage from './FileParts/FileInputImage.tsx';
import FileInputAttachment from './FileParts/FileInputAttachment.tsx';

interface IfileLoader {
    [key: string]: boolean;
}
const FileInputDisplay = ({
    data,
    translations,
    handleDelete,
    fileLoader,
    fieldName,
}: {
    data: any;
    translations: TFunction;
    handleDelete: () => void;
    fileLoader: IfileLoader;
    fieldName: string;
}) => {
    const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    };

    const [inputDisplay, setInputDisplay] = useState('loading');
    const [gatewayFileData, setGatewayFileData] = useState<any>(undefined);

    useEffect(() => {
        if (!data) {
            setInputDisplay('nothing');
            return;
        }
        if (data?.error) {
            setInputDisplay('error_from_lib');
            return;
        }
        if (data.fileObject) {
            setInputDisplay('file_object');
            return;
        }
        if (data.type === 'media' && data.id) {
            setInputDisplay('loading');
            HTTP({
                url: `${API_BASE_URL}/${API_VERSION}/media/${data.id}`,
                headers: {
                    'Auth-Token-Provider': 'gateway-api',
                },
            })
                .then((r) => {
                    if (r.status === 200) {
                        HTTP({
                            url: r.data.data.attributes.url,
                            method: 'GET',
                        }).then((head) => {
                            setGatewayFileData({
                                ...r.data.data.attributes,
                                fileType: head.headers['content-type'],
                            });

                            setInputDisplay('gateway_api');
                        });
                    } else {
                        setInputDisplay('error');
                    }
                })
                .catch(() => {
                    setInputDisplay('error');
                });
            return;
        }

        setInputDisplay('error');
    }, [data]);

    if (inputDisplay === 'loading' || fileLoader[fieldName]) {
        return (
            <Card
                variant="elevation"
                sx={{
                    display: 'flex',
                    width: '100%',
                    p: 4,
                }}
            >
                <CircularProgress />
            </Card>
        );
    }

    if (inputDisplay === 'nothing') return <></>;

    if (inputDisplay === 'error_from_lib') {
        return (
            <Card
                variant="elevation"
                sx={{
                    display: 'flex',
                    width: '100%',
                    border: 'red 2px solid',
                }}
            >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {translations(`upload_errors.${data?.error}`)}
                        {data?.error === 'ASPECT_RATIO_INCORRECT' ? (
                            <span>
                                : {data?.pluginAttributes?.image.aspectRatio.width} x{' '}
                                {data?.pluginAttributes?.image.aspectRatio.height}
                            </span>
                        ) : (
                            <span></span>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {data?.fileObject?.name}
                    </Typography>
                    <IconButton onClick={() => handleDelete()}>
                        <DeleteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                </CardContent>
            </Card>
        );
    }

    if (inputDisplay === 'file_object' && data?.fileObject) {
        if (data.fileObject?.mimeType?.startsWith('image/')) {
            return (
                <FileInputImage
                    imageUrl={URL.createObjectURL(
                        b64toBlob(data?.fileData, data.fileObject.mimeType),
                    )}
                    fileName={data?.fileObject?.name}
                    handleDelete={() => handleDelete()}
                />
            );
        }

        return (
            <FileInputAttachment
                fileName={data?.fileObject?.name}
                handleDelete={() => handleDelete()}
            />
        );
    }

    if (inputDisplay === 'gateway_api') {
        if (gatewayFileData?.fileType?.startsWith('image')) {
            return (
                <FileInputImage
                    imageUrl={gatewayFileData?.url}
                    fileName={gatewayFileData?.name}
                    handleDelete={() => handleDelete()}
                />
            );
        }

        return (
            <FileInputAttachment
                fileName={gatewayFileData?.name}
                fileUrl={gatewayFileData?.url}
                handleDelete={() => handleDelete()}
            />
        );
    }

    if (!data) {
        return null;
    }

    return <Box>{translations('upload_errors.UNKNOWN_EXCEPTION')}</Box>;
};

export default FileInputDisplay;
