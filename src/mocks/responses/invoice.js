import { Description } from "@mui/icons-material";
import { RANDOM_AVATAR } from '../../constants';
const invoice = {
    data: [
        {
            id: 1,
            invoiceType: "Issued",
            invoiceNumber: "W-78596",
            avatar: {RANDOM_AVATAR},
            ContractorTenantName: "Doe Inc.",
            amount: "5845660",
            dateIssued: "25/10/2024",
            dueDate: "24/10/2025",
            paymentStatus: "Paid"
        },
        {
            id: 2,
            invoiceType: "Issued",
            invoiceNumber: "W-78546",
            avatar: {RANDOM_AVATAR},
            ContractorTenantName: "Smith Inc.",
            amount: "5845660",
            dateIssued:  "15/09/2024",
            dueDate: "14/09/2025",
            paymentStatus: "Unpaid",
        },
        {
            id: 3,
            invoiceType: "Issued",
            invoiceNumber: "W-58545",
            avatar: {RANDOM_AVATAR},
            ContractorTenantName: "Doe T.",
            amount: "48566",
            dateIssued: "11/08/2024",
            dueDate: "10/08/2025",
            paymentStatus: "Paid"
        },
    ]
}

export default invoice;
