import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: "New" | "In Progress" | "Completed";
  category: string;
  user: string;
  created: string;
  updated: string;
}

export const login = async (email: string, password: string) => {
  return await pb.collection("users").authWithPassword(email, password);
};

export const register = async (
  email: string,
  password: string,
  passwordConfirm: string
) => {
  return await pb.collection("users").create({
    email,
    password,
    passwordConfirm,
  });
};

export const logout = () => {
  pb.authStore.clear();
};

export const createIdea = async (idea: Omit<Idea, "id">): Promise<Idea> => {
  return await pb.collection("ideas").create(idea);
};

export const getIdeas = async (sort: string = "-created"): Promise<Idea[]> => {
  const resultList = await pb.collection("ideas").getList<Idea>(1, 50, {
    sort: sort,
    expand: "user",
  });
  return resultList.items;
};

export const getIdea = async (id: string): Promise<Idea> => {
  return await pb.collection("ideas").getOne<Idea>(id);
};

export const getCurrentUser = () => {
  return pb.authStore.model;
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string }
) => {
  return await pb.collection("users").update(userId, data);
};

export const uploadAvatar = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return await pb.collection("users").update(userId, formData);
};

export const updateIdea = async (id: string, idea: Partial<Idea>) => {
  return await pb.collection("ideas").update<Idea>(id, idea);
};

export const deleteIdea = async (id: string) => {
  return await pb.collection("ideas").delete(id);
};

export default pb;
