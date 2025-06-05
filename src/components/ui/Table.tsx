import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

function Table<T>({
  columns,
  data,
  onRowClick,
  keyExtractor,
  isLoading = false,
  emptyState
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden border border-gray-200 rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="w-full overflow-hidden border border-gray-200 rounded-lg">
        <div className="flex justify-center items-center h-64">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors duration-150' : ''}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column, idx) => {
                const value = typeof column.accessor === 'function' 
                  ? column.accessor(item) 
                  : item[column.accessor];
                
                return (
                  <td key={idx} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${column.className || ''}`}>
                    {value as React.ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;