import dayjs from "dayjs";
import ChiromoLogo from "../../assets/images/ChiromoLogo.png";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    gap: 4,
    padding: 8,
    flexDirection: "column",
    backgroundColor: "#FFF",
  },
  row: {
    gap: 2,
    alignItems: "center",
    flexDirection: "row",
  },
  bigText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 8,
  },
  smallText: {
    fontSize: 6,
  },
  boldText: {
    fontWeight: "600",
  },
  image: {
    width: 70,
  },
  column: {
    gap: 2,
    flexDirection: "column",
  },
  borderBottom: {
    borderBottom: "0.5 dashed #efefef",
  },
});

function PharmacyLabel({ items }) {
  console.log({ items });

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
          <Page
            size={"A5"}
            wrap={false}
            style={styles.page}
            orientation="potrait"
          >
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
                  {`Take ${Dosage} ${
                    Frequency > 1 ? Frequency + " times" : "once"
                  } a day, for ${Duration_Days} day${
                    Duration_Days > 1 ? "s" : ""
                  }`}
                </Text>
              </View>
            </View>
            <View style={styles.borderBottom} />
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.mediumText}>Name:</Text>
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
                  {dayjs(new Date()).format("ddd MM YYYY H:mm A")}
                </Text>
              </View>
            </View>
            <View style={styles.borderBottom} />
            <View style={styles.column}>
              <Text style={{ ...styles.smallText, ...styles.boldText }}>
                FOR QUALITY ASSURANCE, RETURNS/EXCHANGES WILL NOT BE ACCEPTED!
              </Text>
            </View>
          </Page>
        )
      )}
    </Document>
  );
}

export default PharmacyLabel;
