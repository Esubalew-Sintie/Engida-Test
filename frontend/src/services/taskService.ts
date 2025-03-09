import { GetTasksParams } from "../store/taskSlice";

const BASE_URL = "http://localhost:7000";



export const fetchTasks = async (token: string, page: number, limit: number, search: string, status: string) => {
  const getTasksParams: GetTasksParams = {token, page, limit, search, status  };
  const queryParams = new URLSearchParams(getTasksParams as unknown as Record<string, string>).toString();
  const response = await fetch(`${BASE_URL}/tasks?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const createTask = async (task: { title: string; description: string ,status: string }, token: string) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
  return response.json();
};

export const updateTask = async (id: string, task: { title: string; description: string; status: string }, token: string) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
  return response.json();
};

export const deleteTask = async (id: string, token: string) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
