
import { Skeleton } from 'antd';
const LoadingParagraphs = () => (
  <Skeleton
    paragraph={{
      rows: 4,
    }}
    active
  />
);
export default LoadingParagraphs;