import dayjs from "dayjs";
import ChiromoLogo from "../../assets/images/ChiromoLogo.png";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 4,
    backgroundColor: "#FFF",
  },
  canvas: {
    gap: 4,
    flex: 1,
    height: 211,
    paddingTop: 10,
    flexDirection: "column",
  },
  row: {
    gap: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  bigText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 9,
  },
  smallText: {
    fontSize: 7,
  },
  boldText: {
    fontWeight: "600",
  },
  image: {
    width: 40,
  },
  column: {
    gap: 2,
    flexDirection: "column",
  },
  borderBottom: {
    borderBottom: "0.5 solid black",
  },
});

function PharmacyLabel({ items }) {
  const getFrequency = (frequency) =>
    frequency > 1 ? `${frequency} times` : "once";
  const getDays = (days) => (days === 1 ? "day" : "days");

  return (
    <Document>
      {items.map(
        ({
          DrugName,
          Quantity,
          Dosage,
          Frequency,
          Duration_Days,
          patientName,
          PatientNo,
        }) => (
          <Page size={[210, undefined]} wrap={false} style={styles.page}>
            <View style={styles.canvas}>
              <View style={styles.row}>
                <Image src={ChiromoLogo} style={styles.image} />
                <Text style={{ ...styles.bigText, ...styles.boldText }}>
                  CHIROMO HOSPITAL GROUP
                </Text>
              </View>
              <View style={styles.borderBottom} />
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.mediumText}>Name:</Text>
                  <Text style={{ ...styles.mediumText, ...styles.boldText }}>
                    {DrugName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.mediumText}>Qty:</Text>
                  <Text style={{ ...styles.mediumText, ...styles.boldText }}>
                    {Quantity}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.mediumText}>Dose:</Text>
                  <Text style={{ ...styles.mediumText, ...styles.boldText }}>
                    {`Take ${Dosage}, ${getFrequency(
                      Frequency
                    )} a day, for ${Duration_Days} ${getDays(Duration_Days)}`}
                  </Text>
                </View>
              </View>
              <View style={styles.borderBottom} />
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.mediumText}>Patient Name:</Text>
                  <Text style={{ ...styles.mediumText, ...styles.boldText }}>
                    {patientName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.mediumText}>Patient No:</Text>
                  <Text style={{ ...styles.mediumText, ...styles.boldText }}>
                    {PatientNo}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.mediumText}>Date:</Text>
                  <Text style={{ ...styles.mediumText, ...styles.boldText }}>
                    {dayjs(new Date()).format("ddd DD MMM YYYY h:mm A")}
                  </Text>
                </View>
              </View>
              <View style={styles.borderBottom} />
              <View style={styles.column}>
                <Text style={{ ...styles.smallText, ...styles.boldText }}>
                  FOR QUALITY ASSURANCE, RETURNS/EXCHANGES WILL NOT BE ACCEPTED!
                </Text>
              </View>
            </View>
          </Page>
        )
      )}
    </Document>
  );
}

export default PharmacyLabel;
