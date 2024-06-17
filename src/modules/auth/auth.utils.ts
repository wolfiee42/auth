import bcryptjs from 'bcryptjs';

export const isPasswordCorrect = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatched = await bcryptjs.compare(password, hashedPassword);
    return isMatched;
}