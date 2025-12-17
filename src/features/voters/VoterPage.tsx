// // src/features/voters/voter-page.tsx
// import { useState, useEffect, useCallback } from "react";
// import { voterService } from "@/services/voterService";
// import { Input } from "@/components/ui/input";
// import { useDebounce } from "use-debounce";
// import { DataTable } from "@/components/shared/data-table";

// export default function VoterPage() {
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // 1. Unified State for Pagination & Filters
//   const [filters, setFilters] = useState({
//     page: 1,
//     pageSize: 10,
//     search: "",
//     fromDate: "",
//     toDate: "",
//   });

//   const [debouncedSearch] = useDebounce(filters.search, 500);

//   const fetchVoters = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await voterService.getVoters({
//         ...filters,
//         search: debouncedSearch, // Use debounced value for API
//       });
//       setData(response.items);
//       setTotal(response.totalCount);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.pageSize, filters.fromDate, filters.toDate, debouncedSearch]);

//   useEffect(() => {
//     fetchVoters();
//   }, [fetchVoters]);

//   return (
//     <div className="p-6 space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Search Filter */}
//         <Input
//           placeholder="Search by name or ID..."
//           value={filters.search}
//           onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
//         />
        
//         {/* Date Filters */}
//         <div className="flex gap-2">
//           <Input
//             type="date"
//             onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value, page: 1 }))}
//           />
//           <Input
//             type="date"
//             onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value, page: 1 }))}
//           />
//         </div>
//       </div>

//       <DataTable
//         columns={voterColumns} // Defined in separate file
//         data={data}
//         rowCount={total}
//         isLoading={loading}
//         pagination={{ 
//             pageIndex: filters.page - 1, 
//             pageSize: filters.pageSize 
//         }}
//         onPaginationChange={(p) => setFilters(f => ({ 
//             ...f, 
//             page: p.pageIndex + 1, 
//             pageSize: p.pageSize 
//         }))}
//       />
//     </div>
//   );
// }