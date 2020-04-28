/* eslint-disable no-restricted-syntax */
const axios = require('axios').default;

const getRouteURL = (baseURL, resource) => {
  switch (resource) {
    case 'content-types':
      return `${baseURL}/content-types/content-types`;
    default:
      return `${baseURL}/content/${resource}`;
  }
};

const getFileFields = params => {
  const fileFields = {};
  for (const fieldName in params.data) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.data.hasOwnProperty(fieldName)) {
      if (Array.isArray(params.data[fieldName])) {
        params.data[fieldName].forEach(fieldEntry => {
          if (fieldEntry instanceof File) {
            fileFields[fieldName] = [fieldEntry, ...(fileFields[fieldName] || [])];
          }
        });
      } else if (params.data[fieldName] instanceof File) {
        fileFields[fieldName] = params.data[fieldName];
      }
    }
  }

  return fileFields;
};

const processData = params => {
  const fileFields = getFileFields(params);
  const headers = {};
  let { data } = params;
  /**
   * Convert body to multipart/form-data if there is any file field
   * @see https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios
   */
  if (Object.keys(fileFields).length) {
    const formData = new FormData();
    for (const fieldName in data) {
      if (fileFields[fieldName]) {
        if (Array.isArray(fileFields[fieldName])) {
          fileFields[fieldName].forEach(file => {
            formData.append(`${fieldName}`, file);
          });
        } else {
          formData.append(fieldName, fileFields[fieldName]);
        }
      } else {
        formData.append(fieldName, data[fieldName]);
      }
    }
    data = formData;
    headers['Content-Type'] = `multipart/form-data; boundary=${data.boundary}`;
  }

  return {
    data,
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
    const response = await axios.delete(getRouteURL(baseURL, resource), { data: ids });
    return response.data;
  },
});
