import BookIcon from '@material-ui/icons/Book';
import ExplicitIcon from '@material-ui/icons/Explicit';
import AttachmentIcon from '@material-ui/icons/Attachment';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import PhoneIcon from '@material-ui/icons/Phone';
import TvIcon from '@material-ui/icons/Tv';
import AirplayIcon from '@material-ui/icons/Airplay';

export const getIconFromName = name => {
  switch (name) {
    case 'AirplayIcon':
      return AirplayIcon;
    case 'ExplicitIcon':
      return ExplicitIcon;
    case 'AttachmentIcon':
      return AttachmentIcon;
    case 'TextFieldsIcon':
      return TextFieldsIcon;
    case 'PhoneIcon':
      return PhoneIcon;
    case 'TvIcon':
      return TvIcon;
    default:
      return BookIcon;
  }
};
