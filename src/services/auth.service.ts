import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_EXPIRES_IN, SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, Login, Signup, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = userModel;

  public async signup(userData: Signup): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "User data not found.");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: Login): Promise<{ tokenData: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "Login not found");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} not found.`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);

    return { tokenData, findUser };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = eval(JWT_EXPIRES_IN);
    console.log(JWT_EXPIRES_IN)
    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }


}

export default AuthService;
