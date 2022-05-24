const cds = require("@sap/cds");
const workflow = require("./workflow");
const { Invoice, Products } = cds.entities;
const log = require("cf-nodejs-logging-support");
log.setLoggingLevel("info");
log.registerCustomFields(["servicess"]);

const _submitorder = async (req) => {
  try {
    const data = await workflow.StartWFInstance(req.data);
    var msg = "Order submitted succesfully.";
    try {
      const { orderData } = req.data;
      const productData = await SELECT.from(Products, [
        "Description",
        "Price",
        "ImageURL",
      ]).where({ ProductID: parseInt(orderData.ProductID) });
      if (productData && productData.length) {
        const iAffectedRows = await INSERT({
          InvoiceID: data.id,
          purchaseDate: new Date(),
          ...orderData,
          ...productData[0],
          Price: orderData.Quantity * productData[0].Price,
          status: 'approvalpending',
        }).into(Invoice);

        msg +=
          iAffectedRows && iAffectedRows.results && iAffectedRows.results.length
            ? "Invoice will be send to your mail soon."
            : getInvoiceErrMsg();
      } else {
        msg += getInvoiceErrMsg();
      }
    } catch (err) {
      msg += getInvoiceErrMsg();
    }

    return {
      Id: data.id,
      message: msg,
    };
  } catch (err) {
    req.error(404, err);
  }
};

const getTasksDetails = async (req) => {
  try {
    const wfTasks = await workflow.GetWFTasks(req.data.user);
    if (Array.isArray(wfTasks) && wfTasks.length) {
      for (let task of wfTasks) {
        var oData = await workflow.GetTaskContext(task);
        task.context = oData;
        if (oData && oData.orderData) {
          const productData = await SELECT.from(Products, [
            "Description",
            "Price",
            "ImageURL",
          ]).where({ ProductID: parseInt(oData.orderData.ProductID) });
          if (productData && productData.length) {
            task.context.orderData = {
              ...oData.orderData,
              ...productData[0],
              Price: oData.orderData.Quantity * productData[0].Price,
            };
          }
        }
      }
    }

    return wfTasks || [];
  } catch (err) {
    req.error(err || "404", "No Item Found");
  }
};

const getInvoiceErrMsg = () => {
  return "Invoice will be generated soon as we are having issue with invoice generation.";
};

const completeWFTask = async (req) => {
  try {
    await workflow.CompleteTask(req.data.id);
   try {
        await UPDATE(Invoice)
        .set("status", getStatusValue(req.data.user))
        .where({ InvoiceID: req.data.wfId });
   } catch(oErr) {

   }
    
    return {
      message: `Task Instance ${req.id} completed successfully.`,
    };
  } catch (oErr) {
    req.error("500", "Error while completing task." + oErr.message);
  }
};

const getWFStatus = async (req) => {
  try {
    var oStatus = { status : ""};
    const sStatus = await SELECT.from(Invoice, ["Status"]).where({
      InvoiceID: req.data.wfId,
    });
    if(Array.isArray(sStatus) && sStatus.length) {
        oStatus = { status: sStatus[0].Status };
    } else {
        throw new Error("Please provid the valid tracking ID")
    }
    return oStatus;
  } catch (oErr) {
    req.error(oErr);
  }
};

const getStatusValue = (sUser) => {
  var activityUser = null;
  switch (sUser) {
    case "usertask3":
      activityUser = 'pickup';
      break;
    case "usertask6":
      activityUser = 'dispatched';
      break;
    case "usertask8":
      activityUser = 'delivered';
      break;
    default:
      activityUser = 'approvalpending';
  }
  return activityUser;
};

module.exports = {
  _submitorder,
  getTasksDetails,
  completeWFTask,
  getWFStatus,
};
