from __future__ import annotations
import argparse
import math
import os
from pathlib import Path
import subprocess
import sys
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT, FPS, DURATION = 720, 1280, 30, 20.0
HANDLE = '@codewithrishabh3596'
ROOT = Path(__file__).resolve().parent

def smooth(value):
    value = np.clip(value, 0.0, 1.0)
    return value * value * (3.0 - 2.0 * value)

def font(size, mono=True):
    names = [ROOT / ('mono.ttf' if mono else 'sans.ttf')]
    names += [Path('/usr/share/fonts/truetype/dejavu/') / ('DejaVuSansMono.ttf' if mono else 'DejaVuSans.ttf')]
    names += [Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts' / ('consola.ttf' if mono else 'arial.ttf')]
    for name in names:
        if name.exists():
            return ImageFont.truetype(str(name), size)
    return ImageFont.load_default()

class Rose:
    def __init__(self):
        rng = np.random.default_rng(3596)
        self.clouds = []
        self.leaves = []
        u, v = np.meshgrid(np.linspace(0, 1, 95), np.linspace(0, 2*np.pi, 21))
        y = 2.20*u.ravel()
        a = v.ravel()
        x = .035*np.cos(a) + .035*np.sin(y*2)
        z = .035*np.sin(a)
        self.stem = np.column_stack((x,y,z))
        for side,base,length in [(-1,.58,.83),(1,1.22,.69)]:
            u,v=np.meshgrid(np.linspace(0,1,95),np.linspace(-1,1,29))
            u,v=u.ravel(),v.ravel()
            x=side*(.025+length*u)
            y=base+.30*u+.22*np.sin(np.pi*u)*(1-v*v)
            z=.28*np.sin(np.pi*u)*v
            self.leaves.append((np.column_stack((x,y,z)), u, v, base))
        self.petals=[]
        for layer,count in enumerate((3,5,7,9)):
            for k in range(count):
                u,v=np.meshgrid(np.linspace(0,1,65),np.linspace(-1,1,37))
                u,v=u.ravel(),v.ravel()
                angle=2*np.pi*k/count+layer*.62
                jitter=rng.uniform(-.015,.015,len(u))
                self.petals.append((layer,u,v,angle,jitter))

    def points(self,t):
        grow=float(smooth(t/3.4))
        opening=float(smooth((t-3.4)/8.8))
        parts=[];colors=[]
        stem=self.stem.copy();stem[:,1]*=grow
        parts.append(stem);colors.append(np.tile([24,121,56],(len(stem),1)))
        for points,u,v,base in self.leaves:
            leaf=points.copy();g=float(smooth((t-base*1.5-.4)/2.6))
            leaf[:,0]*=g;leaf[:,1]=base*grow+(leaf[:,1]-base)*g;leaf[:,2]*=g
            vein=(np.abs(v)<.08)|(np.abs(np.sin(u*9*np.pi+np.abs(v)*3))<.15)
            c=np.column_stack((24+vein*20,95+vein*72+u*18,37+vein*22))
            parts.append(leaf);colors.append(c)
        for layer,u,v,angle,jitter in self.petals:
            layer_open=float(smooth((opening-layer*.075)/.78))
            radius=(.16+.13*layer)*(.35+.65*layer_open)
            radial=radius*(.34+.92*u)+(.04+.11*layer_open)*np.sin(np.pi*u)
            spread=(.34+.38*layer_open)*v
            a=angle+spread+.32*u
            x=radial*np.cos(a)
            z=radial*np.sin(a)
            y=2.24+(1.15+.30*(3-layer)/3)*u-(.12+.12*layer_open)*u*u
            y+=.12*layer_open*(1-v*v)*np.sin(np.pi*u)
            y-=.12*layer_open*u**5*(np.abs(v)**2)
            petal=np.column_stack((x,y,z))
            bud=float(smooth((t-2.2)/2.2))
            petal[:,0]*=bud;petal[:,2]*=bud
            petal[:,1]=2.20*grow+(petal[:,1]-2.20)*bud
            rim=(u>.94)|(np.abs(v)>.94)
            light=np.clip(.60+.32*np.cos(a-.8)+.12*u+jitter, .25, 1)
            c=np.column_stack((125+123*light+rim*9,14+43*light+rim*37,29+43*light+rim*25))
            parts.append(petal);colors.append(c)
        for a in np.linspace(0,2*np.pi,5,endpoint=False):
            u=np.linspace(0,1,120)
            x=(.08+.30*u)*np.cos(a);z=(.08+.30*u)*np.sin(a)
            y=2.21-.38*u
            parts.append(np.column_stack((x,y,z))*[1,grow,1]);colors.append(np.tile([25,110,49],(len(u),1)))
        xyz=np.concatenate(parts);rgb=np.clip(np.concatenate(colors),0,255)
        sway=.032*math.sin(t*.8)*float(smooth((t-7)/4))
        xyz[:,0]+=xyz[:,1]*sway
        angle=.12*math.sin(t*.58)
        rotation=np.array([[math.cos(angle),0,-math.sin(angle)],[0,1,0],[math.sin(angle),0,math.cos(angle)]])
        return xyz@rotation.T,rgb,opening,grow

class Renderer:
    def __init__(self,width=720,height=1280):
        self.width,self.height=width,height
        self.rose=Rose();self.mono=font(6);self.small=font(10);self.code=font(11)
        self.header=font(18,False)
        self.source=Path(__file__).read_text(encoding='utf-8').splitlines()

    def render(self,t,art_only=False):
        t=max(0,min(DURATION,t))
        im=Image.new('RGB',(WIDTH,HEIGHT),'black');d=ImageDraw.Draw(im)
        points,colors,opening,grow=self.rose.points(t)
        # Pitch the bloom toward the camera so its layered petals are visible.
        pitch=.17
        yy=points[:,1]-2.20
        y=2.20+yy*math.cos(pitch)-points[:,2]*math.sin(pitch)
        z=yy*math.sin(pitch)+points[:,2]*math.cos(pitch)
        sx=360+points[:,0]*265
        sy=765-y*170-z*55
        cell_w,cell_h=3.6,6.2
        cols,rows=184,108
        gx=np.rint((sx-29)/cell_w).astype(int)
        gy=np.rint((sy-115)/cell_h).astype(int)
        depth=np.full((rows,cols),-np.inf)
        rgb=np.zeros((rows,cols,3));chars=np.full((rows,cols),' ',dtype='<U1')
        ramp='.,:;+=*#%@'
        valid=np.where((gx>=0)&(gx<cols)&(gy>=0)&(gy<rows))[0]
        # A z-buffer makes the nearest petal occlude the ones behind it.
        for i in valid:
            cx,cy=gx[i],gy[i]
            if z[i]>=depth[cy,cx]:
                depth[cy,cx]=z[i];rgb[cy,cx]=colors[i]
                lum=float(np.max(colors[i]))/255
                chars[cy,cx]=ramp[min(len(ramp)-1,int(lum*5)+(i%4))]
        for cy,cx in zip(*np.where(np.isfinite(depth))):
            d.text((29+cx*cell_w,115+cy*cell_h),str(chars[cy,cx]),font=self.mono,fill=tuple(rgb[cy,cx].astype(int)))
        places=[(26,180),(583,220),(55,305),(580,382),(23,464),(578,535),(70,616),(558,689)]
        for i,(x,y0) in enumerate(places):
            intensity=(.5+.5*math.sin(t*1.65+i*1.81))**3
            bright=.06+.85*intensity
            d.text((x,y0),'LOVE YOU',font=self.small,fill=(int(246*bright),int(157*bright),int(174*bright)))
        if not art_only:
            d.text((15,16),HANDLE,font=self.header,fill=(245,245,245))
            d.text((16,43),'PYTHON  |  ASCII ROSE',font=self.small,fill=(148,148,148))
            d.text((26,792),f'bloom {opening*100:5.1f}%   sway {math.sin(t*.8):+.2f}',font=self.small,fill=(127,127,127))
            d.text((26,809),f'letters  {int(np.isfinite(depth).sum()):,}',font=self.small,fill=(105,105,105))
            d.line((15,845,705,845),fill=(45,45,45))
            d.text((20,826),'PY  rose_bloom.py',font=self.small,fill=(186,186,186))
            d.text((630,826),f'{FPS} fps',font=self.small,fill=(115,115,115))
            first=25+int(t*3.6)
            first=min(first,max(0,len(self.source)-22))
            active=int(t*2)%20
            for j,line in enumerate(self.source[first:first+22]):
                y0=864+j*17
                if j==active:d.rectangle((57,y0-1,704,y0+15),fill=(44,24,31))
                d.text((19,y0),str(first+j+1),font=self.code,fill=(96,96,96))
                color=(207,196,195)
                if line.lstrip().startswith(('def ','class ','return ','for ','if ')):color=(207,143,175)
                d.text((65,y0),line[:88],font=self.code,fill=color)
        return im.resize((self.width,self.height),Image.Resampling.LANCZOS) if (self.width,self.height)!=(WIDTH,HEIGHT) else im

def export_video(renderer,path,seconds,fps):
    count=max(1,round(seconds*fps))
    command=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{renderer.width}x{renderer.height}','-r',str(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(path)]
    try:process=subprocess.Popen(command,stdin=subprocess.PIPE)
    except FileNotFoundError:raise SystemExit('MP4 export requires FFmpeg on your PATH.')
    try:
        for frame in range(count):
            process.stdin.write(renderer.render(frame/fps).tobytes())
            if frame%fps==0:print(f'Rendering {frame//fps}/{seconds:g} seconds',flush=True)
        process.stdin.close()
        if process.wait()!=0:raise RuntimeError('FFmpeg export failed')
    except BaseException:
        process.kill();process.wait();raise

def preview(renderer):
    import tkinter as tk
    from PIL import ImageTk
    root=tk.Tk();root.title('CodeWithRishabh — ASCII Rose');root.configure(bg='black')
    label=tk.Label(root,bg='black');label.pack()
    started=time.perf_counter();state={'paused':False,'time':0.0,'last':started}
    def pause(event=None):state['paused']=not state['paused']
    def restart(event=None):state['time']=0.0
    root.bind('<space>',pause);root.bind('r',restart);root.bind('<Escape>',lambda e:root.destroy())
    def tick():
        now=time.perf_counter()
        if not state['paused']:state['time']=(state['time']+now-state['last'])%DURATION
        state['last']=now
        picture=ImageTk.PhotoImage(renderer.render(state['time']))
        label.configure(image=picture);label.image=picture
        root.after(16,tick)
    tick();root.mainloop()

def main():
    parser=argparse.ArgumentParser(description='Animated red ASCII rose with green leaves and twinkling LOVE YOU text.')
    parser.add_argument('--frame',type=float,help='Save one frame at this time instead of opening the window.')
    parser.add_argument('--out',default='rose_preview.png')
    parser.add_argument('--export',type=Path,help='Export a silent MP4 with FFmpeg.')
    parser.add_argument('--seconds',type=float,default=DURATION)
    parser.add_argument('--fps',type=int,default=FPS)
    parser.add_argument('--width',type=int,default=540)
    parser.add_argument('--height',type=int,default=960)
    args=parser.parse_args()
    if args.width%2 or args.height%2 or min(args.width,args.height,args.fps)<=0:parser.error('Use positive even dimensions and a positive fps.')
    if args.seconds<=0:parser.error('--seconds must be positive.')
    renderer=Renderer(args.width,args.height)
    if args.frame is not None:renderer.render(args.frame).save(args.out);print(args.out)
    elif args.export:export_video(renderer,args.export,args.seconds,args.fps)
    else:preview(renderer)

if __name__=='__main__':main()
