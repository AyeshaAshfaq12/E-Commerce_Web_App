const _ = require("lodash");

const compareObjects = (obj1, obj2, schema) => {
  const changedFields = {};

  Object.keys(obj2).forEach((field) => {
    // Check if the field is defined in the schema
    const isFieldDefinedInSchema = schema.paths[field] !== undefined;

    if (
      isFieldDefinedInSchema &&
      _.has(obj1, field) &&
      !_.isEqual(obj1[field], obj2[field])
    ) {
      // Field is in the schema, in both obj1 and obj2, and values are different
      changedFields[field] = {
        oldValue: obj1[field],
        newValue: obj2[field],
        status: "updated",
      };
    } else if (isFieldDefinedInSchema && !_.has(obj1, field)) {
      // Field is in the schema, but not in obj1 (new field)
      changedFields[field] = {
        oldValue: undefined,
        newValue: obj2[field],
        status: "new",
      };
    }
    // else: Field is either not in the schema or not in both obj1 and obj2, so we skip it
  });

  return changedFields;
};

module.exports = {
  compareObjects,
};
