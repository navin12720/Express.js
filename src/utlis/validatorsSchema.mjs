export const createUserVAlidateScheme = {
  username: {
    isLength: {
      options: { min: 5, max: 32 },
      errorMessage: "username must be atleast 5 to 32 characters",
    },
    notEmpty: { errorMessage: "Username cant be empty" },
    isString: { errorMessage: "Username must be String" },
  },
  email: {
    notEmpty: {
      errorMessage: "Email cant be empty",
    },
  },
};
