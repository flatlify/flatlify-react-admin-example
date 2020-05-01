import React, { useState } from 'react';
import { useInput, useQueryWithStore, ReferenceInput } from 'react-admin';
import { Dialog, makeStyles } from '@material-ui/core';
import Img from 'react-image';
import CircularProgress from '@material-ui/core/CircularProgress';
import { API_URL } from '../constants';
import { ImagesGridList, getColsForWidth } from './imagesGridList';
import { useWidth } from '../hooks';

const useStyles = makeStyles(() => ({
  img: {
    height: '100%',
    left: '50%',
    position: 'relative',
    transform: 'translateX(-50%)',
  },
  button: {
    border: 'none',
    background: 'inherit',
    height: 200,
    width: 200,
    overflow: 'hidden',
  },
  dialogPaper: {
    minHeight: '100vh',
  },
}));

export const MediaInput = props => {
  const { source, label, record, multiple } = props;
  const img = record[source];

  useQueryWithStore({
    type: 'getList',
    resource: 'media',
    pagination: { page: 0, perPage: 100 },
  });

  return (
    <ReferenceInput reference="media" source="id">
      {multiple ? (
        <MediaMultipleSelectDialog
          imgIds={img}
          label={label}
          fieldName={source}
        />
      ) : (
        <MediaSelectDialog imgId={img} label={label} fieldName={source} />
      )}
    </ReferenceInput>
  );
};

const MediaSelectDialog = props => {
  const { choices: imagesInfo, label, imgId, fieldName } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set([imgId]));
  const {
    input: { onChange },
  } = useInput({ name: label, source: fieldName, id: 'media' });

  const images = imagesInfo.map(image => ({
    ...image,
    src: `${API_URL}${image.relativeSrc}`,
  }));

  const imageSrc = images.find(
    image => image.id === selectedImages.values().next().value,
  )?.src;

  const handleImageSelect = newImage => {
    onChange({ target: { value: newImage.values().next().value } });
    setSelectedImages(newImage);
  };
  const toggleDialog = () => setOpen(!open);
  const width = useWidth();
  return (
    <>
      <button onClick={toggleDialog} type="button" className={classes.button}>
        <Img
          src={[imageSrc, '/add_file.png']}
          alt={fieldName}
          className={classes.img}
          loader={<CircularProgress />}
        />
      </button>
      <Dialog
        aria-labelledby="dialog-title"
        open={open}
        disableEscapeKeyDown={false}
        onClose={() => toggleDialog()}
        fullWidth
        maxWidth={width}
        classes={{ paper: classes.dialogPaper }}
      >
        <ImagesGridList
          images={images}
          selectedImages={selectedImages}
          setSelectedImages={handleImageSelect}
          columns={getColsForWidth(width)}
          multiple={false}
        />
      </Dialog>
    </>
  );
};

const MediaMultipleSelectDialog = props => {
  const { choices: imagesInfo, label, imgIds, fieldName } = props;
  // We don't have migrations for now, so we need to
  // somehow handle `single to multiple` change
  const imgIdsIfMigratedToArray =
    typeof imgIds === 'string' ? [imgIds] : imgIds;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState(
    new Set(imgIdsIfMigratedToArray),
  );
  const {
    input: { onChange },
  } = useInput({ name: label, source: fieldName, id: 'media' });

  const images = imagesInfo.map(image => ({
    ...image,
    src: `${API_URL}${image.relativeSrc}`,
  }));

  const handleImageSelect = newImage => {
    onChange({ target: { value: [...newImage.values()] } });
    setSelectedImages(newImage);
  };
  const toggleDialog = () => setOpen(!open);

  const width = useWidth();

  return (
    <>
      {[...selectedImages.values()].map(imgId => {
        const imageSrc = images.find(image => image.id === imgId)?.src;
        return (
          <button
            onClick={toggleDialog}
            type="button"
            className={classes.button}
          >
            <Img
              src={[imageSrc, '/add_file.png']}
              alt={fieldName}
              className={classes.img}
              loader={<CircularProgress />}
            />
          </button>
        );
      })}
      <Dialog
        aria-labelledby="dialog-title"
        open={open}
        disableEscapeKeyDown={false}
        onClose={() => toggleDialog()}
        fullWidth
        maxWidth={width}
        classes={{ paper: classes.dialogPaper }}
      >
        <ImagesGridList
          images={images}
          selectedImages={selectedImages}
          setSelectedImages={handleImageSelect}
          columns={getColsForWidth(width)}
          multiple
        />
      </Dialog>
    </>
  );
};
