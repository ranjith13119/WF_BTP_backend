const axios = require("axios");
const btoa = require("btoa");
const qs = require("qs");

BASE_URL = "https://api.workflow-sap.cfapps.us10.hana.ondemand.com/workflow-service/rest"

const StartWFInstance = async (context) => {
  var token = await fetchAccessToken();
  const data = {
    definitionId: "demoshoppingworkflow.demoshoppingworkflow",
    context,
  };

  return await axios
    .request({
      url: "/v1/workflow-instances",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      baseURL: BASE_URL,
      data: data,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const fetchAccessToken = async () => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const headers = {
    authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return await axios
    .post("https://xxxx.authentication.us10.hana.ondemand.com/oauth/token",
      qs.stringify({ grant_type: "client_credentials" }),
      {
        headers: headers,
      }
    )
    .then((response) => {
      return response.data.access_token;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const GetWFTasks = async (user) => {
  var token = await fetchAccessToken();
  const activityId = convertUserToActivity(user);
  if (!activityId) {
    throw new Error("Invalid User - " + user);
  } else {
    return await axios
      .request({
        url: "/v1/task-instances",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        baseURL: BASE_URL,
        params: {
          status: "READY",
          activityId: activityId,
          workflowDefinitionId: "demoshoppingworkflow.demoshoppingworkflow",
        },
      })
      .then(async (res) => {
        return res.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
};

const GetTaskContext = async (task) => {
  var taskId;
  if (task.id) {
    taskDetails = task;
    taskId = task.id;
  } else {
    if (task) {
      taskId = task;
    } else {
      throw new Error("Invalid Task ID - " + task.id);
    }
  }
  var token = await fetchAccessToken();
  return await axios
    .request({
      url: "/v1/task-instances/" + taskId + "/context",
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
      baseURL: BASE_URL,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const convertUserToActivity = (user) => {
  var activityUser = null;
  switch (user) {
    case "Pick-up":
      activityUser = "usertask3";
      break;
    case "Dispatched":
      activityUser = "usertask6";
      break;
    case "Delivered":
      activityUser = "usertask8";
      break;
    default:
      activityUser = null;
  }
  return activityUser;
};

const CompleteTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Invalid Task ID - " + taskId);
  } else {
    var token = await fetchAccessToken();
    return await axios
      .request({
        url: "/v1/task-instances/" + taskId,
        headers: { Authorization: `Bearer ${token}` },
        method: "PATCH",
        baseURL: BASE_URL,
        data: { context: {}, status: "COMPLETED" },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
};



module.exports = {
  StartWFInstance,
  GetWFTasks,
  GetTaskContext,
  convertUserToActivity,
  CompleteTask,
};
