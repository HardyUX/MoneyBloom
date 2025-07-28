import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useExpenseStore } from "../store/useExpenseStore";
import type { Category } from "../store/useExpenseStore";
import { v4 as uuid } from "uuid";

const emptyCategory = (): Omit<Category, "id"> => ({
  name: "",
  color: "#a5b4fc",
  linkedDescriptions: [],
});

const CategoryManagerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState<Omit<Category, "id">>(emptyCategory());
  const [editingId, setEditingId] = useState<string | null>(null);

  const { categories, addCategory, updateCategory, deleteCategory } = useExpenseStore();

  // Form handlers
  const handleOpen = (cat?: Category) => {
    if (cat) {
      setEdit({ ...cat });
      setEditingId(cat.id);
    } else {
      setEdit(emptyCategory());
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!edit.name.trim()) return;
    if (editingId) {
      updateCategory(editingId, edit);
    } else {
      addCategory({ id: uuid(), ...edit });
    }
    setIsOpen(false);
    setEdit(emptyCategory());
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this category?")) deleteCategory(id);
  };

  // Linked description management
  const handleAddDescription = (desc: string) => {
    if (!desc.trim()) return;
    setEdit((c) => ({
      ...c,
      linkedDescriptions: Array.from(new Set([...c.linkedDescriptions, desc.trim()])),
    }));
  };
  const handleRemoveDescription = (desc: string) => {
    setEdit((c) => ({
      ...c,
      linkedDescriptions: c.linkedDescriptions.filter((d) => d !== desc),
    }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpen()}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700"
        aria-label="Manage categories"
      >
        Categories
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
        <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full mx-auto shadow-xl z-10">
          <Dialog.Title className="text-lg font-semibold mb-2">
            {editingId ? "Edit Category" : "Add Category"}
          </Dialog.Title>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={edit.name}
                onChange={(e) => setEdit((c) => ({ ...c, name: e.target.value }))}
                className="border rounded px-2 py-1 w-full"
                maxLength={32}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Color</label>
              <input
                type="color"
                value={edit.color}
                onChange={(e) => setEdit((c) => ({ ...c, color: e.target.value }))}
                className="w-10 h-8 p-0 border-none"
                title="Pick color"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Linked Descriptions</label>
              <div className="flex gap-1 mb-2 flex-wrap">
                {edit.linkedDescriptions.map((desc) => (
                  <span
                    key={desc}
                    className="inline-flex items-center bg-indigo-100 text-indigo-700 rounded px-2 py-0.5 text-xs mr-1 mb-1"
                  >
                    {desc}
                    <button
                      type="button"
                      onClick={() => handleRemoveDescription(desc)}
                      className="ml-1 text-red-500 hover:text-red-700"
                      aria-label="Remove"
                    >×</button>
                  </span>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.currentTarget.elements.namedItem("newDesc") as HTMLInputElement);
                  handleAddDescription(input.value);
                  input.value = "";
                }}
                className="flex gap-2"
              >
                <input
                  name="newDesc"
                  type="text"
                  placeholder="New linked description"
                  className="border rounded px-2 py-1 flex-1"
                  maxLength={32}
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-indigo-200 rounded hover:bg-indigo-300 text-indigo-900 text-sm"
                >Add</button>
              </form>
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1 rounded border bg-gray-100 hover:bg-gray-200"
              >Cancel</button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => handleDelete(editingId)}
                  className="px-4 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >Delete</button>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >Save</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* List of current categories */}
      <div className="fixed bottom-24 right-6 w-64 max-h-60 overflow-y-auto rounded-lg shadow bg-white dark:bg-gray-900 p-3">
        <div className="text-sm font-medium mb-2">Categories</div>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{ background: cat.color }} />
                {cat.name}
              </span>
              <button
                className="text-xs text-indigo-700 hover:underline"
                onClick={() => handleOpen(cat)}
              >Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CategoryManagerModal;
