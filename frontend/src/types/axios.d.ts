import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    skip403And404Toast?: boolean;
  }
}
