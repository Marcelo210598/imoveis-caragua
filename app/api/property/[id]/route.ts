import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById } from '@/lib/properties';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const property = getPropertyById(decodeURIComponent(params.id));

  if (!property) {
    return NextResponse.json(
      { error: 'Imovel nao encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(property);
}
