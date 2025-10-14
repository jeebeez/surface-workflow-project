import axios, { type AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = "http://localhost:3000";
const API_TIMEOUT = 30000;

class Api {
  private instance: AxiosInstance;
  private defaultConfig: AxiosRequestConfig = {
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    withCredentials: true,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    // add auth token here later
  };

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({ ...this.defaultConfig, ...config });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => res,
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

export default new Api().getAxiosInstance();
