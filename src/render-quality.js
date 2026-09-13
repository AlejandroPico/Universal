// Adapt only framebuffer resolution, never catalog membership or measured geometry.
export function nextRenderRatio(current,frameMs,native=2){
 const max=Math.min(2,native),min=Math.min(1,native);
 return Math.max(min,Math.min(max,current+(frameMs>34?-.25:frameMs<19?.25:0)));
}
