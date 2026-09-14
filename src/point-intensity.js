// Brighten each coloured point without multiplying its RGB into white clipping.
export function pointIntensityShader(shader,gain,points=true){
 shader.uniforms.pointGain=gain;
 shader.fragmentShader='uniform float pointGain;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat peak=max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b));diffuseColor.rgb=diffuseColor.rgb/max(.00001,peak)*(1.0-exp(-peak*pointGain));diffuseColor.a*=min(1.0,pointGain);');
 if(points){shader.vertexShader='uniform float pointGain;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <fog_vertex>','#include <fog_vertex>\ngl_PointSize*=clamp(pow(pointGain,.25),.65,1.7);');}
}
export function tunePoints(material,gain,points=true){if(!material.userData.pointGain){const value={value:gain},previous=material.onBeforeCompile,previousKey=material.customProgramCacheKey();material.userData.pointGain=value;material.onBeforeCompile=shader=>{previous.call(material,shader);pointIntensityShader(shader,value,points);};material.customProgramCacheKey=()=>previousKey+(points?'coloured-points-v1':'coloured-lines-v1');material.needsUpdate=true;}material.userData.pointGain.value=gain;}
