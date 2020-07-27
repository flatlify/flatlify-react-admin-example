import { DeleteError, UpdateError } from './utils/errors';

/* eslint-disable no-restricted-syntax */
const axios = require('axios').default;

const getFileFields = params => {
  const fileFields = {};
  for (const fieldName in params.data) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.data.hasOwnProperty(fieldName)) {
      if (Array.isArray(params.data[fieldName])) {
        params.data[fieldName].forEach(fieldEntry => {
          if (fieldEntry instanceof File) {
            fileFields[fieldName] = [
              fieldEntry,
              ...(fileFields[fieldName] || []),
            ];
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
    const { data } = await axios.get(`${baseURL}/content/${resource}`, {
      params,
    });
    return { data, total: data.length };
  },
  getOne: async (resource, params) => {
    const { id } = params;
    const { data } = await axios.get(`${baseURL}/content/${resource}/${id}`);
    return { data };
  },
  getMany: async (resource, params) => {
    const { data } = await axios.get(`${baseURL}/content/${resource}`, {
      params,
    });
    return { data };
  },
  // eslint-disable-next-line no-unused-vars
  getManyReference: async (resource, params) => {
    console.error('getManyReference');
  },
  create: async (resource, params) => {
    const { data, headers } = processData(params);
    if (resource === 'content-types') {
      const { type } = params.data;
      await axios.post(`${baseURL}/content-type/${type}`);
    }
    const response = await axios.post(`${baseURL}/content/${resource}`, data, {
      headers,
    });
    return response;
  },
  update: async (resource, params) => {
    const { id } = params;
    const { data, headers } = processData(params);

    const response = await axios.put(
      `${baseURL}/content/${resource}/${id}`,
      data,
      {
        headers,
      },
    );
    return { data: response.data };
  },
  updateMany: async (resource, params) => {
    const { ids } = params;
    const { data, headers } = processData(params);

    const deletePromises = ids.map(async id => {
      try {
        await axios.put(`${baseURL}/content/${resource}/${id}`, data, {
          headers,
        });
        return id;
      } catch (e) {
        throw new UpdateError(id);
      }
    });
    const queries = await Promise.allSettled(deletePromises);
    const deletedIds = queries
      .filter(promise => promise.status === 'fulfilled')
      .map(promise => promise.value);

    return { data: deletedIds };
  },
  delete: async (resource, params) => {
    const {
      id,
      previousData: { type },
    } = params;
    await axios.delete(`${baseURL}/content/${resource}/${id}`);
    if (resource === 'content-types') {
      await axios.delete(`${baseURL}/content-type/${type}`);
    }
    return { data: { id } };
  },
  deleteMany: async (resource, params) => {
    const { ids } = params;

    const deletePromises = ids.map(async id => {
      try {
        const {
          data: { type },
        } = await axios.get(`${baseURL}/content/${resource}/${id}`);
        await axios.delete(`${baseURL}/content/${resource}/${id}`);
        if (resource === 'content-types') {
          await axios.delete(`${baseURL}/content-type/${type}`);
        }
        return id;
      } catch (e) {
        throw new DeleteError(id);
      }
    });
    const queries = await Promise.allSettled(deletePromises);
    const deletedIds = queries
      .filter(promise => promise.status === 'fulfilled')
      .map(promise => promise.value);

    return { data: deletedIds };
  },
});
