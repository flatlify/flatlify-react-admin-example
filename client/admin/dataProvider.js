const axios = require('axios').default;

const getRouteURL = (baseURL, resource) => {
  switch (resource) {
    case 'content-types':
      return `${baseURL}/content-types/content-types`;
    default:
      return `${baseURL}/content/${resource}`;
  }
};

const processData = params => {
  const headers = {};

  const formData = new FormData();
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(params.data)) {
    formData.append(key, value);
  }
  headers['Content-Type'] = `multipart/form-data; boundary=${formData.boundary}`;

  return {
    data: formData,
    headers,
  };
};

export const DataProvider = baseURL => ({
  getList: async (resource, params) => {
    const response = await axios.get(getRouteURL(baseURL, resource), {
      params,
    });
    return response.data;
  },
  getOne: async (resource, params) => {
    const { id } = params;
    const response = await axios.get(`${getRouteURL(baseURL, resource)}/${id}`);
    return response.data;
  },
  getMany: async (resource, params) => {
    const response = await axios.get(getRouteURL(baseURL, resource), { params });
    return response.data;
  },
  // eslint-disable-next-line no-unused-vars
  getManyReference: async (resource, params) => {
    console.error('getManyReference');
  },
  create: async (resource, params) => {
    const { data, headers } = processData(params);
    const response = await axios.post(getRouteURL(baseURL, resource), data, { headers });
    return response;
  },
  update: async (resource, params) => {
    const { id } = params;
    const { data, headers } = processData(params);

    const response = await axios.put(`${getRouteURL(baseURL, resource)}/${id}`, data, {
      headers,
    });
    return response.data;
  },
  updateMany: async (resource, params) => {
    const response = await axios.put(getRouteURL(baseURL, resource), {
      ...params,
      author: { name: 'name', email: 'email' },
    });
    return response.data;
  },
  delete: async (resource, params) => {
    const { id } = params;
    const response = await axios.delete(`${getRouteURL(baseURL, resource)}/${id}`);
    return response.data;
  },
  deleteMany: async (resource, params) => {
    const { ids } = params;
    const response = await axios.delete(getRouteURL(baseURL, resource), {
      data: ids,
    });
    return response.data;
  },
});
