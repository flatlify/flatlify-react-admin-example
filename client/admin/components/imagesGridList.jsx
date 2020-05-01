import React from 'react';
import GridListTile from '@material-ui/core/GridListTile';
import MuiGridList from '@material-ui/core/GridList';
import { makeStyles } from '@material-ui/core';
import { useWidth } from '../hooks';

const CELL_HEIGHT = 200;

const useStyles = makeStyles(theme => ({
  root: {
    padding: 4,
  },
  gridList: {
    width: '100%',
    margin: '0px !important',
  },
  placeholder: {
    backgroundColor: theme.palette.grey[300],
    height: '100%',
  },
  imageWrapper: {
    borderWidth: '2px',
  },
  imageActive: {
    borderStyle: 'dashed',
    borderColor: 'black',
  },
}));

/**
 * @param {Object} props
 * @param {Object[]} props.images
 * @param {string} props.images.src
 * @param {string} props.images.id
 * @param {Set<string>} props.selectedImages
 * @param {function(Set<string>):void} props.setSelectedImages
 * @param {number} props.columns
 * @param {function(string):any} [props.onSelect]
 * @param {boolean} [props.multiple]
 */
export const ImagesGridList = props => {
  const {
    images,
    selectedImages, // Probably Set is not the best solution, especially for single image select
    setSelectedImages,
    onSelect = () => {},
    multiple = true,
    columns,
  } = props;
  const classes = useStyles();

  const newSet = new Set(selectedImages.values());

  const handleImageClick = imageId => {
    if (newSet.has(imageId)) {
      newSet.delete(imageId);
    } else if (multiple) {
      newSet.add(imageId);
    } else if (!multiple && newSet.size === 0) {
      newSet.add(imageId);
    } else {
      newSet.clear();
      newSet.add(imageId);
    }
    setSelectedImages(newSet);
    onSelect(imageId);
  };

  const isImageSelected = id => selectedImages.has(id);

  return (
    <MuiGridList
      cellHeight={200}
      cols={columns}
      className={classes.gridList}
      spacing={6}
    >
      {images.map(image => {
        return (
          <GridListTile
            key={`${image.id}`}
            onClick={() => handleImageClick(image.id)}
            className={`${classes.imageWrapper} ${
              isImageSelected(image.id) ? classes.imageActive : null
            }`}
          >
            <img src={image.src} alt="" />
          </GridListTile>
        );
      })}
    </MuiGridList>
  );
};

const times = (nbChildren, fn) =>
  Array.from({ length: nbChildren }, (_, key) => fn(key));

export const getColsForWidth = width => {
  if (width === 'xs') return 2;
  if (width === 'sm') return 3;
  if (width === 'md') return 4;
  if (width === 'lg') return 5;
  return 6;
};

export const LoadingGridList = ({ nbItems = 10 }) => {
  const width = useWidth();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MuiGridList
        cellHeight={CELL_HEIGHT}
        cols={getColsForWidth(width)}
        className={classes.gridList}
      >
        {times(nbItems, key => (
          <GridListTile key={key}>
            <div className={classes.placeholder} />
          </GridListTile>
        ))}
      </MuiGridList>
    </div>
  );
};
