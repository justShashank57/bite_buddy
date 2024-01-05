import { AuthPayload } from "../DTO/Auth.dto";

declare global{
    namespace Express{
        interface Request{
            user?:AuthPayload
        }
    }
}