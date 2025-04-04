// // app/api/signup/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs"; // For password hashing

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   const { username, email, password } = await req.json();

//   // Simple validation
//   if (!username || !email || !password) {
//     return NextResponse.json(
//       { message: "All fields are required." },
//       { status: 400 }
//     );
//   }

//   try {
//     // Hash the password before saving it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user in the database
//     const user = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword, // Store the hashed password
//       },
//     });

//     return NextResponse.json(
//       { message: "User created successfully", user },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.json(
//       { message: "User creation failed. Please try again." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  // Simple validation
  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // ADDED: Check for existing username
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    // ADDED: Return error if username exists
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    // Original code continues from here
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "User creation failed. Please try again." },
      { status: 500 }
    );
  }
}