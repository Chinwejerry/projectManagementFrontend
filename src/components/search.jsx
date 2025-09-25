import { useState } from "react";

const SearchBar = ({ onSearch, suggestions }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("name");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query, filter }); // pass search data to parent
    }
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full max-w-md px-2 rounded"
      >
        <span className="flex items-center gap-2 flex-1 bg-slate-600 px-2 rounded-xl">
          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${filter}...`}
            className="flex-1 p-2 rounded-xl bg-slate-600"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-xl  bg-slate-600 text-white"
          >
            <option value="Project Name">Project</option>
            <option value="Tasks Name">Tasks</option>
          </select>
        </span>
        {/* Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-slate-600 text-white rounded-xl shadow"
        >
          Search
        </button>
      </form>
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && query && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow z-10 max-h-48 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => setQuery(item.name)} // Pick suggestion
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {item.name} – {item.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default SearchBar;
