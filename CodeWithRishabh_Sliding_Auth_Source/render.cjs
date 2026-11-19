const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
let sharp;try{sharp=require('sharp')}catch{sharp=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.cjs')}
const scene=require('./reel.js');
async function run(){
 if(process.argv.includes('--preview')){for(const t of[1.8,3.1,5.5,8,11.5,15.5,17.5,20.6,21.5,23.5])await sharp(Buffer.from(scene.svg(t))).png().toFile(path.join(__dirname,`build-preview-${t}.png`));return}
 const dest=process.argv[2]||path.join(__dirname,'Sliding_Auth_Reel.mp4');
 const ff=spawn('ffmpeg',['-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','720x1280','-r','30','-i','pipe:0','-an','-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','fast','-crf','18','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',dest],{stdio:['pipe','inherit','inherit']});const done=new Promise((a,b)=>ff.on('exit',c=>c===0?a():b(Error('FFmpeg '+c))));
 for(let i=0;i<720;i++){const raw=await sharp(Buffer.from(scene.svg(i/30))).removeAlpha().raw().toBuffer();if(!ff.stdin.write(raw))await new Promise(r=>ff.stdin.once('drain',r));if(i%120===0)console.log(i+'/720')}
 ff.stdin.end();await done;
}run().catch(e=>{console.error(e);process.exit(1)});
