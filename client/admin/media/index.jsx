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

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { API_URL } from '../constants';
import { ImagesGridList, LoadingGridList } from '../components/imagesGridList';
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
    borderWidth: '2px',
  },
  imageActive: {
    borderStyle: 'dashed',
    borderColor: 'black',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const LoadedGridList = props => {
  const classes = useStyles();
  const fileInputRef = useRef(null);
  const [mutate] = useMutation();
  const notify = useNotify();
  const [selectedImages, setSelectedImages] = useState(new Set());

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

  const width = useWidth();
  const getColsForWidth = width => {
    if (width === 'xs') return 2;
    if (width === 'sm') return 3;
    if (width === 'md') return 4;
    if (width === 'lg') return 5;
    return 6;
  };
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
      <ImagesGridList
        images={images}
        setSelectedImages={setSelectedImages}
        selectedImages={selectedImages}
        columns={getColsForWidth(width)}
      />
    </div>
  );
};

const GridList = ({ loaded, ...props }) => {
  return loaded ? (
    <LoadedGridList {...props} />
  ) : (
    <LoadingGridList {...props} />
  );
};

const Media = props => {
  return (
    <List {...props} sort={{ field: 'id', order: 'ASC' }}>
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
