import React, { useState, useEffect } from 'react';
import {
  AdminContext,
  AdminUI,
  Resource,
  useQueryWithStore,
} from 'react-admin';
import { useSelector } from 'react-redux';
import { contentTypesSelector } from './react-admin/selectors';
import { DataProvider } from './dataProvider';
import contentTypesActions from './content-types';
import mediaActions from './media';
import siteSettingsActions from './site-settings';
import createCrudComponents from './create-crud-components';
import { API_URL } from './constants';
import { mediaReducer } from './media/reducers';
import { getIconFromName } from './utils/contentTypeIcons';

const dataProvider = DataProvider(API_URL);

const App = () => (
  <AdminContext
    customReducers={{ media: mediaReducer }}
    dataProvider={dataProvider}
  >
    <Resources />
  </AdminContext>
);
const reservedTypes = ['content-types', 'site-settings', 'media'];

function Resources() {
  /**
   * Prefetch content-types to set dynamic resources
   */
  useQueryWithStore({
    type: 'getList',
    resource: 'content-types',
    pagination: { page: 0, perPage: 100 },
  });
  useQueryWithStore({
    type: 'getList',
    resource: 'settings',
    pagination: { page: 0, perPage: 100 },
  });

  const contentTypes = useSelector(contentTypesSelector);
  const [resources, setResources] = useState([]);
  const contentTypesString = JSON.stringify(contentTypes);

  useEffect(() => {
    const newResources = [...resources];
    contentTypes.forEach(contentType => {
      if (!reservedTypes.includes(contentType.type)) {
        newResources.push(
          <Resource
            key={`type-${contentType.type}`}
            name={`${String(contentType.type).toLowerCase()}`}
            {...createCrudComponents(contentType)}
            icon={getIconFromName(contentType.icon)}
          />,
        );
      }
    });
    setResources(newResources);
    // do not add contentTypes in dependencies,
    // it causes infinite rerenders if reference input is on the page
  }, [contentTypesString]);

  return (
    <AdminUI>
      {[
        <Resource
          key="content-types"
          name="content-types"
          {...contentTypesActions}
        />,
        <Resource key="settings" name="settings" {...siteSettingsActions} />,
        ...resources,
        <Resource key="media" name="media" {...mediaActions} />,
      ]}
    </AdminUI>
  );
}

export default App;

/**
 * temporary disable translaton errors
 * TODO: fix translation errors
 */
const originalLog = console.error;
console.error = function log(...args) {
  if (
    args.length > 0 &&
    typeof args[0] === 'string' &&
    /^Warning: Missing translation/.test(args[0])
  ) {
    return;
  }
  originalLog.apply(console, args);
};
