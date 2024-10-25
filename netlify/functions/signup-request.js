
/**
 * Receives a HTTP request and replies with a response.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
const fetchApi = require('node-fetch-npm');
const DEFAULT_DEV_ACCOUNT_TYPE = process.env.DEFAULT_DEV_ACCOUNT_TYPE;
const DEFAULT_USER_ORG_TYPE = process.env.DEFAULT_USER_ORG_TYPE;
const DEVELOPER_DEFAULT_ROLES = process.env.DEVELOPER_DEFAULT_ROLES;
const MARKET_ID = process.env.MARKET_ID;
const OC_API_BASE_URL = process.env.OC_API_BASE_URL;
const REQUEST_APPROVED_EVENT_TYPE = process.env.REQUEST_APPROVED_EVENT_TYPE;
const SECRET = process.env.OC_JWT_SECRET;
const SIGN_UP_REQUEST = process.env.SIGN_UP_REQUEST;
const USER_INVITE_TEMPLATEID = process.env.DEV_INVITE_TEMPLATEID;
const REQUEST_CREATED_EVENT_TYPE = process.env.REQUEST_CREATED_EVENT_TYPE
const REQUEST_REJECTED_EVENT_TYPE = process.env.REQUEST_REJECTED_EVENT_TYPE

exports.handler = async function (event, context) {
  console.log(event.httpMethod, "Hello from function", JSON.stringify(event));
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      contentType: 'application/json',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ "msg": "function triggered successfully" }),
    };
  }
  console.log("function called from : " + event?.headers?.['client-ip']);
}

async function createInvite(inviteBody) {
  const url = OC_API_BASE_URL + "/invites/developers";
  const auth = Buffer.from(MARKET_ID + ':' + SECRET).toString('base64');
  const reqInvite = {
    body: JSON.stringify(inviteBody),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Authorization": "Basic " + auth
    },
  }
  const response = await fetchApi(url, reqInvite);
  return {
    statusCode: 200,
    contentType: 'application/json',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ "msg": "Invite Created Successfully" }),
  };
}

async function fetchEventByEventId(eventId) {
  const url = OC_API_BASE_URL + "/events/" + eventId;
  const auth = Buffer.from(MARKET_ID + ':' + SECRET).toString('base64');;
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Authorization": "Basic " + auth
    },
  }
  const response = await fetchApi(url, init)
  return await response.json();
}

async function createOrganization(reqJson) {
  const orgId = create_UUID();
  const url = OC_API_BASE_URL + "/developers/" + orgId;
  const auth = Buffer.from(MARKET_ID + ':' + SECRET).toString('base64');;
  let customData = {
    // "partner-tier":reqJson.request.customData['partner-tier'],
    'first-name': reqJson.request.customData['first-name'],
    'last-name': reqJson.request.customData['last-name'],
    'business-email': reqJson.request.customData['business-email'],
    'title': reqJson.request.customData['title'],
    'country': reqJson.request.customData['country'],
  }
  const body = {
    "name": reqJson.request.name,
    "business-email": reqJson.request.customData['business-email'],
    "type": DEFAULT_USER_ORG_TYPE,
    "customData": customData,
  }
  const init = {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Authorization": "Basic " + auth
    },
  }
  return await fetchApi(url, init)
}

async function updateRequest(developerId, requestBody) {

  const requestObj = await fetchRequestDetails(requestBody);
  const requestData = JSON.parse(await requestObj.text());
  requestBody.customData.orgId = developerId;
  const url = OC_API_BASE_URL + "requests/" + requestData.requestId;
  const auth = Buffer.from(MARKET_ID + ':' + SECRET).toString('base64');
  const request = {
    body: JSON.stringify(requestBody),
    method: "PATCH",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Authorization": "Basic " + auth
    },
  }
  const response = await fetchApi(url, request);
  return {
    statusCode: 200,
    contentType: 'application/json',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ "msg": "Organization Created Successfully" }),
  };
  // return await fetchApi(url, request);
}

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}