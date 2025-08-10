import { MongoClient } from 'mongodb';

const uri = 'your_mongodb_connection_string_here';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export const connectToDatabase = async () => {
    const client = new MongoClient(uri, options);
    await client.connect();
    return client.db('your_database_name_here');
};