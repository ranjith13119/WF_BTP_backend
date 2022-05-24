using my.cai as caidb from '../db/cai-model';


service CatalogService {
    @readonly
    entity Products as projection on caidb.Products {
        ProductID,
        ProductName,
        Description,
        Price,
        ImageURL
    };

    @readonly entity Invoice as projection on caidb.Invoice;


    type orderData {
        CustomerName  : String;
        CustomerEmail : String;
        Address       : String;
        ProductID     : String;
        ProductName   : String;
        Quantity      : Integer;
    }

    type WFContext : caidb.Invoice {
        orderData : String;
        recipient: String;
        response: {
            comments: String;
        }
    };

    action submitOrder(recipient : String, orderData : orderData) returns {
        Id : String;
        message : String;
    };

    function getTaskDetails(user : String) returns array of {
        activityId : String;
        createdAt : DateTime;
        description : String;
        id : UUID;
        status : String;
        subject : String;
        workflowDefinitionId: String;
        workflowInstanceId : UUID;
        priority : String;
        createdBy : String;
        definitionId : String;
        lastChangedAt : DateTime;
        applicationScope : String;
        context : WFContext;
    };

    action completeTask(id : String, user : String, wfId:String) returns {
        message : String;
    };

    function getWFStatus(wfId:String) returns {
        status : String;
    }
}