// Reference markers must not masquerade as a complete stellar population.
export function referenceOpacity(distanceLy) {
 const t=Math.max(0,Math.min(1,(distanceLy-4000)/26000));
 return 1-t*t*(3-2*t);
}
