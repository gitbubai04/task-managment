import axios from 'axios';
import { useState } from 'react';

interface IAxiosResponse<P> {
  success: boolean;
  message: string;
  data?: P;
}

type UseAxiosReturnType<T, P> = [
  IAxiosResponse<P> | null,
  boolean,
  (payload?: T) => Promise<void>
];

type HTTPMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const useAxios = <T, P>(endpoint: string, method: HTTPMethodType, formData?: boolean, isLoadOff?: boolean): UseAxiosReturnType<T, P> => {
  const [data, setData] = useState<IAxiosResponse<P> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const headers = formData ? { 'Content-Type': 'multipart/form-data' } : {};

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    withCredentials: true,
    headers
  })

  const doRequest = async (payload?: T) => {
    if (!isLoadOff || !isLoaded) {
      setIsLoading(true);
      setData(null);
    }
    setLoaded(true);
    try {
      let response;
      switch (method) {
        case "POST":
          response = await instance.post(endpoint, payload);
          break;
        case "PUT":
          response = await instance.put(endpoint, payload);
          break;
        case "PATCH":
          response = await instance.patch(endpoint, payload);
          break;
        case "DELETE":
          response = await instance.delete(endpoint);
          break;
        case "GET":
        default:
          response = await instance.get(endpoint);
          break;
      }
      setData(response.data);
    } catch (error: any) {
      console.error("Error: ", error)
      if (error.response) setData(error.response.data);
      else setData({ success: false, message: "Something went wrong" });
    }
    finally {
      setIsLoading(false);
    }
  };

  return [data, isLoading, doRequest]
};

export default useAxios;
