export const theme = {
  token: {
    colorIcon: "#FAFAFA",
    colorPrimary: "#ED9D47",
    colorPrimaryBg: "#ED9D47",
  },
  components: {
    Menu: {
      itemColor: "#ffffff", // Updated to white
      itemSelectedBg: "#ac8342",
      itemHoverColor: "#ffffff", // Keeps hover text white
      itemSelectedColor: "#ffffff", // Keeps the selected item text white
      itemHoverBg: "rgba(172, 131, 66, 0.6)",
    },
    Table: {
      headerBg: "#b96000",
      headerColor: "#FAFAFA",
      rowHoverBg: "transparent", // No hover effect
      headerCellBg: "#b96000",
      rowHoverColor: "#b96000", // Keeps hover text white
      rowSelectedBg: "#ac8342",
      headerCellHoverBg: "#ac8342",
      headerCellHoverColor: "#ffffff",
      headerCellHoverBorder: "#ac8342",
    },
  },
};
