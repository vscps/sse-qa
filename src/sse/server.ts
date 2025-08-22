import { Request, Response } from "express";

interface Client {
  id: number
  sessionId: string
  res: Response
}

let clients: Client[] = [];

// build the middleware for GET requests to the /events endpoint
export function eventsHandler(req: Request, res: Response) {
  // Set necessary headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    "Access-Control-Allow-Origin": '*'
  };
  res.writeHead(200, headers);
      
  // const sessionId = "1001";
  const sessionId = req.query.sessionId as string;

  // create and save new client
  const clientId = Date.now();

  const newClient = {
    id: clientId,
    sessionId: sessionId,
    res: res
  };

  clients.push(newClient);

  // only for debug
  const message = `Server sent message at ${new Date().toLocaleTimeString()}`;

  // SSE data format: data: [your_message]\n\n
  // res.write(`data: ${message}\n\n`);
  console.log(`Sent: ${message}`);
  
  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
    console.log("Client disconnected. Stopped sending events.");
  });    
}

export function sendEventsBySessionId(sessionId: string) {
  clients.forEach(client => {
    if (client.sessionId === sessionId)
      // tbd: add question data   
      client.res.write(`data: ${JSON.stringify( {"session": { sessionId } })}\n\n`);
  })
}

// test function for SSE
export async function testSSE(req: Request, res: Response) {
  const newData = req.body;
  res.json(newData);
  return sendEventsBySessionId("1001");
}
