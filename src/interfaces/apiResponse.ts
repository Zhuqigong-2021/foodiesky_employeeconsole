export default interface apiResponse {
  code?: number;
  data?: {
    data?: {
      // this will not give suggestions
      [key: string]: string;
    };
    msg?: any;
  };
  error?: any;
}
