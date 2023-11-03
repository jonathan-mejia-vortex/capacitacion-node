import { DataSource } from "typeorm";
import { MONGO_DB_PW } from "./utils/keys";

const URL = 'mongodb+srv://alejozonta:' + MONGO_DB_PW + '@cluster0.citg00o.mongodb.net/mern?retryWrites=true&w=majority';

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: URL,
    useNewUrlParser: true,
    synchronize: true,
    useUnifiedTopology: true,
    logging: true,
    entities: [
        "src/entity/*.ts"
    ],
    subscribers: [],
    migrations: [],
});