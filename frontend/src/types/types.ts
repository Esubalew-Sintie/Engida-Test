// types.ts
 interface TaskFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
}

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
}

interface PaginationComponentProps {
  pagination: PaginationProps;
  setPagination: (value: PaginationProps) => void;
}
interface TaskModalProps {
  isVisible: boolean;
  setIsVisible: () => void; // Set visibility to be handled without boolean argument
  onSubmit: (values: { title: string; description: string; status: string }) => void;
  editTaskData?: {  // Optional task data for editing
    title?: string;
    description?: string;
    status?: string;
  };
}

interface FormValues {
    title: string;
    description: string;
    status: string;
}

export type {TaskFiltersProps, PaginationProps, PaginationComponentProps,TaskModalProps,FormValues}