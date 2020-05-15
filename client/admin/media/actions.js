export const OPEN_MEDIA = 'OPEN MODAL';
export const CLOSE_MEDIA = 'CLOSE MODAL';
export const CHANGE_SELECTION = 'CHANGE_SELECTION';
export const SET_MULTIPLE = 'SET_MULTIPLE';

export const openMedia = params => ({
  type: OPEN_MEDIA,
  payload: params,
});

export const closeMedia = () => ({
  type: CLOSE_MEDIA,
  payload: {
    isOpen: false,
  },
});

export const selectImage = selectedId => ({
  type: CHANGE_SELECTION,
  payload: selectedId,
});

export const setMultiple = multiple => ({
  type: SET_MULTIPLE,
  payload: multiple,
});
