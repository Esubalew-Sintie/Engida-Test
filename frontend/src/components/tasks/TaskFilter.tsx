import { Input, Select, Pagination } from "antd";
import { PaginationComponentProps, TaskFiltersProps } from "../../types/types";

const TaskFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: TaskFiltersProps) => {
  return (
    <div className="flex space-x-4">
      <Input.Search
        placeholder="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={(value) => setSearch(value)}
        enterButton
        className="w-80"
      />
      <Select
        value={statusFilter ?? ""}
        onChange={(value) => setStatusFilter(value || null)}
        placeholder="Filter by Status"
        className="w-60"
        allowClear
      >
        <Select.Option value="">All</Select.Option>
        <Select.Option value="To Do">To Do</Select.Option>
        <Select.Option value="In Progress">In Progress</Select.Option>
        <Select.Option value="Done">Completed</Select.Option>
      </Select>
    </div>
  );
};

const PaginationComponent = ({
  pagination,
  setPagination,
}: PaginationComponentProps) => {
  return (
    <Pagination
      current={pagination.current}
      total={pagination.total}
      pageSize={pagination.pageSize}
      onChange={(page: number) =>
        setPagination({ ...pagination, current: page })
      }
      className="mt-4"
    />
  );
};

export { TaskFilters, PaginationComponent };
