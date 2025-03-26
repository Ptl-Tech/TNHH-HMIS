import { getpatientById } from "../actions/patientActions";

export const checkifPatientExists = async (idNumber, dispatch, setPatientExists, setVisitorData) => {
    if (!idNumber) return;

    try {
        // Fetch visitor by ID number
        const response = await dispatch(getpatientById(idNumber));
        if (!response) throw new Error("Patient not found.");
        const visitor = response;

        // Determine if visitor is checked in
        const patientExists = visitor?.Status !== "Converted to Patient";
        setPatientExists(patientExists);

        if (patientExists) {
            // Show warning only when the visitor is still checked in
            notification.warning({
                message: "Warning",
                description: `Patient is already converted with ID: ${visitor?.No}. Please check out first.`,
                duration: 5,
                mask: true,
            });
        }
    } catch (error) {
        console.error(error);
    }
};