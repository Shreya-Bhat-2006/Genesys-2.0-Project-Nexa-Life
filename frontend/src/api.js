import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== USER ENDPOINTS ==========
export const registerUser = (userData) =>
  API.post("/users/register", userData);

export const loginUser = (email, password) =>
  API.post("/users/login", new URLSearchParams({
    username: email,
    password: password,
  }));

// ========== GREEN PROJECT ENDPOINTS ==========
export const applyAsGreenProject = (projectData) =>
  API.post("/projects/apply", projectData);

export const getMyProjects = () =>
  API.get("/projects/my-projects");

export const getProjectDetails = (projectId) =>
  API.get(`/projects/${projectId}`);

// ========== ADMIN ENDPOINTS ==========
export const getPendingProjects = () =>
  API.get("/admin/pending-projects");

export const approveProject = (projectId) =>
  API.post(`/admin/approve-project/${projectId}`);

export const rejectProject = (projectId, reason) =>
  API.post(`/admin/reject-project/${projectId}`, { reason });

// ========== CREDITS ENDPOINTS ==========
export const getMyCredits = () =>
  API.get("/credits/my-credits");

export const getCreditDetail = (creditId) =>
  API.get(`/credits/${creditId}`);

export const useCreditEndpoint = (creditId) =>
  API.post("/credits/use-credit", { credit_id: creditId });

// ========== MARKETPLACE ENDPOINTS ==========
export const getAvailableCredits = () =>
  API.get("/marketplace/available-credits");

export const listCreditForSale = (creditId, price) =>
  API.post("/marketplace/list-credit", {
    credit_id: creditId,
    price: price,
  });

export const buyCredit = (creditId) =>
  API.post("/marketplace/buy-credit", { credit_id: creditId });

// ========== PUBLIC VERIFY ENDPOINT (No Auth Needed) ==========
export const verifyCredit = (creditId) => {
  // Don't use interceptor for this, make direct call
  return axios.get(`http://127.0.0.1:8000/verify/${creditId}`);
};

export default API;
