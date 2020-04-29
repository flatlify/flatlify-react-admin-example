import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import {
  List,
  useListController,
  useMutation,
  useDeleteMany,
  CRUD_DELETE_MANY,
  useNotify,
} from 'react-admin';
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { API_URL } from '../constants';
import { useWidth } from '../hooks';

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
  uploadBtn: {
    color: '#3f51b5',
    fontSize: '0.8125rem',
  },
  imageWrapper: {
    borderWidth: `2px`,
  },
  imageActive: {
    borderStyle: `dashed`,
    borderColor: `black`,
  },
  controls: {
    display: `flex`,
    justifyContent: `space-between`,
  },
}));

const getColsForWidth = width => {
  if (width === 'xs') return 2;
  if (width === 'sm') return 3;
  if (width === 'md') return 4;
  if (width === 'lg') return 5;
  return 6;
};

const times = (nbChildren, fn) => Array.from({ length: nbChildren }, (_, key) => fn(key));

const CELL_HEIGHT = 200;

const LoadingGridList = ({ nbItems = 10 }) => {
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

const LoadedGridList = props => {
  const classes = useStyles();
  const width = useWidth();
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [mutate] = useMutation();
  const notify = useNotify();

  const imagesInObject = useListController(props).data;
  const imagesArray = Object.values(imagesInObject);
  const images = imagesArray.map(image => ({
    ...image,
    src: `${API_URL}${image.relativeSrc}`,
  }));

  const [deleteQuery] = useDeleteMany('media', [...selectedImages.values()], {
    action: CRUD_DELETE_MANY,
    onSuccess: () => {
      notify('Deleted', 'info', {}, true);
    },
    undoable: true,
  });

  const handleFileUpload = event => {
    const [file] = event.target.files;
    mutate(uploadFile(file));
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFilesDelete = () => {
    deleteQuery();
    setSelectedImages(new Set());
  };

  const handleImageClick = filename => {
    if (selectedImages.has(filename)) {
      selectedImages.delete(filename);
    } else {
      selectedImages.add(filename);
    }
    setSelectedImages(new Set(selectedImages.values()));
  };

  const active = id => selectedImages.has(id);

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <Button className={classes.uploadBtn} onClick={handleClick}>
          <AddIcon />
          Upload
        </Button>
        <Button className={classes.uploadBtn} onClick={handleFilesDelete}>
          <DeleteForeverIcon />
          Delete
        </Button>
      </div>
      <input
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <MuiGridList
        cellHeight={200}
        cols={getColsForWidth(width)}
        className={classes.gridList}
        spacing={6}
      >
        {images.map(image => {
          return (
            <GridListTile
              key={`${image.id}`}
              onClick={() => handleImageClick(image.id)}
              className={`${classes.imageWrapper} ${active(image.id) ? classes.imageActive : null}`}
            >
              <img src={image.src} alt="" className={classes.img} />
            </GridListTile>
          );
        })}
      </MuiGridList>
    </div>
  );
};

const GridList = ({ loaded, ...props }) => {
  return loaded ? <LoadedGridList {...props} /> : <LoadingGridList {...props} />;
};

const Media = props => {
  const classes = useStyles();

  return (
    <List className={classes.list} {...props} sort={{ field: 'id', order: 'ASC' }}>
      <GridList />
    </List>
  );
};

const uploadFile = file => ({
  type: 'create',
  resource: 'media',
  payload: { data: { file } },
});

export default {
  list: Media,
};
