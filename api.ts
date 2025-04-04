import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

interface ExecuteRequest {
  language: string;
  version: string;
  files: Array<{
    content: string;
  }>;
}

interface ExecuteResponse {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
  };
}

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (
  language: string,
  sourceCode: string
): Promise<ExecuteResponse> => {
  const response = await API.post<ExecuteResponse>("/execute", {
    language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};