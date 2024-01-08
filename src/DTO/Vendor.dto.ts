export interface createVendorInput{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
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

export interface createOfferInputs{
       offerType:string; //VENDOR  // GENERIC
       vendors:[any];  //vendorId
       title:string;   //INR 200 off on week days
       description:string;
       minValue:number; //minimum amount
       offerAmount:number;
       startValidity:Date; 
       endValidity:Date;
       promocode:string; //WEEK200
       promotype:string; //USER // BANK // CARD //ALL
       bank:[any];
       bins:[any];
       pincode:string;
       isActive:boolean; 
}