import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import {
  List,
  useListController,
  useMutation,
  useDeleteMany,
  CRUD_DELETE_MANY,
  useNotify,
} from 'react-admin';
import { makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSelector, useDispatch } from 'react-redux';
import DoneIcon from '@material-ui/icons/Done';
import { API_URL } from '../constants';
import { ImagesGridList } from '../components/ImagesGridList';
import { useWidth } from '../hooks';
import { getMedia, getMediaSelectedIds } from './selectors';
import { closeMedia, setMultiple } from './actions';

const useStyles = makeStyles(() => ({
  root: {
    padding: 4,
  },
  uploadBtn: {
    color: '#3f51b5',
    fontSize: '0.8125rem',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  listWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    background: '#fafafa',
    height: '100%',
  },
}));

const LoadedGridList = props => {
  const classes = useStyles();
  const fileInputRef = useRef(null);
  const [mutate] = useMutation();
  const notify = useNotify();

  const media = useSelector(getMedia);
  const selectedImageIds = useSelector(getMediaSelectedIds);

  const { ids: currentPageImageIds } = props;
  const imagesInObject = useListController(props).data;
  const imagesArray = Object.values(imagesInObject);
  const images = imagesArray
    .filter(image => currentPageImageIds.includes(image.id))
    .map(image => ({
      ...image,
      src: `${API_URL}${image.relativeSrc}`,
    }));

  const [deleteQuery] = useDeleteMany(
    'media',
    Object.values(selectedImageIds),
    {
      action: CRUD_DELETE_MANY,
      onSuccess: () => {
        notify('Deleted', 'info', {}, true);
      },
      undoable: true,
    },
  );

  const handleFileUpload = event => {
    const files = Object.values(event.target.files);
    files.forEach(file => mutate(uploadFile(file)));
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFilesDelete = () => {
    deleteQuery();
  };

  const width = useWidth();
  const getColsForWidth = width => {
    if (width === 'xs') return 2;
    if (width === 'sm') return 3;
    if (width === 'md') return 4;
    if (width === 'lg') return 5;
    return 6;
  };

  const dispatch = useDispatch();
  const handleDone = () => dispatch(closeMedia());

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
        {media.doneButton ? (
          <Button className={classes.uploadBtn} onClick={handleDone}>
            <DoneIcon />
            Update
          </Button>
        ) : null}
      </div>
      <input
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
      />
      <ImagesGridList images={images} columns={getColsForWidth(width)} />
    </div>
  );
};

export const Media = () => {
  const classes = useStyles();
  return (
    <div className={classes.listWrapper}>
      <List
        basePath="/media"
        resource="media"
        hasShow={false}
        hasList
        hasEdit={false}
        hasCreate={false}
        sort={{ field: 'id', order: 'ASC' }}
      >
        <LoadedGridList />
      </List>
    </div>
  );
};

const uploadFile = file => ({
  type: 'create',
  resource: 'media',
  payload: { data: { file } },
});

const PlainMedia = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMultiple(true));
  }, []);
  return <Media />;
};

export default {
  list: PlainMedia,
};
