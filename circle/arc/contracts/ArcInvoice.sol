// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArcInvoice {
    enum InvoiceStatus {
        Unknown,
        Created,
        Paid,
        Cancelled
    }

    struct Invoice {
        address merchant;
        address payer;
        uint256 amount;
        uint64 createdAt;
        uint64 paidAt;
        string metadataURI;
        InvoiceStatus status;
    }

    mapping(bytes32 => Invoice) private invoices;

    event InvoiceCreated(bytes32 indexed invoiceId, address indexed merchant, uint256 amount, string metadataURI);
    event InvoicePaid(
        bytes32 indexed invoiceId,
        address indexed merchant,
        address indexed payer,
        uint256 amount,
        uint256 paidAt
    );
    event InvoiceCancelled(bytes32 indexed invoiceId, address indexed merchant, uint256 cancelledAt);

    function createInvoice(bytes32 invoiceId, uint256 amount, string calldata metadataURI) external {
        require(invoiceId != bytes32(0), "invoice id required");
        require(amount > 0, "amount required");
        require(invoices[invoiceId].status == InvoiceStatus.Unknown, "invoice exists");

        invoices[invoiceId] = Invoice({
            merchant: msg.sender,
            payer: address(0),
            amount: amount,
            createdAt: uint64(block.timestamp),
            paidAt: 0,
            metadataURI: metadataURI,
            status: InvoiceStatus.Created
        });

        emit InvoiceCreated(invoiceId, msg.sender, amount, metadataURI);
    }

    function payInvoice(bytes32 invoiceId) external payable {
        Invoice storage invoice = invoices[invoiceId];

        require(invoice.status == InvoiceStatus.Created, "invoice not payable");
        require(msg.value == invoice.amount, "incorrect amount");

        invoice.status = InvoiceStatus.Paid;
        invoice.payer = msg.sender;
        invoice.paidAt = uint64(block.timestamp);

        (bool sent, ) = payable(invoice.merchant).call{value: msg.value}("");
        require(sent, "settlement failed");

        emit InvoicePaid(invoiceId, invoice.merchant, msg.sender, msg.value, block.timestamp);
    }

    function cancelInvoice(bytes32 invoiceId) external {
        Invoice storage invoice = invoices[invoiceId];

        require(invoice.status == InvoiceStatus.Created, "invoice not cancellable");
        require(invoice.merchant == msg.sender, "merchant only");

        invoice.status = InvoiceStatus.Cancelled;

        emit InvoiceCancelled(invoiceId, msg.sender, block.timestamp);
    }

    function getInvoice(bytes32 invoiceId) external view returns (Invoice memory) {
        return invoices[invoiceId];
    }
}
