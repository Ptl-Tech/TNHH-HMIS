export function buildFormStructure(
  sections,
  sectionCategories,
  formItems,
  selectedItems
) {
  const categoryMap = new Map();
  sectionCategories.forEach((category) => {
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

    // We want to check if the current item is selected
    const selectedItem = selectedItems?.find(
      (currItem) => currItem.Item_ID === item.Item_ID
    );

    /*  
      If it's selected, we want to append the following properties
      IsSelected
      SystemId
      Is_Text_Item
      Other_Specify
    */
    const newItem = selectedItem ? selectedItem : item;

    formItemMap.get(item.Category_ID)?.push(newItem);
  });

  const buildCategoryTree = (parentCategoryId) => {
    const children = sectionCategories.filter(
      (cat) => cat.Parent_Category_ID === parentCategoryId
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
      // we want to add the parent category of the current category to the list
      const currentCategory = sectionCategories.find(
        (sectionCategory) => sectionCategory.Category_ID === Category_ID
      );

      // if it doesn't have a parent category we want to add the section it's a child of
      if (!currentCategory?.Parent_Category_ID) {
        return newSectionIds.add(currentCategory?.Section_ID);
      } else {
        // if we have a parent category, we add it to the list and then we call perfom the action again recursively
        newSectionCategoriesIds.add(currentCategory.Parent_Category_ID);
        return addSectionCategories(currentCategory.Parent_Category_ID);
      }
    }

    addSectionCategories(Category_ID);
  });

  const newSectionCategories = sectionCategories.filter((sectionCategory) =>
    newSectionCategoriesIds.has(sectionCategory.Category_ID)
  );
  const newSections = sections.filter((section) =>
    newSectionIds.has(section.Section_ID)
  );

  return buildFormStructure(newSections, newSectionCategories, newFormItems);
}

export function keywordFilterHelper(
  sections,
  sectionCategories,
  formItems,
  keyword
) {
  const filteredFormItems = new Set();
  const filteredSectionCategories = new Set();
  const filteredSections = new Set();
  // for memoization
  const visitedCategories = new Set();
  const visitedChildren = new Set();

  // we add the section to the filtered sections
  const addParentSection = (Section_ID) => filteredSections.add(Section_ID);

  function addParentCategory(Parent_Category_ID) {
    // implementing memoization
    if (visitedCategories.has(Parent_Category_ID)) return;
    visitedCategories.add(Parent_Category_ID);

    const currentCategory = sectionCategories.find(
      (sectionCategory) => sectionCategory.Category_ID === Parent_Category_ID
    );
    if (!currentCategory) return;

    // we add the category to the filteredSectionCategories.
    filteredSectionCategories.add(Parent_Category_ID);
    // if we don't have the parent category, then we add the section category
    if (currentCategory.Parent_Category_ID) {
      addParentCategory(currentCategory.Parent_Category_ID);
    } else {
      addParentSection(currentCategory.Section_ID);
    }
  }

  function addChildrenCategories(Parent_Category_ID) {
    if (visitedChildren.has(Parent_Category_ID)) return;
    visitedChildren.add(Parent_Category_ID);

    // we filter all the categories that have the parentCategoryId of the passed parentCategoryId.
    const filteredChildrenCategories = sectionCategories.filter(
      (category) => category.Parent_Category_ID === Parent_Category_ID
    );

    // we update the filteredSectionCategories set using the current matching section categories
    for (const filteredChildCategory of filteredChildrenCategories) {
      filteredSectionCategories.add(filteredChildCategory.Category_ID);
      addChildrenFormItems(filteredChildCategory.Category_ID);
      addChildrenCategories(filteredChildCategory.Category_ID);
    }
  }

  function addChildrenFormItems(Category_ID) {
    //  we filter all the formItems that have the categoryId of the passed parentCategoryId.
    const filteredChildrenFormItems = formItems.filter(
      (formItem) => formItem.Category_ID === Category_ID
    );

    // we update the filteredFormItems set using the current matching formItems
    for (const filteredChildrenFormItem of filteredChildrenFormItems) {
      filteredFormItems.add(filteredChildrenFormItem.Item_ID);
    }
  }

  for (const formItem of formItems) {
    // if a formItem matches the key, the, we add it to the array
    if (formItem.Item_Name.toLowerCase().includes(keyword.toLowerCase())) {
      filteredFormItems.add(formItem.Item_ID);
      // we now add all the categories upwards
      if (formItem.Category_ID) addParentCategory(formItem.Category_ID);
    }
  }

  for (const sectionCategory of sectionCategories) {
    // if a sectionCategory matches the key, then we add it to the array
    if (
      sectionCategory.Category_Name.toLowerCase().includes(
        keyword.toLowerCase()
      )
    ) {
      filteredSectionCategories.add(sectionCategory.Category_ID);
      // we now add the categories below and the formItems below them
      addChildrenCategories(sectionCategory.Category_ID);
      addChildrenFormItems(sectionCategory.Category_ID);
      // we now add all the categories upwards and if we don't have a parent category, we add the section category
      if (sectionCategory.Parent_Category_ID) {
        addParentCategory(sectionCategory.Parent_Category_ID);
      } else {
        addParentSection(sectionCategory.Section_ID);
      }
    }
  }

  console.log({ filteredFormItems });

  return {
    sections: sections.filter((section) =>
      filteredSections.has(section.Section_ID)
    ),
    sectionCategories: sectionCategories.filter((sectionCategory) =>
      filteredSectionCategories.has(sectionCategory.Category_ID)
    ),
    formItems: formItems.filter((formItem) =>
      filteredFormItems.has(formItem.Item_ID)
    ),
  };
}
