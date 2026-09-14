export interface VoiceProvider{speak(text:string,locale:string):Promise<void>;listen(locale:string):Promise<string>}
