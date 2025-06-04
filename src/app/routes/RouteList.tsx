import { SelectTenancy } from '@mallcomm/portals-auth';
import AssetManagement from '../../features/assetManagement/AssetManagement.tsx';
import AssetDetailsPage from '../../features/assetManagement/pages/AssetDetailsPage.tsx';
import CaseWorkOrder from '../../features/caseWorkOrder/CaseWorkOrder.tsx';
import ViewCase from '../../features/caseWorkOrder/ViewCase.tsx';
import ContractorDatabase from '../../features/contractorDatabase/ContractorDatabase.tsx';
import Dashboard from '../../features/dashboard/Dashboards.tsx';
import DocumentList from '../../features/documentLibrary/DocumentList.tsx';
import EditDetails from '../../features/documentLibrary/EditDetails.tsx';
import ViewDetails from '../../features/documentLibrary/ViewDetails.tsx';
import InvoiceList from '../../features/invoice/InvoiceList.tsx';
import AuditingInspectionTaskGranular from '../../features/auditingInspections/AuditingInspectionTask.tsx';
import AuditingInspectionsInspectionReports from '../../features/auditingInspections/singlPlan/InspectionReports.tsx';
import AuditingInspectionsComplianceReports from '../../features/auditingInspections/singlPlan/ComplianceReports.tsx';
import AuditingComplianceTaskGranular from '../../features/auditingInspections/AuditingComplianceTask.tsx';
import AuditingInpectionPropertyView from '../../features/auditingInspections/property/InspectionReports.tsx';
import AuditingCompliancePropertyView from '../../features/auditingInspections/property/ComplianceReports.tsx';
import AuditingInspectionCompliance from '../../features/auditingInspections/portfolio/AuditingInspectionCompliance.tsx';
import ScheduleList from '../../features/scheduling/ScheduleList.tsx';
import BrowserReport from '../../features/report/BrowseReport.tsx';
import ViewReport from '../../features/report/ViewReport.tsx';
import ListEmailSchedule from '../../features/reportSchedule/ListEmailSchedule.tsx';

const routes = [
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/home',
        element: <Dashboard />,
    },
    {
        path: '/contractor-database',
        element: <ContractorDatabase />,
    },

    {
        path: '/invoices',
        element: <InvoiceList />,
    },
    {
        path: '/document-library',
        element: <DocumentList />,
    },
    {
        path: '/edit-detail',
        element: <EditDetails />,
    },
    {
        path: '/view-detail',
        element: <ViewDetails />,
    },
    {
        path: '/cases-and-work-orders',
        element: <CaseWorkOrder />,
    },
    {
        path: '/cases-view',
        element: <ViewCase />,
    },
    {
        path: '/auditing-task-inspections',
        element: <AuditingInspectionTaskGranular />,
    },
    {
        path: '/auditing-task-compliance',
        element: <AuditingComplianceTaskGranular />,
    },
    {
        path: '/auditing-single-inspections',
        element: <AuditingInspectionsInspectionReports />,
    },
    {
        path: '/auditing-single-compliance',
        element: <AuditingInspectionsComplianceReports />,
    },

    {
        path: '/auditing-property-inspections',
        element: <AuditingInpectionPropertyView />,
    },
    {
        path: '/auditing-property-compliance',
        element: <AuditingCompliancePropertyView />,
    },

    {
        path: '/auditing-protfolio',
        element: <AuditingInspectionCompliance />,
    },
    {
        path: '/asset-management',
        element: <AssetManagement />,
    },
    {
        path: '/asset-management/asset/:assetId',
        element: <AssetManagement />,
    },
    {
        path: '/asset/:assetId',
        element: <AssetDetailsPage />,
    },
    {
        path: '/scheduling-and-plans',
        element: <ScheduleList />,
    },

    {
        path: '/browse-report',
        element: <BrowserReport />,
    },
    {
        path: '/view-report',
        element: <ViewReport />,
    },
    {
        path: '/schedule-report',
        element: <ListEmailSchedule />,
    },
    {
        path: '/get-tenancy',
        element: <SelectTenancy />,
    },
];

export default routes;
