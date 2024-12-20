import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export const getColorByWaitingTime = (observationDateTime) => {
    const currentTime = dayjs(); // Current date-time
    const observationTimeParsed = dayjs(observationDateTime); // Parse the observation date-time
    const waitingTimeMinutes = currentTime.diff(observationTimeParsed, 'minute'); // Calculate the difference in minutes
  
    if (waitingTimeMinutes <= 60) {
      return 'green';
    } else if (waitingTimeMinutes <= 120) {
      return 'orange';
    } else {
      return 'red';
    }
  };
  

export const formatElapsedTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} ago`;
    }
  };

  export const exportToExcel = (dataSource, tableName, fileName) => {
    const workSheet = XLSX.utils.json_to_sheet(dataSource);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, tableName);
    XLSX.writeFile(workBook, fileName);
  }

   // Print PDF
   export const printToPDF = (dataSource, tableTitle) => {
    const doc = new jsPDF();

    // Add a logo
  const logo = 'https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/27ed644d-f415-4f51-a5d8-e70aabc8ebac.png?w=128';
  const logoWidth = 30; // Adjust logo width
  const logoHeight = 30; // Adjust logo height
  const logoX = 10; // X position
  const logoY = 10; // Y position

  doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Add a title
  doc.text(tableTitle, 14, 10);

  // Adjusting the Y position of the table to avoid overlapping the logo
  const tableStartY = logoY + logoHeight + 10;
 

    // Add table dynamically from dataSource
    const tableColumn = ['Key', 'Adm No', 'Patient No', 'Patient Names', 'Adm Date', 'Ward', 'Bed', 'Doctor'];
    const tableRows = dataSource.map((row) => [row.key, row.admNo, row.patientNo, row.names, row.admDate, row.ward, row.bed, row.doctor]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY,
    });

    // Open the print dialog directly
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };