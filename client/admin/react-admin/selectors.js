export const contentTypesSelector = state =>
  Object.values(state.admin.resources['content-types']?.data || {});

export const mediaSelector = state =>
  Object.values(state.admin.resources.media?.data || {});
