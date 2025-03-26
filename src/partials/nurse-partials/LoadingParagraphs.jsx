
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';
const LoadingParagraphs = ( { paragraphs }) => (
  <Skeleton
    paragraph={{
      rows: paragraphs,
    }}
    active
  />
);
export default LoadingParagraphs;
//props validation
LoadingParagraphs.propTypes = {
  paragraphs: PropTypes.number,
};