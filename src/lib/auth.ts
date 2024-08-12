import pb from "./pocketbase";

export const isUserAuthenticated = () => {
  return pb.authStore.isValid;
};

export const getCurrentUser = () => {
  return pb.authStore.model;
};
