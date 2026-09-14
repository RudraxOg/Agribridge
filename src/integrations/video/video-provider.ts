export interface VideoProvider{createToken(input:{room:string;identity:string}):Promise<{token:string;url:string;mock:boolean}>}
