import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { db } from '../../../lib/db';
export async function POST(req:Request){
  const u=await getCurrentUser(); if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const d=await req.json(); const when=new Date(d.scheduledAt);
    if(Number.isNaN(when.getTime())||when<=new Date())return NextResponse.json({error:'Choose a future date and time.'},{status:400});
    const c=await db.content.findFirst({where:{id:d.contentId,userId:u.id}});
    const ig=await db.instagramAccount.findFirst({where:{id:d.instagramAccountId,userId:u.id,connectionStatus:'connected'}});
    if(!c||!ig)return NextResponse.json({error:'Content or connected Instagram account not found.'},{status:404});
    const existing=await db.scheduledPost.findUnique({where:{contentId:c.id}});
    if(existing)return NextResponse.json({error:'This content is already scheduled.',scheduled:existing},{status:409});
    const jobId=crypto.randomUUID();
    const s=await db.scheduledPost.create({data:{contentId:c.id,instagramAccountId:ig.id,scheduledAt:when,jobId}});
    await db.content.update({where:{id:c.id},data:{status:'scheduled'}});
    await db.auditLog.create({data:{userId:u.id,action:'POST_SCHEDULED',details:{scheduledPostId:s.id,scheduledAt:when.toISOString()}}});
    return NextResponse.json({scheduled:s});
  }catch(e:any){return NextResponse.json({error:e?.message||'Scheduling failed'},{status:400})}
}
