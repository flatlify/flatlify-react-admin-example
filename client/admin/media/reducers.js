import {
  OPEN_MEDIA,
  CHANGE_SELECTION,
  CLOSE_MEDIA,
  SET_MULTIPLE,
} from './actions';

const defaultState = {
  isOpen: false,
  multiple: false,
  selectedIds: {},
  doneButton: false,
};

export const mediaReducer = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case OPEN_MEDIA: {
      const mediaProps = payload;
      return {
        ...state,
        isOpen: true,
        ...mediaProps,
      };
    }
    case CLOSE_MEDIA:
      return {
        ...state,
        isOpen: false,
      };
    case SET_MULTIPLE:
      return {
        ...state,
        multiple: payload,
      };
    case CHANGE_SELECTION: {
      const imageId = payload;
      const { multiple } = state;
      let newSelectedIds = { ...state.selectedIds };

      if (newSelectedIds[imageId]) {
        delete newSelectedIds[imageId];
      } else if (multiple) {
        newSelectedIds[imageId] = imageId;
      } else {
        newSelectedIds = { [imageId]: imageId };
      }
      return {
        ...state,
        selectedIds: newSelectedIds,
      };
    }
    default:
      return state;
  }
};
