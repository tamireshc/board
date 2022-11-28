export interface IUser {
  nome: string;
  image: string;
  email: string,
}

export interface IProps {
  user: IUser;
  data: string;
  getUserDBJSON: string;
}

export interface IUserProp {
  user: IUser
}