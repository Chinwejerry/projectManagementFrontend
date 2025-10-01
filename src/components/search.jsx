import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("project");

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
        className="flex items-center gap-2 w-full max-w-md px-2 rounded "
      >
        <div className="flex items-center gap-2 flex-grow bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 px-2 rounded-xl">
          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${filter}...`}
            className="flex-1 p-2 rounded-xl "
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2  "
          >
            <option value="project">Project</option>
            <option value="task">Tasks</option>
          </select>
        </div>
        {/* Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white rounded-xl shadow"
        >
          Search
        </button>
      </form>
      {/* Suggestions Dropdown */}
      {/* {suggestions.length > 0 && query && (
        <ul className="absolute left-0 right-0 mt-1 bg-sky-900 border border-gray-200 rounded-xl shadow z-10 max-h-48 overflow-y-auto">
          {suggestions.map((item) => {
            const label = item.name || item.title;
            return (
              <li
                key={item._id}
                onClick={() => {
                  setQuery(label);
                  onSearch({ query: label, filter });
                }}
                className="p-2 cursor-pointer hover:bg-sky-700"
              >
                {label}
              </li>
            );
          })}
        </ul>
      )} */}
    </div>
  );
};
export default SearchBar;
