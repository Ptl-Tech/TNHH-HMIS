import axios from "axios";

const paramsConverter = (params) => {
  if (!params.length) return "";

  var returnValue = "$filter=";
  var parameters = [];
  for (const item of params) {
    const { key, value, operator, notString } = item;
    var newParam = notString
      ? `${key} ${operator} ${value}`
      : `${key} ${operator} '${value}'`;
    parameters.push(newParam);
    return newParam.join(" and ");
  }

  return "";
};

odatawrapper.get("URL/Pharmacy/PharmacyHeader", {
  params: {
    filter: [
      { key: "Name", value: "Milk", operator: "eq" },
      { key: "Cow", value: "Shure", operator: "gt" },
    ],
  },
});

const odataGet = async (URL, params, config) => {
  await axios.get();
};
const odataPost = async (URL, body, config) => {
  await axios.post();
};

export const odatawrapper = async (query, options, config) => {
  const { and = null, or = null, eq, body = null } = options;

  var paramsString = [];
  const response = await axios[API_METHOD](query, body, config);

  return { get: odataGet, post: odataPost };
};
