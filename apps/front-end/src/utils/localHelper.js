import { geolocationRegistryService, getOptions } from "@shiksha/common-lib";

/**
 * Get districts based on the state and set the newSchema for the district select box
 * @param {Object} param0 - options
 * @param {string} param0.state - state code
 * @param {string} param0.gramp - gram panchayat name
 * @param {string} param0.district - district name
 * @param {string} param0.block - block name
 * @param {Object} param0.schemaData - newSchema data
 * @returns {Object} - updated newSchema data
 */
export const setDistrict = async ({
  state,
  gramp,
  district,
  block,
  schemaData,
  setSchema,
}) => {
  let newSchema = schemaData;
  const hasDistrict = newSchema?.properties?.district;
  const hasBlock = newSchema?.properties?.block;
  const hasVillage = newSchema?.properties?.village;

  if (state && hasDistrict) {
    const qData = await geolocationRegistryService.getDistricts({
      name: state,
    });
    newSchema = getOptions(newSchema, {
      key: "district",
      arr: qData?.districts,
      title: "district_name",
      value: "district_name",
    });
  }

  if (hasBlock) {
    newSchema = await setBlock({
      state,
      gramp,
      district,
      block,
      schemaData: newSchema,
    });
  }

  if (!state || !hasDistrict) {
    newSchema = getOptions(newSchema, { key: "district", arr: [] });
    if (hasBlock) {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
    }
    if (hasVillage) {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
    }
  }

  if (typeof setSchema === "function") {
    setSchema(newSchema);
  } else {
    return newSchema;
  }
};

/**
 * Get blocks based on the district and state and set the newSchema for the block select box
 * @param {Object} param0 - options
 * @param {string} param0.state - state code
 * @param {string} param0.district - district name
 * @param {string} param0.block - block name
 * @param {string} param0.gramp - gram panchayat name
 * @param {Object} param0.schemaData - newSchema data
 * @returns {Object} - updated newSchema data
 */
export const setBlock = async ({
  state,
  district,
  block,
  gramp,
  schemaData,
  setSchema,
}) => {
  let newSchema = schemaData;

  const hasBlock = newSchema?.properties?.block;
  const hasVillage = newSchema?.properties?.village;

  if (district && hasBlock) {
    const qData = await geolocationRegistryService.getBlocks({
      state,
      name: district,
    });
    newSchema = getOptions(newSchema, {
      key: "block",
      arr: qData?.blocks,
      title: "block_name",
      value: "block_name",
    });
  }

  if (hasVillage) {
    newSchema = await setVillage({
      block,
      state,
      district,
      gramp: gramp || "null",
      schemaData: newSchema,
    });
    if (typeof setSchema === "function") {
      setSchema(newSchema);
    } else {
      return newSchema;
    }
  }

  if (!district || !hasBlock) {
    newSchema = getOptions(newSchema, { key: "block", arr: [] });
    if (hasVillage) {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
    }
    if (typeof setSchema === "function") {
      setSchema(newSchema);
    } else {
      return newSchema;
    }
  }
  return newSchema;
};

/**
 * Set the newSchema for the village select box
 * @param {Object} options - options
 * @param {string} options.state - state code
 * @param {string} options.district - district name
 * @param {string} options.block - block name
 * @param {string} options.gramp - gram panchayat name
 * @param {Object} options.schemaData - newSchema data
 * @returns {Object} - updated newSchema data
 */
export const setVillage = async ({
  state,
  district,
  block,
  gramp,
  schemaData,
  setSchema,
}) => {
  let newSchema = schemaData;
  if (newSchema?.properties?.village && block) {
    // get villages based on the block and district and state
    const qData = await geolocationRegistryService.getVillages({
      name: block,
      state: state,
      district: district,
      gramp: gramp || "null",
    });
    if (newSchema?.["properties"]?.["village"]) {
      // set village options
      newSchema = getOptions(newSchema, {
        key: "village",
        arr: qData?.villages,
        title: "village_ward_name",
        value: "village_ward_name",
      });
    }
    // set the newSchema
    if (typeof setSchema === "function") {
      setSchema(newSchema);
    } else {
      return newSchema;
    }
  } else {
    // if village is not a form field or block is not given, then reset village options
    newSchema = getOptions(newSchema, { key: "village", arr: [] });
    // set the newSchema
    if (typeof setSchema === "function") {
      setSchema(newSchema);
    } else {
      return newSchema;
    }
  }
  return newSchema;
};
