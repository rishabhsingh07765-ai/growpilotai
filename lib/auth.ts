import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret-change-me');
export async function createSession(userId:string){const token=await new SignJWT({userId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(secret);(await cookies()).set('gp_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});}
export async function getCurrentUser(){const token=(await cookies()).get('gp_session')?.value;if(!token)return null;try{const {payload}=await jwtVerify(token,secret);if(typeof payload.userId!=='string')return null;return db.user.findUnique({where:{id:payload.userId},include:{brandProfile:true,instagramAccounts:true}})}catch{return null}}
export async function destroySession(){(await cookies()).delete('gp_session')}
