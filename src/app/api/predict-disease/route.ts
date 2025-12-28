import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Save the image temporarily
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, { recursive: true });
    const tempImagePath = path.join(tempDir, imageFile.name);
    await fs.writeFile(tempImagePath, buffer);

    // Path to the Python script
    const pythonScriptPath = path.join(process.cwd(), 'src', 'plantdiseaseprediction', 'app', 'main.py');
    const venvPythonPath = path.join(process.cwd(), 'src', 'plantdiseaseprediction', 'app', '.venv', 'Scripts', 'python.exe');

    // Execute the Python script
    const command = `"${venvPythonPath}" "${pythonScriptPath}" "${tempImagePath}"`;

    return new Promise<NextResponse>((resolve) => {
      exec(command, async (error, stdout, stderr) => {
        // Clean up the temporary image file
        await fs.unlink(tempImagePath);

        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`stderr: ${stderr}`);
          try {
            const errorJson = JSON.parse(stdout);
            return resolve(NextResponse.json({ error: errorJson.error || 'Prediction failed' }, { status: 500 }));
          } catch (e) {
            return resolve(NextResponse.json({ error: 'Prediction failed', details: stderr }, { status: 500 }));
          }
        }
        
        try {
          const result = JSON.parse(stdout);
          if (result.error) {
            return resolve(NextResponse.json({ error: result.error }, { status: 500 }));
          }
          resolve(NextResponse.json({ prediction: result.prediction }, { status: 200 }));
        } catch (e) {
          console.error(`Failed to parse Python output: ${stdout}`);
          resolve(NextResponse.json({ error: 'Failed to parse prediction result', stdout: stdout }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}