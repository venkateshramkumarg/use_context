import { NextResponse,NextRequest } from 'next/server';

let tasks = [
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const newTask = await request.json();
  const taskWithId = { id: Date.now(), ...newTask };
  return NextResponse.json(taskWithId, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedTask = await request.json();
  tasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  return NextResponse.json(updatedTask);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  tasks = tasks.filter((task) => task.id !== id);
  return NextResponse.json({ id });
}
