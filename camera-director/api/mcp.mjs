import { gunzipSync } from 'node:zlib';

const URI='ui://widget/camera-director.html';
const MIME='text/html;profile=mcp-app';
const RAW='https://raw.githubusercontent.com/aiwithenoch/aiwithenoch1/main/camera-director/payload';

async function loadHtml(){
  const chunks=await Promise.all(Array.from({length:6},async(_,i)=>{
    const response=await fetch(`${RAW}/app.${i}.txt?v=030`,{cache:'no-store'});
    if(!response.ok) throw new Error(`Could not load payload ${i}: ${response.status}`);
    return response.text();
  }));
  return gunzipSync(Buffer.from(chunks.join(''),'base64')).toString('utf8');
}

const tool={
  name:'open_camera_director',
  title:'Open Camera Director',
  description:'Use this when the user wants to compose a camera angle, lens, articulated human pose, subject placement, shot type, or image-generation reference.',
  inputSchema:{type:'object',properties:{subject:{type:'string'},shotType:{type:'string',enum:['Medium','Wide','Close-Up','Low Angle','High Angle','Over Shoulder','Two Shot']}},additionalProperties:false},
  annotations:{readOnlyHint:true,openWorldHint:false,destructiveHint:false,idempotentHint:true},
  _meta:{ui:{resourceUri:URI},'openai/outputTemplate':URI,'openai/toolInvocation/invoking':'Opening Camera Director…','openai/toolInvocation/invoked':'Camera Director is ready'}
};

const ok=(id,result)=>({jsonrpc:'2.0',id,result});
const bad=(id,code,message)=>({jsonrpc:'2.0',id,error:{code,message}});

async function rpc(message){
  const {id=null,method,params={}}=message||{};
  if(method==='initialize') return ok(id,{protocolVersion:params.protocolVersion||'2025-06-18',capabilities:{tools:{},resources:{}},serverInfo:{name:'camera-director',version:'0.3.0'},instructions:'Use open_camera_director to compose a cinematic shot with poseable human mannequins.'});
  if(method==='ping') return ok(id,{});
  if(method==='tools/list') return ok(id,{tools:[tool]});
  if(method==='resources/list') return ok(id,{resources:[{uri:URI,name:'Camera Director widget',description:'Interactive 3D camera, articulated-human pose and shot composition studio.',mimeType:MIME}]});
  if(method==='resources/read'){
    if(params.uri!==URI) return bad(id,-32002,'Resource not found');
    return ok(id,{contents:[{uri:URI,mimeType:MIME,text:await loadHtml(),_meta:{ui:{prefersBorder:false,csp:{connectDomains:[],resourceDomains:['https://cdn.jsdelivr.net']}},'openai/widgetDescription':'Interactive 3D camera, articulated-human pose and shot composition studio.'}}]});
  }
  if(method==='tools/call'){
    if(params.name!==tool.name) return bad(id,-32601,'Unknown tool');
    const subject=params.arguments?.subject||'a cinematic subject';
    const shotType=params.arguments?.shotType||'Medium';
    return ok(id,{structuredContent:{subject,shotType},content:[{type:'text',text:`Opened Camera Director with a ${shotType.toLowerCase()} starting point for ${subject}.`}],_meta:{ui:{resourceUri:URI},'openai/outputTemplate':URI}});
  }
  if(method?.startsWith('notifications/')) return null;
  return bad(id,-32601,`Method not found: ${method}`);
}

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','content-type, accept, mcp-session-id, mcp-protocol-version');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method==='GET'){
    try{
      const source=await loadHtml();
      return res.status(200).json({ok:true,name:'camera-director',version:'0.3.0',bytes:Buffer.byteLength(source),poseable:source.includes('TransformControls')&&source.includes('Move Person')});
    }catch(error){return res.status(500).json({ok:false,error:error instanceof Error?error.message:String(error)})}
  }
  if(req.method!=='POST') return res.status(405).send('Use GET or POST');
  let body=req.body;
  if(typeof body==='string'){
    try{body=JSON.parse(body||'{}')}catch{return res.status(400).json(bad(null,-32700,'Parse error'))}
  }
  const batch=Array.isArray(body),messages=batch?body:[body||{}],replies=[];
  for(const message of messages){const reply=await rpc(message);if(reply)replies.push(reply)}
  if(!replies.length) return res.status(202).end();
  return res.status(200).json(batch?replies:replies[0]);
}
