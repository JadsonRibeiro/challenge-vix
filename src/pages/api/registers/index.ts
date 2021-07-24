import { Db, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { RegistersController } from '../../../controllers/registersController';

// Used to avoid too many connections
let cachedDB: Db;

const methods: {[method: string]: (req: NextApiRequest, res: NextApiResponse, db: Db) => void} = {
  POST: RegistersController.create,
  GET: RegistersController.index,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let db: Db;

  if(cachedDB) {
    db = cachedDB;
  } else {
    const client = await MongoClient.connect(String(process.env.MONGODB_URI));
    db = client.db('registered_users');
    cachedDB = db;
  }

  return req.method && methods[req.method] ? methods[req.method](req, res, db) : res.status(405);
}
