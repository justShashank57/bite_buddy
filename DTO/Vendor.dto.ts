export interface createVendorInput{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string
}

export interface EditVendorInputs{
       name:string;
       email:string;
       foodType:[string];
       phone:string;
}
export interface vendorLoginInputs{
       email:string;
       password:string;
}

export interface vendorPayloadInputs{
       __id:string;
       email:string;
       name:string;
       foodType:[string];
}