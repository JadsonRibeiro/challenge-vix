import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from 'mongodb';

export const RegistersController = {
  index: async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    try {
      const collection = db.collection('registers');

      const response = await collection.find().toArray();

      res.status(200).json(response);
    } catch(e) {
      console.error('Error when getting registers', e);
      res.status(500);
    }
  }, 
  show: async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    const { rid } = req.query;

    try {
      const collection = db.collection('registers');

      const response = await collection.findOne(new ObjectId(String(rid)));

      res.status(200).json(response);
    } catch(e) {
      console.log('Erro on getting registers', e);
      res.status(500);
    }
  }, 
  create: async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    try {
      const collection = db.collection('registers');

      await collection.insertOne(req.body);

      res.status(201).json({ status: 'success' });
    } catch(e) {
      console.log('Erro on creating register', e);
      res.status(500);
    }
  }, 
  update: async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    const { rid } = req.query;

    try {
      const collection = db.collection('registers');  

      await collection.updateOne(
        { _id: new ObjectId(String(rid)) },
        { $set: req.body }
      );

      res.status(200).json({ status: 'success' });
    } catch(e) {
      console.log('Erro on updating register', e);
      res.status(500);
    }
  }, 
  delete: async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    const { rid } = req.query;

    try {
      const collection = db.collection('registers');    

      await collection.deleteOne({ _id: new ObjectId(String(rid)) });
      
      res.status(200).json({ status: 'success' });
    } catch(e) {
      console.log('Erro on deleting register', e);
      res.status(500);
    }
  }, 
}