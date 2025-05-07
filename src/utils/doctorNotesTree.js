export function buildFormStructure(sections, sectionCategories, formItems) {
  const sectionMap = new Map();
  sections.forEach((section) => sectionMap.set(section.Section_ID, section));

  const categoryMap = new Map();
  sectionCategories.forEach((category) => {
    const section = sectionMap.get(category.Section_ID);
    if (!categoryMap.has(category.Section_ID)) {
      categoryMap.set(category.Section_ID, []);
    }
    categoryMap.get(category.Section_ID)?.push(category);
  });

  const formItemMap = new Map();
  formItems.forEach((item) => {
    if (!formItemMap.has(item.Category_ID)) {
      formItemMap.set(item.Category_ID, []);
    }
    formItemMap.get(item.Category_ID)?.push(item);
  });

  const buildCategoryTree = (parentCategoryId) => {
    const children = sectionCategories.filter(
      (cat) => cat.Parent_Category_ID === parentCategoryId,
    );
    return children.map((category) => ({
      ...category,
      formItems: formItemMap.get(category.Category_ID) || [],
      subCategories: buildCategoryTree(category.Category_ID),
    }));
  };

  return sections.map((section) => ({
    ...section,
    categories: (categoryMap.get(section.Section_ID) || [])
      .filter((category) => !category.Parent_Category_ID)
      .map((category) => ({
        ...category,
        formItems: formItemMap.get(category.Category_ID) || [],
        subCategories: buildCategoryTree(category.Category_ID),
      })),
  }));
}

export function buildSelectedItemsTree(sections, sectionCategories, formItems) {
  // loop through the formItems with the selected value
  const newFormItems = formItems.filter(({ IsSelected }) => IsSelected);
  var newSectionCategoriesIds = new Set();
  var newSectionIds = new Set();

  newFormItems.forEach(({ Category_ID }) => {
    // add the sectionCategoy of the current formItem
    newSectionCategoriesIds.add(Category_ID);
    // if that category has a parent category add it

    function addSectionCategories(Category_ID) {
      const parentCategory = sectionCategories.find(
        (sectionCategory) => sectionCategory.Category_ID === Category_ID,
      );

      if (!parentCategory.Parent_Category_ID) {
        return newSectionIds.add(parentCategory.Section_ID);
      } else {
        newSectionCategoriesIds.add(parentCategory.Parent_Category_ID);
        return addSectionCategories(parentCategory.Parent_Category_ID);
      }
    }

    addSectionCategories(Category_ID);
  });

  const newSectionCategories = sectionCategories.filter((sectionCategory) =>
    newSectionCategoriesIds.has(sectionCategory.Category_ID),
  );
  const newSections = sections.filter((section) =>
    newSectionIds.has(section.Section_ID),
  );

  return buildFormStructure(newSections, newSectionCategories, newFormItems);
}
