import { createSelector } from 'reselect';

export const getMedia = state => state.media;

export const isMediaOpen = createSelector([getMedia], media => media.isOpen);

export const getMediaSelectedIds = createSelector(
  [getMedia],
  media => media.selectedIds,
);
