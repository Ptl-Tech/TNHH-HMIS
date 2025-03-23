import { notification } from "antd";
import { getVisitorById } from "../actions/visitorsActions";

export const checkVisitorStatus = async (idNumber, dispatch, setIsCheckedIn, setVisitorData) => {
  if (!idNumber) return;

  try {
    // Fetch visitor by ID number
    const response = await dispatch(getVisitorById(idNumber));
    if (!response) throw new Error("Visitor not found.");
    const visitor = response;
    
    // Determine if visitor is checked in
    const isCheckedIn = visitor?.Status !== "Cleared";
    setIsCheckedIn(isCheckedIn);

    if (isCheckedIn) {
      // Show warning only when the visitor is still checked in
      notification.warning({
        message: "Warning",
        description: `Visitor is already checked in with ID: ${visitor?.No}. Please check out first.`,
        duration: 5,
        mask: true,
      });
    } else {
      // Set visitor data only when they are not checked in
      setVisitorData(visitor);

      // Show success notification only when the visitor is found and not checked in
      notification.success({
        message: "Success",
        description: `Visitor found with ID: ${visitor?.IDNumber}.`,
        duration: 5,
        mask: true,
      });
    }

    return visitor;
  } catch (error) {
    setIsCheckedIn(false);
    setVisitorData(null);
    return null;
  }
};
