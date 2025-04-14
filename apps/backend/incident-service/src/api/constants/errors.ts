export type ErrorResponse = {
  status: number;
  message: string;
  prettyMessage: string;
};

export const errors: Record<number, ErrorResponse> = {
  400: {
    status: 400,
    message: "Bad Request",
    prettyMessage:
      "The request could not be understood by the server due to malformed syntax.",
  },
  401: {
    status: 401,
    message: "Unauthorized",
    prettyMessage: "The request requires user authentication.",
  },
  403: {
    status: 403,
    message: "Forbidden",
    prettyMessage:
      "The server understood the request, but is refusing to fulfill it.",
  },
  404: {
    status: 404,
    message: "Not Found",
    prettyMessage:
      "The server has not found anything matching the request URI.",
  },
  405: {
    status: 405,
    message: "Method Not Allowed",
    prettyMessage:
      "The method specified in the request is not allowed for the resource identified by the request URI.",
  },
  409: {
    status: 409,
    message: "Conflict",
    prettyMessage:
      "The request could not be completed due to a conflict with the current state of the resource.",
  },
  422: {
    status: 422,
    message: "Unprocessable Entity",
    prettyMessage:
      "The request was well-formed but was unable to be followed due to semantic errors.",
  },
  500: {
    status: 500,
    message: "Internal Server Error",
    prettyMessage:
      "The server encountered an unexpected condition which prevented it from fulfilling the request.",
  },
};
