import React from 'react';
import { Skeleton } from 'antd';

const LoadingSkeleton = ({ loading, children, avatar = false, rows = 3 }) => {
  return loading ? (
    <Skeleton
      active
      avatar={avatar}
      paragraph={{ rows }}
    />
  ) : (
    children
  );
};

export default LoadingSkeleton;
