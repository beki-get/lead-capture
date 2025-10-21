import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const { id } = await params;
  const { status } = await req.json();

  try {
    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
