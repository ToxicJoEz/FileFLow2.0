export const validateRequest = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Express 5 query is a getter; these schemas currently validate request bodies.
    if (validated.body !== undefined) req.body = validated.body;
    if (validated.params !== undefined) req.params = validated.params;
    next();
  } catch (error) {
    res.status(400);
    next(error); // Passes the ZodError to the global error handler
  }
};
