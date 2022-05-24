namespace my.cai;

entity Products {
    key ProductID   : Integer;
        ProductName : String;
        Description : String;
        Price       : Decimal;
        ImageURL    : String;
}

type Status : String enum { approvalpending; pickup; dispatched; delivered;}


entity Invoice : Products {
    key InvoiceID     : UUID;
        CustomerName  : String;
        CustomerEmail : String;
        Address       : String;
        Quantity      : Integer;
        purchaseDate  : Date default $now;
        status :  Status default 'approvalpending';
}
