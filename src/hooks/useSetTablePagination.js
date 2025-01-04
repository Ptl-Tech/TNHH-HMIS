import { useState, useEffect } from "react";

const useSetTablePagination = (pageSize) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: pageSize?.length || 0, // Use consumables length as total
  });

  // Update total whenever consumables change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: pageSize?.length || 0,
    }));
  }, [pageSize]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };

  return { pagination, setPagination, handleTableChange };
};

export default useSetTablePagination;
