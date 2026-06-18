import { authFetch } from "../utils/AuthFetch";
import AddForm from "../components/AddForm";
import API_BASE_URL from "../config";

export default function UserAddPage() {
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Enter email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
    },
    {
      name: "passwordCheck",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm password",
      required: true,
    },
    { name: "isAdmin", label: "Is Admin?", type: "checkbox" },
  ];

  const handleSubmit = async (values) => {
    // Password match validation
    if (values.password !== values.passwordCheck) {
      throw new Error("Passwords do not match");
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          is_admin: values.isAdmin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error adding user");
      }

      return { message: "User registered successfully!" };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <AddForm
      title="Add New User"
      fields={fields}
      onSubmit={handleSubmit}
      backLink="/admin/users"
    />
  );
}
