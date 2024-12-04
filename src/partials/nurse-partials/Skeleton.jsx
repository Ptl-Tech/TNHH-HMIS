
import { Skeleton } from 'antd';
const SkeletonLoading = () => (
  <Skeleton
    avatar
    paragraph={{
      rows: 2,
    }}
    active
  />
);
export default SkeletonLoading;