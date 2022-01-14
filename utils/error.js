export const getError = (err) => {
  return err.response?.data?.message || err.message;
};

