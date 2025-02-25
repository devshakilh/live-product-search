import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

interface Product {
  id: number;
  name: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | { error: string }>
) {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters' });
  }

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '#',
      database: 'product_search',
    });

    const [rows] = await connection.execute('SELECT * FROM products WHERE name LIKE ? LIMIT 10', [`%${query}%`]);


    const products = rows as Product[];

    await connection.end();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}