import { useState } from "react";
import { Link } from "react-router-dom";

export default function AddForm({ title, fields, onSubmit, backLink }) {
  const initialValues = fields.reduce(
    (acc, f) => ({ ...acc, [f.name]: f.type === "checkbox" ? false : "" }),
    {},
  );

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState();
  const [preview, setPreview] = useState(null);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (file, name) => {
    handleChange(name, file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    fields.forEach((f) => {
      if (f.required && !values[f.name]) {
        newErrors[f.name] = true;
      }
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 1000);
      return;
    }

    try {
      const result = await onSubmit(values);
      setMessage(result?.message || "Success");
      setValues(initialValues);
      setPreview(null);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-3">
            {/* Checkbox Field */}
            {f.type === "checkbox" ? (
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-700">{f.label}</label>
                <input
                  type="checkbox"
                  checked={values[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <label className="w-32 font-medium text-gray-700">
                  {f.label}
                </label>

                {f.type === "file" ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition flex-1 ${
                      errors[f.name]
                        ? "border-red-500"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      handleImage(file, f.name);
                    }}
                  >
                    <input
                      type="file"
                      className="hidden"
                      id={f.name}
                      accept="image/*"
                      onChange={(e) => handleImage(e.target.files[0], f.name)}
                    />
                    <label htmlFor={f.name} className="cursor-pointer">
                      {!preview ? (
                        <div className="text-gray-500">
                          <p className="font-medium">Drag & drop image here</p>
                          <p className="text-sm">or click to upload</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={preview}
                            alt="preview"
                            className="w-40 h-40 object-cover rounded shadow"
                          />
                          <span className="text-blue-500 text-sm">
                            Change image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : f.type === "textarea" ? (
                  <textarea
                    value={values[f.name]}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    className={`flex-1 p-3 rounded-lg border transition-all duration-200 h-36 resize-none ${
                      errors[f.name]
                        ? "border-red-500 animate-shake"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                ) : (
                  <input
                    type={f.type}
                    value={values[f.name]}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    className={`flex-1 p-3 border rounded ${
                      errors[f.name]
                        ? "border-red-500 animate-shake"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 font-semibold"
        >
          Submit
        </button>
      </form>

      {message && <p className="mt-5 text-gray-700 font-medium">{message}</p>}

      <div className="mt-6">
        <Link
          to={backLink}
          className="text-blue-500 hover:underline font-medium"
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}
