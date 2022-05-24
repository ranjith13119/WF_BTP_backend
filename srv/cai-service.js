const cds = require("@sap/cds");
const { api } = require("./handler");

class CatalogService extends cds.ApplicationService {
  init() {
    this.on("submitOrder", api._submitorder);
    this.on("getTaskDetails", api.getTasksDetails);
    this.on("completeTask", api.completeWFTask);
    this.on("getWFStatus", api.getWFStatus);
    return super.init();
  }
}

module.exports = {
  CatalogService,
};
