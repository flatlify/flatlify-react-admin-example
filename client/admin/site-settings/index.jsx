import React, { useEffect } from 'react';
import { Edit, required, SimpleForm, TextInput } from 'react-admin';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

const SiteSettings = props => {
  const siteSettings = useSelector(state => state.admin.resources.settings.data.settings);
  return (
    <>
      <Edit title="Site Settings" {...props}>
        <SimpleForm record={siteSettings}>
          <TextInput label={'URL'} source="url" validate={required()} />
          <TextInput label={'Site Name'} source="siteName" validate={required()} />
          <TextInput label={'Time Zone'} source="timeZone" validate={required()} />
        </SimpleForm>
      </Edit>
    </>
  );
};

const Redirect = () => {
  const dispatch = useDispatch();
  useEffect(() => dispatch(push('/settings/site')));
  return <div></div>;
};
export default {
  list: Redirect,
  edit: SiteSettings,
};
