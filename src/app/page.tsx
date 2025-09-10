"use client";
import React from "react";
import Row from "@/components/rowview";
import Card from "@/components/cardview";
import { DataProps } from "@/types";

const medicalIssues = [
  "headache", "fever", "cough", "nausea", "fatigue", "dizziness",
  "back pain", "chest pain", "shortness of breath", "anxiety"
];

export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const [view, setView] = React.useState<"row" | "card">("row");
  const [data, setData] = React.useState<DataProps[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [smCols, setSmCols] = React.useState(2);
  const [searchText, setSearchText] = React.useState("");
  const [filterMedical, setFilterMedical] = React.useState<string[]>([]);
  const [filterState, setFilterState] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string[]>([]);
  const [sortDir, setSortDir] = React.useState<{ [key: string]: string }>({});
  const [showFilterDialog, setShowFilterDialog] = React.useState(false);
  const [filterAgeRange, setFilterAgeRange] = React.useState<string[]>([]);

  // Apply search, filters and sorting before pagination
  const filtered = data.filter((d) => {
    const matchesText = searchText
      ? `${d.patient_name} ${d.contact?.[0]?.email || ''} ${d.patient_id}`.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesMedical = filterMedical.length === 0 ? true : filterMedical.includes(d.medical_issue || '');

    // Age range filtering
    const matchesAgeRange = filterAgeRange.length === 0 ? true : filterAgeRange.some(range => {
      const age = d.age || 0;
      switch (range) {
        case '0-17': return age >= 0 && age <= 17;
        case '18-30': return age >= 18 && age <= 30;
        case '31-50': return age >= 31 && age <= 50;
        case '51-70': return age >= 51 && age <= 70;
        case '71+': return age >= 71;
        default: return true;
      }
    });

    const matchesState = filterState.length === 0 ? true : filterState.includes(d.contact?.[0]?.address?.split(',').pop()?.trim() || '');
    return matchesText && matchesMedical && matchesAgeRange && matchesState;
  });

  const sorted = [...filtered].sort((a, b) => {
    for (const sortField of sortBy) {
      const direction = sortDir[sortField] || 'asc';
      let comparison = 0;

      if (sortField === "age") {
        const av = a.age || 0;
        const bv = b.age || 0;
        comparison = av - bv;
      } else if (sortField === "name") {
        const an = (a.patient_name || '').toLowerCase();
        const bn = (b.patient_name || '').toLowerCase();
        if (an < bn) comparison = -1;
        else if (an > bn) comparison = 1;
        else comparison = 0;
      } else if (sortField === "medical_issue") {
        const am = (a.medical_issue || '').toLowerCase();
        const bm = (b.medical_issue || '').toLowerCase();
        if (am < bm) comparison = -1;
        else if (am > bm) comparison = 1;
        else comparison = 0;
      }

      if (comparison !== 0) {
        return direction === "asc" ? comparison : -comparison;
      }
    }
    return 0;
  });

  const total = sorted.length;
  const totalPages = Math.ceil(total / pageSize);

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/getdata")
      .then((res) => res.status === 200 ? res.json() : Promise.reject("Failed to load"))
      .then((apiData: DataProps[]) => {
        const processedData = apiData.map((user: DataProps) => ({
          ...user,
          medical_issue: user.medical_issue || medicalIssues[Math.floor(Math.random() * medicalIssues.length)]
        }));
        setData(processedData);
        setLoading(false);
        setPage(1)
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(err.message);
      });
  }, []);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Close filter dialog when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showFilterDialog && !target.closest('.filter-dialog-container')) {
        setShowFilterDialog(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDialog]);

  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-6 text-center">No data</div>;
  }

  return (
    <div className="w-screen h-max bg-white">
      <div className="w-full bg-white px-10 flex items-cente justify-between gap-4 py-2">
        <div>
          <button
            className={`p-1 text-black border-b-4 ${view === "row" ? "border-blue-400" : "border-gray-400"} hover:border-blue-400`}
            onClick={() => {
              setView("row");
              setPageSize(20); // Default page size for table view
              setPage(1);
            }}
          >
            Table View
          </button>
          <button
            className={`p-1 text-black border-b-4 ${view === "card" ? "border-blue-400" : "border-gray-400"} hover:border-blue-400`}
            onClick={() => {
              setView("card");
              setPageSize(12); // Default page size for card view
              setPage(1);
            }}
          >
            Card View
          </button>
        </div>
        <div className="relative filter-dialog-container">
          <button
            onClick={() => setShowFilterDialog(!showFilterDialog)}
            className="border px-3 py-2 rounded bg-white hover:bg-gray-50 flex items-center gap-2 text-black"
          >
            <span>Filters</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filterMedical.length + filterState.length + filterAgeRange.length}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Filter Dialog */}
          {showFilterDialog && (
            <div className="absolute top-full mt-1 -left-50 bg-white border rounded-lg shadow-lg z-10 p-4 w-80 text-black">
              <h3 className="font-semibold mb-3">Filter Options</h3>

              {/* Age Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Age Range</label>
                <div className="space-y-1">
                  {['0-17', '18-30', '31-50', '51-70', '71+'].map(range => (
                    <label key={range} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterAgeRange.includes(range)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterAgeRange([...filterAgeRange, range]);
                          } else {
                            setFilterAgeRange(filterAgeRange.filter(f => f !== range));
                          }
                          setPage(1);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">{range} years</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medical Issues */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Medical Issues</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {Array.from(new Set(data.map(d => d.medical_issue).filter(Boolean))).map(mi => (
                    <label key={mi} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterMedical.includes(mi as string)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterMedical([...filterMedical, mi as string]);
                          } else {
                            setFilterMedical(filterMedical.filter(f => f !== mi));
                          }
                          setPage(1);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">{mi}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* States/Addresses */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Locations</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {Array.from(new Set(data.map(d => d.contact?.[0]?.address?.split(',').pop()?.trim()).filter(Boolean))).map(s => (
                    <label key={s} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterState.includes(s as string)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterState([...filterState, s as string]);
                          } else {
                            setFilterState(filterState.filter(f => f !== s));
                          }
                          setPage(1);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setFilterMedical([]);
                    setFilterState([]);
                    setFilterAgeRange([]);
                    setPage(1);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterDialog(false)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search bar with filter and sort Instant*/}
      <div className="p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
            placeholder="Search name, email, or ID..."
            className="border px-3 py-2 rounded w-64 text-black"
          />

          {/* Sort Controls - Multiple Sorting */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-black">Add Sort:</label>
            <select
              value=""
              onChange={(e) => {
                const newSort = e.target.value;
                if (newSort && !sortBy.includes(newSort)) {
                  setSortBy([...sortBy, newSort]);
                  setSortDir({ ...sortDir, [newSort]: 'asc' });
                }
              }}
              className="border px-2 py-2 rounded text-black"
            >
              <option value="">Select field...</option>
              <option value="age">Age</option>
              <option value="name">Name</option>
              <option value="medical_issue">Medical Issue</option>
            </select>
          </div>

          {/* Current sorts display */}
          {sortBy.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-black">Active Sorts:</span>
              {sortBy.map((field, index) => (
                <div key={field} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-black">
                  <span className="text-sm">
                    {index + 1}. {field === 'medical_issue' ? 'Medical Issue' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <button
                    onClick={() => {
                      const newSortDir = { ...sortDir };
                      newSortDir[field] = newSortDir[field] === "asc" ? "desc" : "asc";
                      setSortDir(newSortDir);
                    }}
                    className="text-xs hover:bg-gray-200 px-1 rounded"
                  >
                    {sortDir[field] === "asc" ? "↑" : "↓"}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy(sortBy.filter(s => s !== field));
                      const newSortDir = { ...sortDir };
                      delete newSortDir[field];
                      setSortDir(newSortDir);
                    }}
                    className="text-xs hover:bg-gray-200 px-1 rounded text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Filters Display */}
        {(filterMedical.length > 0 || filterState.length > 0 || filterAgeRange.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filterAgeRange.map(filter => (
              <span key={`age-${filter}`} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Age: {filter} years
                <button
                  onClick={() => {
                    setFilterAgeRange(filterAgeRange.filter(f => f !== filter));
                    setPage(1);
                  }}
                  className="ml-1 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            ))}
            {filterMedical.map(filter => (
              <span key={`medical-${filter}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Medical: {filter}
                <button
                  onClick={() => {
                    setFilterMedical(filterMedical.filter(f => f !== filter));
                    setPage(1);
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
            {filterState.map(filter => (
              <span key={`location-${filter}`} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Location: {filter}
                <button
                  onClick={() => {
                    setFilterState(filterState.filter(f => f !== filter));
                    setPage(1);
                  }}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Table (row) view */}
      {view === "row" && (
        <div className="p-6 text-black">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm">Page size:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-2 py-1 rounded"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <button
                className="px-3 py-1 rounded border"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded border"
                onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="text-blue-500 border-none">
                  <th className="px-4 py-2 ">ID</th>
                  <th className="px-4 py-2 ">Name</th>
                  <th className="px-4 py-2 ">Age</th>
                  <th className="px-4 py-2 ">Medical Issue</th>
                  <th className="px-4 py-2 ">Address</th>
                  <th className="px-4 py-2 ">Phone</th>
                  <th className="px-4 py-2 ">Email</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d: DataProps, idx: number) => (
                  <Row
                    key={`${d.patient_id}-${start + idx}`}
                    member={d}
                    index={idx}
                    start={start}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Card view */}
      {view === "card" && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between gap-4 text-black">
            <div className="flex items-center gap-2">
              <label className="text-sm">Small-screen columns:</label>
              <select
                value={smCols}
                onChange={(e) => setSmCols(Number(e.target.value))}
                className="border px-2 py-1 rounded"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Page size:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-2 py-1 rounded"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <button
                className="px-3 py-1 rounded border"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded border"
                onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            style={{ gridTemplateColumns: `repeat(${smCols}, minmax(0, 1fr))` }}
          >
            {pageItems.map((d: DataProps, idx: number) => (
              <Card
                key={`${d.patient_id}-${start + idx}`}
                member={d}
                index={idx}
                start={start}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
