import {
    // CalendarMonthOutlined,
    // EditCalendarOutlined,
    VpnKeyOutlined,
    // AddBoxOutlined,
    Dashboard,
    ListAltOutlined,
    ForumOutlined,
    // HowToRegOutlined,
    FolderOutlined,
    EngineeringOutlined,
    ReceiptOutlined,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
// import MovingIcon from '@mui/icons-material/Moving';
// import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import DnsIcon from '@mui/icons-material/Dns';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
// import FindInPageSharpIcon from '@mui/icons-material/FindInPageSharp';
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';

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

    setActiveSection: (value: string) => void;
    setActiveTitle: (value: string) => void;
}

const links = ({
    t,

    // audtingInspectionsOpen,
    // setAuditiongInspectionsOpen,
    // complianceOpen,
    // setComplianceOpen,
    setActiveSection,
    setActiveTitle,
}: LinksInterface) => {
    const links = [
        {
            type: 'section',
            name: 'home',
            text: t('navigation.section-title.home'),
            icon: HomeIcon,
            to: '/home',
            onclick: () => {
                setActiveSection('home');
                setActiveTitle(t('navigation.section-title.home'));
            },
            children: [
                {
                    type: 'link',
                    to: '/home',
                    icon: Dashboard,
                    text: t('navigation.dashboard'),
                },
                // {
                //     type: 'link',
                //     to: '/create-new-dashboard',
                //     icon: AddBoxOutlined,
                //     text: t('navigation.create-new'),
                // },
            ],
        },
        // {
        //     type: 'section',
        //     name: 'reporting',
        //     text: t('navigation.section-title.reporting'),
        //     icon: MovingIcon,
        //     to: '/browse-report',
        //     onclick: () => {
        //         setActiveSection('reporting');
        //         setActiveTitle(t('navigation.section-title.reporting'));
        //     },
        //     children: [
        //         {
        //             type: 'link',
        //             to: '/browse-report',
        //             icon: ReceiptOutlined,
        //             text: t('navigation.reporting'),
        //         },
        //     ],
        // },
        // {
        //     type: 'section',
        //     name: 'schedule',
        //     text: t('navigation.section-title.schedule'),
        //     icon: WorkHistoryIcon,
        //     to: '/calendar',
        //     onclick: () => {
        //         setActiveSection('schedule');
        //         setActiveTitle(t('navigation.section-title.schedule'));
        //     },
        //     children: [
        //         {
        //             type: 'link',
        //             to: '/calendar',
        //             icon: CalendarMonthOutlined,
        //             text: t('navigation.calendar'),
        //         },
        //         {
        //             type: 'link',
        //             to: '/scheduling-and-plans',
        //             icon: EditCalendarOutlined,
        //             text: t('navigation.scheduling-and-plans'),
        //         },
        //     ],
        // },

        {
            type: 'section',
            name: 'assetsAndMaintenance',
            text: t('navigation.section-title.assets-and-maintenance'),
            icon: DnsIcon,
            to: '/asset-management',
            onclick: () => {
                setActiveSection('assetsAndMaintenance');
                setActiveTitle(t('navigation.section-title.assets-and-maintenance'));
            },
            children: [
                {
                    type: 'link',
                    to: '/asset-management',
                    icon: VpnKeyOutlined,
                    text: t('navigation.asset-management'),
                },
            ],
        },

        {
            type: 'section',
            name: 'casesAndWorkOrders',
            text: t('navigation.section-title.cases-and-work-orders'),
            icon: DocumentScannerIcon,
            to: '/cases-and-work-orders',
            onclick: () => {
                setActiveSection('casesAndWorkOrders');
                setActiveTitle(t('navigation.section-title.cases-and-work-orders'));
            },
            children: [
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
            ],
        },
        // {
        //     type: 'section',
        //     name: 'auditingProtfolio',
        //     text: t('navigation.section-title.inspection-and-compliance'),
        //     icon: FindInPageSharpIcon,
        //     to: '/auditing-protfolio',
        //     onclick: () => {
        //         setActiveSection('auditingProtfolio');
        //         setActiveTitle(t('navigation.section-title.inspection-and-compliance'));
        //     },
        //     children: [
        //         {
        //             type: 'link',
        //             to: '/auditing-protfolio',
        //             icon: HowToRegOutlined,
        //             text: t('navigation.section-title.inspection-and-compliance'),
        //         },
        //         {
        //             type: 'collapsible',
        //             open: audtingInspectionsOpen,
        //             onclick: () => setAuditiongInspectionsOpen(!audtingInspectionsOpen),
        //             icon: EngineeringOutlined,
        //             text: t('navigation.inspections'),
        //             items: [
        //                 {
        //                     type: 'link',
        //                     to: '/auditing-property-inspections',
        //                     text: t('common.proprty-level-view'),
        //                 },
        //                 {
        //                     type: 'link',
        //                     to: '/auditing-single-inspections',
        //                     text: t('common.single-plan'),
        //                 },
        //                 {
        //                     type: 'link',
        //                     to: '/auditing-task-inspections',
        //                     text: t('common.task-granular-view'),
        //                 },
        //             ],
        //         },
        //         {
        //             type: 'collapsible',
        //             open: complianceOpen,
        //             onclick: () => setComplianceOpen(!complianceOpen),
        //             icon: EngineeringOutlined,
        //             text: t('common.compliance'),
        //             items: [
        //                 {
        //                     type: 'link',
        //                     to: '/auditing-property-compliance',
        //                     text: t('common.proprty-level-view'),
        //                 },
        //                 {
        //                     type: 'link',
        //                     to: '/auditing-single-compliance',
        //                     text: t('common.single-plan'),
        //                 },
        //                 {
        //                     type: 'link',
        //                     to: '/auditing-task-compliance',
        //                     text: t('common.task-granular-view'),
        //                 },
        //             ],
        //         },
        //     ],
        // },
        {
            type: 'section',
            name: 'documentation',
            text: t('navigation.section-title.documentation'),
            icon: FolderOpenSharpIcon,
            to: '/document-library',
            onclick: () => {
                setActiveSection('documentation');
                setActiveTitle(t('navigation.section-title.documentation'));
            },
            children: [
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
            ],
        },
    ];

    return links;
};

export default links;
