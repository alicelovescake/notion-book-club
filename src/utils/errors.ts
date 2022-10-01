import {
  isNotionClientError,
  ClientErrorCode,
  APIErrorCode,
} from "@notionhq/client";

export function getErrorMessage(error: unknown) {
  if (isNotionClientError(error)) {
    switch (error.code) {
      case ClientErrorCode.RequestTimeout:
        console.log("Oops, error in request timeout");
        break;
      case APIErrorCode.ObjectNotFound:
        console.log("Oops, database not found");
        break;
      case APIErrorCode.Unauthorized:
        console.log("Oops, you are not authorized to do that!");
        break;
      default:
        console.log("Oops, unknown error.");
    }
  } else {
    console.log("Oops, unknown error. Please try again!");
  }
}
