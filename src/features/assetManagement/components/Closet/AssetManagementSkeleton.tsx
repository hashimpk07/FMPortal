import { Skeleton } from '@mui/material';

function CentreSkeleton() {
    return <Skeleton animation="wave" variant="rounded" width={'100%'} height={'6vh'} />;
}

function AssetGroupsSkeleton() {
    return (
        <div
            style={{
                display: 'flex',
                flexFlow: 'column',
                gap: '1rem',
                paddingTop: '1rem',
                paddingLeft: '1rem',
                paddingBottom: '1rem',
            }}
        >
            <Skeleton animation="wave" variant="rounded" width={'95%'} height={'4vh'} />
            <Skeleton animation="wave" variant="rounded" width={'95%'} height={'4vh'} />
            <Skeleton
                animation="wave"
                variant="rounded"
                height={'4vh'}
                width={'calc(95% - 1.5rem)'}
                style={{ marginLeft: '1.5rem' }}
            />
            <Skeleton
                animation="wave"
                variant="rounded"
                width={'calc(95% - 1.5rem)'}
                style={{ marginLeft: '1.5rem' }}
                height={'4vh'}
            />
            <Skeleton animation="wave" variant="rounded" width={'95%'} height={'4vh'} />
        </div>
    );
}

export { CentreSkeleton, AssetGroupsSkeleton };
