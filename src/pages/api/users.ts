import { NextApiRequest, NextApiResponse } from "next"

export default (req: NextApiRequest, res: NextApiResponse) => {
  const users = [
    { key: 1, nome: 'Tamires' },
    { key: 2, nome: 'Jon' },
    { key: 3, nome: 'Maria' },
  ]
  return res.status(200).json(users)
}


