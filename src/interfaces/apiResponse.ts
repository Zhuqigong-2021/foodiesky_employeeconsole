export default interface apiResponse {
  code?: number;
  data?: {
    code: number;
    data?: {
      // this will not give suggestions
      [key: string]: string;
    };
    msg?: any;
  };
  error?: any;
}
