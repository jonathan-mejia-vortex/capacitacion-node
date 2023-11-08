export interface Place {
    title: string;
    description: string;
    image: string;
    address: string;
    location: {
        lat: number,
        lng: number
    };
    creatorId: string;
}