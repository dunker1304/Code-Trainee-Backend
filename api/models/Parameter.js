module.exports = {
  tableName: "Parameter",
  attributes: {
    paramName: { type: "string", columnName: "param_name" },
    paramType: { type: "string", columnName: "param_type" },
    paramOrder: { type: "number", columnName: "param_order" },
    createdBy: { type: "number", columnName: "created_by" },
    snippetId: {
      model: "CodeSnippet",
      columnName: "snippet_id",
    },
  },
};
