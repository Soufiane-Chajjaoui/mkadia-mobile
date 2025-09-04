import { MediaType } from "../enums/MediaType";

export interface Media {
    id: string;
    url: string;
    type: MediaType;
    position: string
}