import { Skeleton, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

function AssetDetailsSkeleton() {
    return (
        <Box sx={{ p: 5 }}>
            <Grid container spacing={3}>
                {/* Image Upload Skeleton */}
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="rectangular" animation="wave" height={200} />
                </Grid>

                {/* Name and Group fields */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>

                {/* Status field */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>

                {/* Description field */}
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="rectangular" animation="wave" height={120} />
                </Grid>

                {/* Serial Number and Purchase Cost */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>

                {/* Depreciation Rate and Estimated Value */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>

                {/* Estimated Lifetime and Installation Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>

                {/* Locations */}
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" animation="wave" height={56} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" animation="wave" width={120} height={36} />
                </Grid>

                {/* Tags and Documents */}
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} sx={{ mb: 2 }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="rectangular" animation="wave" height={56} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default AssetDetailsSkeleton;
