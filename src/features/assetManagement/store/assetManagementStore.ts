/* eslint-disable no-param-reassign */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import {
    GridFilterModel,
    GridSortModel,
    GridSortItem,
    GridPaginationModel,
    GridLogicOperator,
} from '@mui/x-data-grid-pro';
import type {
    Asset,
    AssetOperationalSummaryResponse,
    AssetDetailResponse,
    AssetsListResponse,
    Location,
    Contractor,
    AssetTag,
    AssetCentre,
    AssetGroup,
    SortField,
    AssetGroupDetailResponse,
    Document,
    Tag,
} from '../services/types';
import { fetchTagsList, fetchDocumentsList } from '../services/assets/assetService';
import { CentreConfig } from '../../../services/centres';

// Action types as constants for Redux DevTools
const ACTION_TYPES = {
    SET_SEARCH: 'ASSET/SET_SEARCH',
    SET_SELECTED_STATUS: 'ASSET/SET_SELECTED_STATUS',
    SET_PAGINATION_MODEL: 'ASSET/SET_PAGINATION_MODEL',
    SET_SORT_MODEL: 'ASSET/SET_SORT_MODEL',
    SET_FILTER_MODEL: 'ASSET/SET_FILTER_MODEL',
    SET_SELECTED_ROW_ID: 'ASSET/SET_SELECTED_ROW_ID',
    SET_SHOWCREATEASSETMODAL: 'ASSET/SET_SHOWCREATEASSETMODAL',
    SET_LAST_CLICKED_ROW_DATA: 'ASSET/SET_LAST_CLICKED_ROW_DATA',
    RESET_FILTERS: 'ASSET/RESET_FILTERS',
    RESET_TABLE_OPTIONS: 'ASSET/RESET_TABLE_OPTIONS',
    RESET_STORE: 'ASSET/RESET_STORE',
    SET_ASSETS: 'ASSET/SET_ASSETS',
    SET_ENRICHED_ASSETS: 'ASSET/SET_ENRICHED_ASSETS',
    SET_ASSETS_LOADING: 'ASSET/SET_ASSETS_LOADING',
    SET_ASSETS_ERROR: 'ASSET/SET_ASSETS_ERROR',
    SET_ASSETS_RESPONSE: 'ASSET/SET_ASSETS_RESPONSE',
    SET_INCLUDED: 'ASSET/SET_INCLUDED',
    SET_META: 'ASSET/SET_META',
    SET_SELECTED_ASSET_DETAILS: 'ASSET/SET_SELECTED_ASSET_DETAILS',
    SET_SELECTED_ASSET_LOADING: 'ASSET/SET_SELECTED_ASSET_LOADING',
    SET_SELECTED_ASSET_ERROR: 'ASSET/SET_SELECTED_ASSET_ERROR',
    SET_ASSET_OPERATIONAL_SUMMARY: 'ASSET/SET_ASSET_OPERATIONAL_SUMMARY',
    SET_OPERATIONAL_SUMMARY_LOADING: 'ASSET/SET_OPERATIONAL_SUMMARY_LOADING',
    SET_OPERATIONAL_SUMMARY_ERROR: 'ASSET/SET_OPERATIONAL_SUMMARY_ERROR',
    RESET_SELECTED_ASSET: 'ASSET/RESET_SELECTED_ASSET',
    SET_ASSET_GROUP_DETAILS: 'ASSET/SET_ASSET_GROUP_DETAILS',
    SET_ASSET_GROUP_LOADING: 'ASSET/SET_ASSET_GROUP_LOADING',
    SET_ASSET_GROUP_ERROR: 'ASSET/SET_ASSET_GROUP_ERROR',
    SET_SELECTED_CENTRE_ID: 'ASSET/SET_SELECTED_CENTRE_ID',
    SET_SELECTED_CENTRE_CONFIG: 'ASSET/SET_SELECTED_CENTRE_CONFIG',
    SET_SELECTED_ASSET_GROUP_ID: 'ASSET/SET_SELECTED_ASSET_GROUP_ID',
    SET_SELECTED_CONTRACTOR_ID: 'ASSET/SET_SELECTED_CONTRACTOR_ID',
    SET_TAGS: 'ASSET/SET_TAGS',
    SET_TAGS_LOADING: 'ASSET/SET_TAGS_LOADING',
    SET_TAGS_ERROR: 'ASSET/SET_TAGS_ERROR',
    SET_DOCUMENTS: 'ASSET/SET_DOCUMENTS',
    SET_DOCUMENTS_LOADING: 'ASSET/SET_DOCUMENTS_LOADING',
    SET_DOCUMENTS_ERROR: 'ASSET/SET_DOCUMENTS_ERROR',
    SET_ASSET_GROUPS: 'ASSET/SET_ASSET_GROUPS',
    SET_ASSET_GROUPS_LOADING: 'ASSET/SET_ASSET_GROUPS_LOADING',
    SET_ASSET_GROUPS_ERROR: 'ASSET/SET_ASSET_GROUPS_ERROR',
    SET_LOCATIONS: 'ASSET/SET_LOCATIONS',
    SET_LOCATIONS_LOADING: 'ASSET/SET_LOCATIONS_LOADING',
    SET_LOCATIONS_ERROR: 'ASSET/SET_LOCATIONS_ERROR',
    SET_CONTRACTORS: 'ASSET/SET_CONTRACTORS',
    SET_CONTRACTORS_LOADING: 'ASSET/SET_CONTRACTORS_LOADING',
    SET_CONTRACTORS_ERROR: 'ASSET/SET_CONTRACTORS_ERROR',
    RESET_CONTRACTORS: 'ASSET/RESET_CONTRACTORS',
};

// Asset Management Table State Interface
interface AssetManagementState {
    // Filters
    search: string;
    selectedStatus: string;
    selectedContractorId: string;
    // Table
    paginationModel: GridPaginationModel;
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
    selectedRowId: string | number | null;
    // UI
    showCreateAssetModal: boolean;
    // Extensible options
    lastClickedRowData: any | null;
    // Assets data
    assets: Asset[];
    enrichedAssets: Asset[];
    assetsLoading: boolean;
    assetsError: string | null;
    assetsResponse: AssetsListResponse | null;
    included: Array<AssetTag | AssetCentre | AssetGroup>;
    meta: AssetsListResponse['meta'] | null;
    // Selected asset details
    selectedAssetDetails: AssetDetailResponse | null;
    selectedAssetLoading: boolean;
    selectedAssetError: string | null;
    // Asset operational summary
    assetOperationalSummary: AssetOperationalSummaryResponse | null;
    operationalSummaryLoading: boolean;
    operationalSummaryError: string | null;
    // Asset group details
    assetGroupDetails: AssetGroupDetailResponse | null;
    assetGroupLoading: boolean;
    assetGroupError: string | null;
    // Selected centre and asset group
    selectedCentreId: string | number | null;
    selectedCentreConfig: CentreConfig | null;
    selectedAssetGroupId: string | null;
    // Tags
    tags: Tag[];
    tagsLoading: boolean;
    tagsError: string | null;
    // Documents
    documents: Document[];
    documentsLoading: boolean;
    documentsError: string | null;
    // Asset groups list
    assetGroups: AssetGroup[];
    assetGroupsLoading: boolean;
    assetGroupsError: string | null;
    // Locations
    locations: Location[];
    locationsLoading: boolean;
    locationsError: string | null;
    // Contractors
    contractors: Contractor[];
    contractorsLoading: boolean;
    contractorsError: string | null;
    // Actions
    setSearch: (value: string) => void;
    setSelectedStatus: (value: string) => void;
    setSelectedContractorId: (value: string) => void;
    setPaginationModel: (model: GridPaginationModel) => void;
    setSortModel: (model: GridSortModel) => void;
    setFilterModel: (model: GridFilterModel) => void;
    setSelectedRowId: (id: string | number | null) => void;
    setShowCreateAssetModal: (open: boolean) => void;
    setLastClickedRowData: (row: any) => void;
    resetFilters: () => void;
    resetTableOptions: () => void;
    resetStore: () => void;
    // Assets actions
    setAssets: (data: Asset[]) => void;
    setEnrichedAssets: (data: Asset[]) => void;
    setAssetsLoading: (loading: boolean) => void;
    setAssetsError: (error: string | null) => void;
    setAssetsResponse: (response: AssetsListResponse | null) => void;
    setIncluded: (included: Array<AssetTag | AssetCentre | AssetGroup>) => void;
    setMeta: (meta: AssetsListResponse['meta'] | null) => void;
    // Selected asset actions
    setSelectedAssetDetails: (details: AssetDetailResponse | null) => void;
    setSelectedAssetLoading: (loading: boolean) => void;
    setSelectedAssetError: (error: string | null) => void;
    setAssetOperationalSummary: (summary: AssetOperationalSummaryResponse | null) => void;
    setOperationalSummaryLoading: (loading: boolean) => void;
    setOperationalSummaryError: (error: string | null) => void;
    resetSelectedAsset: () => void;
    // Asset group actions
    setAssetGroupDetails: (details: AssetGroupDetailResponse | null) => void;
    setAssetGroupLoading: (loading: boolean) => void;
    setAssetGroupError: (error: string | null) => void;
    // Centre and asset group actions
    setSelectedCentreId: (id: string | number | null) => void;
    setSelectedCentreConfig: (config: CentreConfig | null) => void;
    setSelectedAssetGroupId: (id: string | null) => void;
    // Conversion utilities
    getSortFields: () => SortField[];
    // Tags actions
    setTags: (tags: Tag[]) => void;
    setTagsLoading: (loading: boolean) => void;
    setTagsError: (error: string | null) => void;
    // Documents actions
    setDocuments: (documents: Document[]) => void;
    setDocumentsLoading: (loading: boolean) => void;
    setDocumentsError: (error: string | null) => void;
    // Asset groups list actions
    setAssetGroups: (assetGroups: AssetGroup[]) => void;
    setAssetGroupsLoading: (loading: boolean) => void;
    setAssetGroupsError: (error: string | null) => void;
    // Locations actions
    setLocations: (locations: Location[]) => void;
    setLocationsLoading: (loading: boolean) => void;
    setLocationsError: (error: string | null) => void;
    // Contractor actions
    setContractors: (contractors: Contractor[]) => void;
    setContractorsLoading: (loading: boolean) => void;
    setContractorsError: (error: string | null) => void;
    resetContractors: () => void;
}

interface AssetManagementActions {
    // Contractor actions
    setContractors: (contractors: Contractor[]) => void;
    setContractorsLoading: (loading: boolean) => void;
    setContractorsError: (error: string | null) => void;
    resetContractors: () => void;
}

const ENABLE_DEVTOOLS = process.env.NODE_ENV === 'development';

const initialState = {
    search: '',
    selectedStatus: '',
    selectedContractorId: '',
    paginationModel: { page: 0, pageSize: 10 },
    sortModel: [],
    filterModel: { items: [], logicOperator: 'and' as GridLogicOperator },
    selectedRowId: null,
    showCreateAssetModal: false,
    lastClickedRowData: null,
    assets: [],
    enrichedAssets: [],
    assetsLoading: false,
    assetsError: null,
    assetsResponse: null,
    included: [],
    meta: null,
    selectedAssetDetails: null,
    selectedAssetLoading: false,
    selectedAssetError: null,
    assetOperationalSummary: null,
    operationalSummaryLoading: false,
    operationalSummaryError: null,
    assetGroupDetails: null,
    assetGroupLoading: false,
    assetGroupError: null,
    selectedCentreId: null,
    selectedCentreConfig: null,
    selectedAssetGroupId: 'all-assets',
    tags: [],
    tagsLoading: false,
    tagsError: null,
    documents: [],
    documentsLoading: false,
    documentsError: null,
    assetGroups: [],
    assetGroupsLoading: false,
    assetGroupsError: null,
    locations: [],
    locationsLoading: false,
    locationsError: null,
    contractors: [],
    contractorsLoading: false,
    contractorsError: null,
};

const useAssetManagementStore = create<AssetManagementState & AssetManagementActions>()(
    ENABLE_DEVTOOLS
        ? devtools(
              (set, get) => ({
                  ...initialState,
                  setSearch: (value) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.search = value;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SEARCH,
                              payload: value,
                          },
                      ),
                  setSelectedStatus: (value) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedStatus = value;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_STATUS,
                              payload: value,
                          },
                      ),
                  setSelectedContractorId: (value) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedContractorId = value;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_CONTRACTOR_ID,
                              payload: value,
                          },
                      ),
                  setPaginationModel: (model) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.paginationModel = model;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_PAGINATION_MODEL,
                              payload: model,
                          },
                      ),
                  setSortModel: (model) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.sortModel = model;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SORT_MODEL,
                              payload: model,
                          },
                      ),
                  setFilterModel: (model) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.filterModel = model;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_FILTER_MODEL,
                              payload: model,
                          },
                      ),
                  setSelectedRowId: (id) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedRowId = id;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_ROW_ID,
                              payload: id,
                          },
                      ),
                  setShowCreateAssetModal: (open) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.showCreateAssetModal = open;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SHOWCREATEASSETMODAL,
                              payload: open,
                          },
                      ),
                  setLastClickedRowData: (row) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.lastClickedRowData = row;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_LAST_CLICKED_ROW_DATA,
                              payload: row,
                          },
                      ),
                  setAssets: (data) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assets = data;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSETS,
                              payload: data,
                          },
                      ),
                  setEnrichedAssets: (data) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.enrichedAssets = data;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ENRICHED_ASSETS,
                              payload: data,
                          },
                      ),
                  setAssetsLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetsLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSETS_LOADING,
                              payload: loading,
                          },
                      ),
                  setAssetsError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetsError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSETS_ERROR,
                              payload: error,
                          },
                      ),
                  setAssetsResponse: (response) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetsResponse = response;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSETS_RESPONSE,
                              payload: response,
                          },
                      ),
                  setIncluded: (included) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.included = included;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_INCLUDED,
                              payload: included,
                          },
                      ),
                  setMeta: (meta) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.meta = meta;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_META,
                              payload: meta,
                          },
                      ),
                  setSelectedAssetDetails: (details) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedAssetDetails = details;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_ASSET_DETAILS,
                              payload: details,
                          },
                      ),
                  setSelectedAssetLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedAssetLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_ASSET_LOADING,
                              payload: loading,
                          },
                      ),
                  setSelectedAssetError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedAssetError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_ASSET_ERROR,
                              payload: error,
                          },
                      ),
                  setAssetOperationalSummary: (summary) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetOperationalSummary = summary;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_OPERATIONAL_SUMMARY,
                              payload: summary,
                          },
                      ),
                  setOperationalSummaryLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.operationalSummaryLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_OPERATIONAL_SUMMARY_LOADING,
                              payload: loading,
                          },
                      ),
                  setOperationalSummaryError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.operationalSummaryError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_OPERATIONAL_SUMMARY_ERROR,
                              payload: error,
                          },
                      ),
                  resetSelectedAsset: () =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedAssetDetails = null;
                              draft.selectedAssetLoading = false;
                              draft.selectedAssetError = null;
                              draft.assetOperationalSummary = null;
                              draft.operationalSummaryLoading = false;
                              draft.operationalSummaryError = null;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.RESET_SELECTED_ASSET,
                          },
                      ),
                  resetFilters: () =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedStatus = '';
                              draft.selectedContractorId = '';
                              draft.search = '';
                              draft.filterModel = {
                                  items: [],
                                  logicOperator: 'and' as GridLogicOperator,
                              };
                          }),
                          false,
                          {
                              type: ACTION_TYPES.RESET_FILTERS,
                          },
                      ),
                  resetTableOptions: () =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.paginationModel = { page: 0, pageSize: 10 };
                              draft.sortModel = [];
                              draft.selectedRowId = null;
                              draft.lastClickedRowData = null;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.RESET_TABLE_OPTIONS,
                          },
                      ),
                  resetStore: () =>
                      set(
                          produce((draft: AssetManagementState) => {
                              Object.assign(draft, initialState);
                          }),
                          false,
                          {
                              type: ACTION_TYPES.RESET_STORE,
                          },
                      ),
                  // Utility function to convert MUI sort model to API sort fields
                  getSortFields: () => {
                      const { sortModel } = get();
                      return sortModel.map((item: GridSortItem) => ({
                          field: item.field,
                          direction: item.sort || 'asc',
                      }));
                  },
                  setAssetGroupDetails: (details) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetGroupDetails = details;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_GROUP_DETAILS,
                              payload: details,
                          },
                      ),
                  setAssetGroupLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetGroupLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_GROUP_LOADING,
                              payload: loading,
                          },
                      ),
                  setAssetGroupError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetGroupError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_GROUP_ERROR,
                              payload: error,
                          },
                      ),
                  setSelectedCentreId: (id) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedCentreId = id;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_CENTRE_ID,
                              payload: id,
                          },
                      ),
                  setSelectedCentreConfig: (config) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedCentreConfig = config;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_CENTRE_CONFIG,
                              payload: config,
                          },
                      ),
                  setSelectedAssetGroupId: (id) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.selectedAssetGroupId = id;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_SELECTED_ASSET_GROUP_ID,
                              payload: id,
                          },
                      ),
                  fetchTags: async () => {
                      set({ tagsLoading: true, tagsError: null });
                      try {
                          const response = await fetchTagsList();
                          set({ tags: response.data });
                      } catch (error) {
                          set({
                              tagsError: error instanceof Error ? error.message : 'Unknown error',
                          });
                      } finally {
                          set({ tagsLoading: false });
                      }
                  },
                  fetchDocuments: async () => {
                      set({ documentsLoading: true, documentsError: null });
                      try {
                          const response = await fetchDocumentsList();
                          set({ documents: response.data });
                      } catch (error) {
                          set({
                              documentsError:
                                  error instanceof Error ? error.message : 'Unknown error',
                          });
                      } finally {
                          set({ documentsLoading: false });
                      }
                  },
                  // Tags actions
                  setTags: (tags) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.tags = tags;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_TAGS,
                              payload: tags,
                          },
                      ),
                  setTagsLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.tagsLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_TAGS_LOADING,
                              payload: loading,
                          },
                      ),
                  setTagsError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.tagsError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_TAGS_ERROR,
                              payload: error,
                          },
                      ),
                  // Documents actions
                  setDocuments: (documents) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.documents = documents;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_DOCUMENTS,
                              payload: documents,
                          },
                      ),
                  setDocumentsLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.documentsLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_DOCUMENTS_LOADING,
                              payload: loading,
                          },
                      ),
                  setDocumentsError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.documentsError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_DOCUMENTS_ERROR,
                              payload: error,
                          },
                      ),
                  // Asset groups list actions
                  setAssetGroups: (assetGroups) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetGroups = assetGroups;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_GROUPS,
                              payload: assetGroups,
                          },
                      ),
                  setAssetGroupsLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetGroupsLoading = loading;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_GROUPS_LOADING,
                              payload: loading,
                          },
                      ),
                  setAssetGroupsError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.assetGroupsError = error;
                          }),
                          false,
                          {
                              type: ACTION_TYPES.SET_ASSET_GROUPS_ERROR,
                              payload: error,
                          },
                      ),
                  // Locations actions
                  setLocations: (locations) =>
                      set(
                          produce((state) => {
                              state.locations = locations;
                          }),
                          false,
                      ),
                  setLocationsLoading: (loading) =>
                      set(
                          produce((state) => {
                              state.locationsLoading = loading;
                          }),
                          false,
                      ),
                  setLocationsError: (error) =>
                      set(
                          produce((state) => {
                              state.locationsError = error;
                          }),
                          false,
                      ),
                  // Contractor actions
                  setContractors: (contractors) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.contractors = contractors;
                          }),
                      ),
                  setContractorsLoading: (loading) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.contractorsLoading = loading;
                          }),
                      ),
                  setContractorsError: (error) =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.contractorsError = error;
                          }),
                      ),
                  resetContractors: () =>
                      set(
                          produce((draft: AssetManagementState) => {
                              draft.contractors = [];
                              draft.contractorsLoading = false;
                              draft.contractorsError = null;
                          }),
                      ),
              }),
              { name: 'asset-management-store' },
          )
        : (set, get) => ({
              ...initialState,
              setSearch: (value) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.search = value;
                      }),
                  ),
              setSelectedStatus: (value) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedStatus = value;
                      }),
                  ),
              setSelectedContractorId: (value) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedContractorId = value;
                      }),
                  ),
              setPaginationModel: (model) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.paginationModel = model;
                      }),
                  ),
              setSortModel: (model) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.sortModel = model;
                      }),
                  ),
              setFilterModel: (model) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.filterModel = model;
                      }),
                  ),
              setSelectedRowId: (id) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedRowId = id;
                      }),
                  ),
              setShowCreateAssetModal: (open) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.showCreateAssetModal = open;
                      }),
                  ),
              setLastClickedRowData: (row) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.lastClickedRowData = row;
                      }),
                  ),
              setAssets: (data) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assets = data;
                      }),
                  ),
              setEnrichedAssets: (data) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.enrichedAssets = data;
                      }),
                  ),
              setAssetsLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetsLoading = loading;
                      }),
                  ),
              setAssetsError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetsError = error;
                      }),
                  ),
              setAssetsResponse: (response) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetsResponse = response;
                      }),
                  ),
              setIncluded: (included) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.included = included;
                      }),
                  ),
              setMeta: (meta) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.meta = meta;
                      }),
                  ),
              setSelectedAssetDetails: (details) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedAssetDetails = details;
                      }),
                  ),
              setSelectedAssetLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedAssetLoading = loading;
                      }),
                  ),
              setSelectedAssetError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedAssetError = error;
                      }),
                  ),
              setAssetOperationalSummary: (summary) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetOperationalSummary = summary;
                      }),
                  ),
              setOperationalSummaryLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.operationalSummaryLoading = loading;
                      }),
                  ),
              setOperationalSummaryError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.operationalSummaryError = error;
                      }),
                  ),
              resetSelectedAsset: () =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedAssetDetails = null;
                          draft.selectedAssetLoading = false;
                          draft.selectedAssetError = null;
                          draft.assetOperationalSummary = null;
                          draft.operationalSummaryLoading = false;
                          draft.operationalSummaryError = null;
                      }),
                  ),
              resetFilters: () =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedStatus = '';
                          draft.selectedContractorId = '';
                          draft.search = '';
                          draft.filterModel = {
                              items: [],
                              logicOperator: 'and' as GridLogicOperator,
                          };
                      }),
                  ),
              resetTableOptions: () =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.paginationModel = { page: 0, pageSize: 10 };
                          draft.sortModel = [];
                          draft.selectedRowId = null;
                          draft.lastClickedRowData = null;
                      }),
                  ),
              resetStore: () =>
                  set(
                      produce((draft: AssetManagementState) => {
                          Object.assign(draft, initialState);
                      }),
                  ),
              // Utility function to convert MUI sort model to API sort fields
              getSortFields: () => {
                  const { sortModel } = get();
                  return sortModel.map((item: GridSortItem) => ({
                      field: item.field,
                      direction: item.sort || 'asc',
                  }));
              },
              setAssetGroupDetails: (details) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetGroupDetails = details;
                      }),
                  ),
              setAssetGroupLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetGroupLoading = loading;
                      }),
                  ),
              setAssetGroupError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetGroupError = error;
                      }),
                  ),
              setSelectedCentreId: (id) => set({ selectedCentreId: id }),
              setSelectedCentreConfig: (config) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.selectedCentreConfig = config;
                      }),
                  ),
              setSelectedAssetGroupId: (id) => set({ selectedAssetGroupId: id }),
              fetchTags: async () => {
                  set({ tagsLoading: true, tagsError: null });
                  try {
                      const response = await fetchTagsList();
                      set({ tags: response.data });
                  } catch (error) {
                      set({
                          tagsError: error instanceof Error ? error.message : 'Unknown error',
                      });
                  } finally {
                      set({ tagsLoading: false });
                  }
              },
              fetchDocuments: async () => {
                  set({ documentsLoading: true, documentsError: null });
                  try {
                      const response = await fetchDocumentsList();
                      set({ documents: response.data });
                  } catch (error) {
                      set({
                          documentsError: error instanceof Error ? error.message : 'Unknown error',
                      });
                  } finally {
                      set({ documentsLoading: false });
                  }
              },
              // Tags actions
              setTags: (tags) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.tags = tags;
                      }),
                  ),
              setTagsLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.tagsLoading = loading;
                      }),
                  ),
              setTagsError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.tagsError = error;
                      }),
                  ),
              // Documents actions
              setDocuments: (documents) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.documents = documents;
                      }),
                  ),
              setDocumentsLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.documentsLoading = loading;
                      }),
                  ),
              setDocumentsError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.documentsError = error;
                      }),
                  ),
              // Asset groups list actions
              setAssetGroups: (assetGroups) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetGroups = assetGroups;
                      }),
                  ),
              setAssetGroupsLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetGroupsLoading = loading;
                      }),
                  ),
              setAssetGroupsError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.assetGroupsError = error;
                      }),
                  ),
              // Locations actions
              setLocations: (locations) =>
                  set(
                      produce((state) => {
                          state.locations = locations;
                      }),
                      false,
                  ),
              setLocationsLoading: (loading) =>
                  set(
                      produce((state) => {
                          state.locationsLoading = loading;
                      }),
                      false,
                  ),
              setLocationsError: (error) =>
                  set(
                      produce((state) => {
                          state.locationsError = error;
                      }),
                      false,
                  ),
              // Contractor actions
              setContractors: (contractors) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.contractors = contractors;
                      }),
                  ),
              setContractorsLoading: (loading) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.contractorsLoading = loading;
                      }),
                  ),
              setContractorsError: (error) =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.contractorsError = error;
                      }),
                  ),
              resetContractors: () =>
                  set(
                      produce((draft: AssetManagementState) => {
                          draft.contractors = [];
                          draft.contractorsLoading = false;
                          draft.contractorsError = null;
                      }),
                  ),
          }),
);

export { useAssetManagementStore };
export default useAssetManagementStore;
