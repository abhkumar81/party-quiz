export const MAX_CLIP_BYTES = 5 * 1024 * 1024;
const formats={mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg',oga:'audio/ogg',aac:'audio/aac',flac:'audio/flac',mp4:'video/mp4',m4v:'video/mp4',webm:'video/webm',mov:'video/quicktime',ogv:'video/ogg'};
export function clipInfo(file){
  if(!file||!Number.isFinite(file.size)||file.size<=0)throw Error('Choose a non-empty audio or video file.');
  if(file.size>MAX_CLIP_BYTES)throw Error('Choose a shorter clip, up to 5 MB.');
  const extension=String(file.name||'').split('.').pop().toLowerCase();
  const mime=(/^(audio|video)\/[a-z0-9.+-]+$/i.test(file.type||'')?file.type:formats[extension])?.toLowerCase();
  if(!mime)throw Error('Choose an audio or video file. MP3 audio and MP4 video are recommended.');
  return {name:String(file.name||'clip').slice(0,200),mime,kind:mime.startsWith('video/')?'video':'audio',size:file.size};
}
export function validClipData(data){return typeof data==='string'&&data.length<=Math.ceil(MAX_CLIP_BYTES/3)*4+150&&/^data:(audio|video)\/[a-z0-9.+-]+;base64,[a-z0-9+/]+={0,2}$/i.test(data);}
