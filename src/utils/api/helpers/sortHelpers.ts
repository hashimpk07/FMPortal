import { GridSortModel } from '@mui/x-data-grid';

const extractSortParams = (model: GridSortModel) => {
    const { field, sort } = model[0] || { field: '', sort: 'asc' };
    return { field, sort };
};

export default extractSortParams;
