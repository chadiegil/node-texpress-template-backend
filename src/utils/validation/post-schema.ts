import { object, string } from "yup"

export const postSchema = object().shape({
  description: string().required("Description is required"),
})
