import { vendorPayloadInputs } from "./Vendor.dto";
import { customerPayload } from "./customer.dto";
export type AuthPayload = vendorPayloadInputs | customerPayload;