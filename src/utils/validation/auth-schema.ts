import { object, string } from "yup"

export const authLoginSchema = object().shape({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
})

export const authRegisterSchema = object().shape({
  email: string().required("Email is required"),
  password: string().required("Password is requird"),
  first_name: string().required("First name is required"),
  last_name: string().required("Last name is required"),
  address: string().required("Address is required"),
  contact_no: string().required("Contact is required"),
  role: string().required("Role is required"),
})
