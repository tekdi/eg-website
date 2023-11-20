const accessControl = (schema, fields) => {
  const newSchema = { ...schema };
  for (const field of fields) {
    if (newSchema.properties?.[field]) {
      if (newSchema.properties.hasOwnProperty(field)) {
        newSchema.properties[field].readOnly = "true";
      } else {
        const { readOnly, ...propData } = newSchema.properties[field] || {};
        newSchema.properties[field] = propData;
      }
    }
  }
  return newSchema;
};

export default accessControl;
