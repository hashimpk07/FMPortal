import {
    CalendarMonthOutlined,
    EditCalendarOutlined,
    VpnKeyOutlined,
    AddBoxOutlined,
    Dashboard,
    ListAltOutlined,
    ForumOutlined,
    ZoomInOutlined,
    AssuredWorkloadOutlined,
    HowToRegOutlined,
    FolderOutlined,
    EngineeringOutlined,
    ReceiptOutlined,
} from '@mui/icons-material';
import { type TFunction } from 'i18next';

interface LinksInterface {
    t: TFunction;
    inspectionsOpen: boolean;
    setInspectionsOpen: (value: boolean) => void;

    audtingInspectionsOpen: boolean;
    setAuditiongInspectionsOpen: (value: boolean) => void;

    complianceOpen: boolean;
    setComplianceOpen: (value: boolean) => void;

    propertyComplianceOpen: boolean;
    setPropertyComplianceOpen: (value: boolean) => void;
    tenantComplianceOpen: boolean;
    setTenantComplianceOpen: (value: boolean) => void;
}

const links = ({
    t,
    inspectionsOpen,
    setInspectionsOpen,

    audtingInspectionsOpen,
    setAuditiongInspectionsOpen,

    complianceOpen,
    setComplianceOpen,

    propertyComplianceOpen,
    setPropertyComplianceOpen,
    tenantComplianceOpen,
    setTenantComplianceOpen,
}: LinksInterface) => {
    const links = [
        {
            type: 'section',
            text: t('navigation.section-title.home'),
        },
        {
            type: 'link',
            to: '/',
            icon: Dashboard,
            text: t('navigation.dashboard'),
        },
        {
            type: 'link',
            to: '/create-new-dashboard',
            icon: AddBoxOutlined,
            text: t('navigation.create-new'),
        },
        {
            type: 'section',
            text: t('navigation.section-title.schedule'),
        },
        {
            type: 'link',
            to: '/calendar',
            icon: CalendarMonthOutlined,
            text: t('navigation.calendar'),
        },
        {
            type: 'link',
            to: '/scheduling-and-plans',
            icon: EditCalendarOutlined,
            text: t('navigation.scheduling-and-plans'),
        },
        {
            type: 'section',
            text: t('navigation.section-title.assets-and-maintenance'),
        },
        {
            type: 'link',
            to: '/asset-management',
            icon: VpnKeyOutlined,
            text: t('navigation.asset-management'),
        },
        {
            type: 'section',
            text: t('navigation.section-title.cases-and-work-orders'),
        },
        {
            type: 'link',
            to: '/cases-and-work-orders',
            icon: ListAltOutlined,
            text: t('navigation.cases-and-work-orders'),
        },
        {
            type: 'link',
            to: '/feedback',
            icon: ForumOutlined,
            text: t('navigation.feedback'),
        },
        {
            type: 'section',
            text: t('navigation.section-title.inspection-and-compliance'),
        },
        {
            type: 'link',
            to: '/auditing-protfolio',
            icon: HowToRegOutlined,
            text: t('navigation.section-title.inspection-and-compliance'),
        },
        {
            type: 'collapsible',
            open: audtingInspectionsOpen,
            onclick: () => setAuditiongInspectionsOpen(!audtingInspectionsOpen),
            icon: EngineeringOutlined,
            text: t('navigation.inspections'),
            items: [
                {
                    type: 'link',
                    to: '/auditing-property-inspections',
                    text: t('common.proprty-level-view'),
                },
                {
                    type: 'link',
                    to: '/auditing-single-inspections',
                    text: t('common.single-plan'),
                },
                {
                    type: 'link',
                    to: '/auditing-task-inspections',
                    text: t('common.task-granular-view'),
                },
            ],
        },
        {
            type: 'collapsible',
            open: complianceOpen,
            onclick: () => setComplianceOpen(!complianceOpen),
            icon: EngineeringOutlined,
            text: t('common.compliance'),
            items: [
                {
                    type: 'link',
                    to: '/auditing-property-compliance',
                    text: t('common.proprty-level-view'),
                },
                {
                    type: 'link',
                    to: '/auditing-single-compliance',
                    text: t('common.single-plan'),
                },
                {
                    type: 'link',
                    to: '/auditing-task-compliance',
                    text: t('common.task-granular-view'),
                },
            ],
        },
        {
            type: 'section',
            text: t('navigation.section-title.inspection-and-compliance'),
        },
        {
            type: 'collapsible',
            open: inspectionsOpen,
            onclick: () => setInspectionsOpen(!inspectionsOpen),
            icon: ZoomInOutlined,
            text: t('navigation.inspections'),
            items: [
                {
                    type: 'link',
                    to: '/carpark',
                    text: t('navigation.carpark'),
                },
                {
                    type: 'link',
                    to: '/bathrooms',
                    text: t('navigation.bathrooms'),
                },
                {
                    type: 'link',
                    to: '/perimeter-checks',
                    text: t('navigation.perimeter-checks'),
                },
            ],
        },
        {
            type: 'collapsible',
            open: propertyComplianceOpen,
            onclick: () => setPropertyComplianceOpen(!propertyComplianceOpen),
            icon: AssuredWorkloadOutlined,
            text: t('navigation.property-compliance'),
            items: [
                {
                    type: 'link',
                    to: '/pat-testing',
                    text: t('navigation.pat-testing'),
                },
                {
                    type: 'link',
                    to: '/fire-extinguishers',
                    text: t('navigation.fire-extinguishers'),
                },
                {
                    type: 'link',
                    to: '/fire-doors',
                    text: t('navigation.fire-doors'),
                },
            ],
        },
        {
            type: 'collapsible',
            open: tenantComplianceOpen,
            onclick: () => setTenantComplianceOpen(!tenantComplianceOpen),
            icon: HowToRegOutlined,
            text: t('navigation.tenant-compliance'),
            items: [
                {
                    type: 'link',
                    to: '/pest-control',
                    text: t('navigation.pest-control'),
                },
                {
                    type: 'link',
                    to: '/hood-inspection',
                    text: t('navigation.hood-inspection'),
                },
                {
                    type: 'link',
                    to: '/storefront-inspections',
                    text: t('navigation.storefront-inspections'),
                },
                {
                    type: 'link',
                    to: '/citations',
                    text: t('navigation.citations'),
                },
            ],
        },
        {
            type: 'section',
            text: t('navigation.section-title.documentation'),
        },
        {
            type: 'link',
            to: '/document-library',
            icon: FolderOutlined,
            text: t('navigation.document-library'),
        },
        {
            type: 'link',
            to: '/contractor-database',
            icon: EngineeringOutlined,
            text: t('navigation.contractor-database'),
        },
        {
            type: 'link',
            to: '/invoices',
            icon: ReceiptOutlined,
            text: t('navigation.invoices'),
        },
        {
            type: 'section',
            text: t('navigation.section-title.reporting'),
        },
        {
            type: 'link',
            to: '/browse-report',
            icon: ReceiptOutlined,
            text: t('navigation.reporting'),
        },
    ];

    return links;
};

export default links;
