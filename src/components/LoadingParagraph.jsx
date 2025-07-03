import { Skeleton } from "antd";

const LoadingParagraph = ({
  rows = 1,
  style = {},
  width = 120,
  loading = true,
  children = <></>,
  className = "",
  avatar = false,
}) => {
  return (
    <Skeleton
      active
      style={{
        ...style,
      }}
      title={false}
      avatar={avatar}
      loading={loading}
      children={children}
      className={className}
      paragraph={{ rows, width }}
    />
  );
};

export default LoadingParagraph;
