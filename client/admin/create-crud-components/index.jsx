import React from 'react';
import {
  SingleFieldList,
  ChipField,
  ReferenceField,
  ReferenceArrayField,
  Create,
  Edit,
  required,
  SimpleForm,
  TextInput,
} from 'react-admin';
import S from 'string';
import { Datagrid, List, TextField, EditButton } from 'ra-ui-materialui';
import RichTextInput from 'ra-input-rich-text';
import { useSelector } from 'react-redux';
import { MediaInput } from '../components/MediaInput';
import {
  _ReferenceInput,
  _ReferenceArrayInput,
} from '../components/ReferenceInput';
import { contentTypesSelector } from '../react-admin/selectors';
import { camelize } from '../../utils/string';

const getFieldComponent = type => {
  switch (type) {
    case 'RichTextInput':
      return RichTextInput;
    case 'TextInput':
      return TextInput;
    case 'MediaInput':
      return MediaInput;
    case 'ReferenceInput':
      return _ReferenceInput;
    case 'ReferenceArrayInput':
      return _ReferenceArrayInput;
    default:
      return <></>;
  }
};

const createCRUDComponents = contentTypeSettings => {
  const ContentTypeTitle = () => {
    return <span>{S(contentTypeSettings.type).titleCase().s}</span>;
  };
  const Fields = props => {
    const { record } = props;
    return (
      <>
        {contentTypeSettings.fields.map(
          ({ isRequired, title, fieldType, _gridDisplay_, ...fieldConfig }) => {
            const FieldComponent = getFieldComponent(fieldType);
            return (
              <div key={`${fieldType} ${title}`}>
                <FieldComponent
                  label={title}
                  source={camelize(title)}
                  validate={isRequired ? required() : undefined}
                  record={record}
                  {...fieldConfig}
                />
              </div>
            );
          },
        )}
      </>
    );
  };

  const ContentTypeCreate = props => (
    <Create title="Create a ContentType" {...props}>
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Create>
  );

  const ContentTypeEdit = props => {
    return (
      <Edit title={<ContentTypeTitle />} {...props}>
        <SimpleForm>
          <TextInput disabled source="id" />
          <Fields />
        </SimpleForm>
      </Edit>
    );
  };

  const GenericTypeList = props => {
    const contentTypes = useSelector(contentTypesSelector);
    return (
      <List {...props}>
        <Datagrid>
          <TextField source="id" />
          {contentTypeSettings.fields
            .filter(fieldConfig => !!fieldConfig._gridDisplay_)
            .map(fieldConfig => {
              const Field = getField(fieldConfig, contentTypes);

              return Field;
            })}
          <EditButton />
        </Datagrid>
      </List>
    );
  };

  function getField(fieldConfig, contentTypes) {
    const source = camelize(fieldConfig.title);

    switch (fieldConfig.fieldType) {
      case 'ReferenceInput': {
        const type = getType(contentTypes, fieldConfig.refTypeId);

        return (
          <ReferenceField
            label={fieldConfig.displayValue}
            source={source}
            reference={type}
            key={`${type} ${source}`}
          >
            <TextField source={camelize(fieldConfig.displayValue)} />
          </ReferenceField>
        );
      }
      case 'ReferenceArrayInput': {
        const type = getType(contentTypes, fieldConfig.refTypeId);

        return (
          <ReferenceArrayField
            label={fieldConfig.displayValue}
            source={source}
            reference={type}
            key={`${type} ${source}`}
          >
            <SingleFieldList>
              <ChipField source={camelize(fieldConfig.displayValue)} />
            </SingleFieldList>
          </ReferenceArrayField>
        );
      }
      default:
        return <TextField key={`${source}`} source={source} />;
    }
  }

  function getType(contentTypes, searchTypeId) {
    const contentType = contentTypes.find(
      contentType => contentType.id === searchTypeId,
    );
    const type = contentType.type.toLowerCase();
    return type;
  }

  return {
    list: GenericTypeList,
    create: ContentTypeCreate,
    edit: ContentTypeEdit,
    show: ContentTypeEdit,
    icon: contentTypeSettings.icon,
  };
};

export default createCRUDComponents;
