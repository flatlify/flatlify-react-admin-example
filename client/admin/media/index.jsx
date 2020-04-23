import React, { useState, useEffect } from 'react';
import Gallery from 'react-grid-gallery';
import { useListController, useQueryWithStore } from 'react-admin';
import { useRef } from 'react';
import { HOST } from '../App';

const MediaGallery = props => {
  const imagesInObject = useListController(props).data;
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const imagesRaw = Object.values(imagesInObject);
  const handleClick = event => {
    fileInputRef.current.click();
  };

  const images = imagesRaw.map(image => ({
    thumbnailWidth: 240,
    thumbnailHeight: 240,
    src: `${HOST}${image.relativeSrc}`,
    thumbnail: `${HOST}${image.relativeSrc}`,
  }));

  const handleFileUpload = event => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>hello world</button>
      <input
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      ></input>
      <Gallery images={images} margin={4} rowHeight={240} />,
      {/* tricky logic to conditionally call useQueryWithStore hook */}
      {file ? <MakeReactAdminQuery setFile={setFile} file={file}></MakeReactAdminQuery> : null}
    </div>
  );
};

const MakeReactAdminQuery = props => {
  const { file, setFile } = props;
  useQueryWithStore({
    type: 'create',
    resource: 'media',
    payload: { data: { files: [file] } },
  });
  //** tricky logic to conditionally call useQueryWithStore hook */
  useEffect(() => setFile(null), [setFile]);
  return <></>;
};

export default {
  list: MediaGallery,
};
