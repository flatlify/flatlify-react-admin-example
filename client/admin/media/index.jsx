import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import { List, useListController, useMutation } from 'react-admin';
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
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
  tileBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
  },
  placeholder: {
    backgroundColor: theme.palette.grey[300],
    height: '100%',
  },
  price: {
    display: 'inline',
    fontSize: '1em',
  },
  link: {
    color: '#fff',
  },
  uploadBtn: {
    color: '#3f51b5',
    fontSize: '0.8125rem',
  },
  imageSelected: {
    filter: `blur(1px)`,
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

  const imagesInObject = useListController(props).data;
  const fileInputRef = useRef(null);
  const imagesArray = Object.values(imagesInObject);
  const images = imagesArray.map(image => ({
    ...image,
    src: `${API_URL}${image.relativeSrc}`,
  }));

  // eslint-disable-next-line no-unused-vars
  const [mutate, { loading }] = useMutation();
  const handleFileUpload = event => {
    const [file] = event.target.files;
    return mutate({
      type: 'create',
      resource: 'media',
      payload: { data: { file } },
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={classes.root}>
      <Button className={classes.uploadBtn} onClick={handleClick}>
        <AddIcon />
        Upload
      </Button>
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
            <GridListTile key={`${image.src}`}>
              <img src={image.src} alt="" />
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

export default {
  list: Media,
};
