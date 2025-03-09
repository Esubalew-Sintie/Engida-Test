import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";

interface Task {
  id: string; // changed from number to string
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

 interface TaskState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TaskState = { tasks: [], loading: false, };

interface GetTasksParams {
  token: string;
  page: number;
  limit: number;
  search: string;
  status: string;
}
export type { Task, TaskState, GetTasksParams };
export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async ({ token, page, limit, search, status }: GetTasksParams) => {
    return fetchTasks(token, page, limit, search, status);
  }
);

export const addTask = createAsyncThunk("tasks/addTask", async ({ title, description,status, token }: { title: string; description: string; status:string; token: string }) => {
  return createTask({ title, description,status }, token);
});

export const editTask = createAsyncThunk("tasks/editTask", async ({ id, title, description, status, token }: { id: string; title: string; description: string; status: string; token: string }) => {
  return updateTask(id, { title, description, status }, token);
});

export const removeTask = createAsyncThunk("tasks/removeTask", async ({ id, token }: { id: string; token: string }) => {
  await deleteTask(id, token);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.data;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
