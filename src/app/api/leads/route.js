//src/app/api/leads/route.js
export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { collection, addDoc, getDocs } from 'firebase/firestore';
import nodemailer from 'nodemailer';
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const data = await request.json();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'leads'), {
      ...data,
      userEmail: session.user.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
   // return NextResponse.json({ success: true });
    // Send notification email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from:  `"Lead capture App" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: 'New Lead Submitted',
     text: `New lead:\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
    });
    return NextResponse.json({ message: 'Lead saved successfully', id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'leads'));
    const leads = [];
    querySnapshot.forEach((doc) => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  const { id } = params;
  const { status } = await req.json();
  try {
    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, { status });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return new Response(JSON.stringify({ error: 'Failed to update status' }), { status: 500 });
  }
}
