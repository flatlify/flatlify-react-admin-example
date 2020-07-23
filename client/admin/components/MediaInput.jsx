import React, { useEffect, useState } from 'react';
import { useInput, useQueryWithStore, ReferenceInput } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { API_URL } from '../constants';
import { Media } from '../media';
import {
  closeMedia as closeMediaAction,
  openMedia as openMediaAction,
} from '../media/actions';
import { isMediaOpen, getMediaSelectedIds } from '../media/selectors';
import { mediaSelector } from '../react-admin/selectors';

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
    height: 150,
    width: 150,
    overflow: 'hidden',
    padding: 1,
  },
  upload: {
    border: 'solid 1px black',
    height: '99%',
    width: '99%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const MediaInput = props => {
  const { source, label, record } = props;
  const img = record[source];

  useQueryWithStore({
    type: 'getList',
    resource: 'media',
    pagination: { page: 0, perPage: 100 },
  });

  return (
    <ReferenceInput reference="media" source="id">
      <MediaInputContainer imgId={img} label={label} fieldName={source} />
    </ReferenceInput>
  );
};

const MediaInputContainer = props => {
  const { label, fieldName, multiple, imgId } = props;
  const imagesInfo = useSelector(mediaSelector);
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector(isMediaOpen);

  const openMedia = () => {
    dispatch(openMediaAction({ doneButton: true, multiple }));
  };

  const closeModalOnChangeRoute = () => dispatch(closeMediaAction());

  useEffect(() => {
    return closeModalOnChangeRoute;
  }, []);

  const {
    input: { onChange: updateReactAdminInputValue },
  } = useInput({ name: label, source: fieldName, id: 'media' });

  const imagesWithSrc = imagesInfo.map(image => ({
    ...image,
    src: `${API_URL}${image.relativeSrc}`,
  }));

  const selectedImageIds = useSelector(getMediaSelectedIds);
  const selectedImageId = Object.values(selectedImageIds)[0] || '';
  /**
   * if user opened media we should use last selected media Id instead of backend Id value
   */
  const [wasMediaOpened, setWasMediaOpened] = useState(false);
  useEffect(() => {
    if (open) {
      setWasMediaOpened(true);
    }
  }, [open]);
  const trueImgId = wasMediaOpened ? selectedImageId : imgId;

  const imageSrc = imagesWithSrc.find(image => image.id === trueImgId)?.src;

  /**
   * update image field on image selection
   */
  useEffect(() => {
    updateReactAdminInputValue(selectedImageId);
  }, [selectedImageId]);

  return (
    <>
      <button onClick={openMedia} type="button" className={classes.button}>
        <MediaInputImage alt={fieldName} imageSrc={imageSrc} />
      </button>
      {open ? <Media /> : null}
    </>
  );
};

const MediaInputImage = props => {
  const { imageSrc, alt } = props;
  const classes = useStyles();
  return imageSrc ? (
    <img className={classes.img} src={imageSrc} alt={alt} />
  ) : (
    <div className={classes.upload}>
      <AddIcon />
    </div>
  );
};
